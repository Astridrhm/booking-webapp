"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { MoreLinkArg } from '@fullcalendar/core';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  EventInput,
  DateSelectArg,
  EventContentArg,
  DatesSetArg,
} from "@fullcalendar/core";
import { useModal } from "@/hooks/useModal";
import { useRouter } from "next/navigation";
import { formatDateForQuery, formatTime } from "@/utils/time";
import { listBooking, listCalendarBooking } from "../services/bookingService";
import { useAlert } from "@/context/AlertContext";
import { Booking, BookingCalendar, BookingStatus } from "../types/booking";
import ModalBooking from "./ModalBooking";

type CalendarProps = {
  filter: {
    value: string,
    label: string,
    locId: string
  }
}

const Calendar: React.FC<CalendarProps> = ({ filter }) => {
  const router = useRouter()
  const { showAlert } = useAlert()
  const calendarRef = useRef<FullCalendar>(null)

  const { isOpen, openModal, closeModal } = useModal();

  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<EventInput[]>([]);
  const [allEvents, setAllEvents] = useState<EventInput[]>([]);
  const [fetchedKeys, setFetchedKeys] = useState<Set<string>>(new Set());
  
  const [prevFilter, setPrevFilter] = useState<string | null>(null);

  const handleGoToBooking = (f?: any) => {
    if (f) {
      sessionStorage.setItem("temp_room", f.value)
      sessionStorage.setItem("temp_locId", f.locId)
      sessionStorage.setItem("temp_date", selectedDay as unknown as string)
    }
    router.push("/booking/create")
  }

  const getWeekKey = (date: Date) => {
    const monday = new Date(date);
    const day = monday.getDay(); 
    const diff = (day === 0 ? -6 : 1) - day;
    monday.setDate(monday.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    return `W-${monday.toISOString().slice(0, 10)}`;
  };

  const getMonthKey = (date: Date) => {
    const keyDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
    return `M-${keyDate.toISOString().slice(0, 10)}`;
  };
  
  const getDayKey = (date: Date) => {
    return `D-${date.toISOString().slice(0, 10)}`;
  };
  
  const handleDatesSet = useCallback(async (info: DatesSetArg) => {
    if (!filter.value) return

    const viewType = info.view?.type ?? ""
    let key = ""
    let rangeStart = new Date(info.start);
    let rangeEnd = new Date(info.end);

    if (viewType.includes("Month")) {
      const currentStart = new Date(info.view.currentStart);
      const firstDay = new Date(currentStart.getFullYear(), currentStart.getMonth(), 1);
      const lastDay = new Date(currentStart.getFullYear(), currentStart.getMonth() + 1, 0);

      firstDay.setHours(0, 0, 0, 0);
      lastDay.setHours(23, 59, 59, 999);

      key = getMonthKey(firstDay);
      rangeStart = firstDay;
      rangeEnd = lastDay;
    } else {
      const monday = new Date(info.view.currentStart);
      monday.setHours(0, 0, 0, 0);

      const sunday = new Date(monday);
      sunday.setDate(sunday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);

      key = getWeekKey(monday); 
      rangeStart = monday;
      rangeEnd = sunday;
    }

    key = `${filter.value}-${key}`;

    if (fetchedKeys.has(key)) {
      return
    }

    try {
      const raw = await listCalendarBooking({
        roomId: filter.value, 
        startDate: `${formatDateForQuery(rangeStart)} 00:00:00`,
        endDate: `${formatDateForQuery(rangeEnd)} 23:59:59`
      })

      const data = raw && raw.flatMap((item: BookingCalendar) => ({
        id: item.id,
        title: item.title,
        start: new Date(item.startDate),
        end: new Date(item.endDate)
      })) || []

      setAllEvents(prev => {
        const merged = [...prev, ...data]
        const map = new Map()
        merged.forEach(event => map.set(event.id, event))
        return Array.from(map.values())
      })

      setFetchedKeys(prev => {
        const updated = new Set(prev)
        updated.add(key)
        return updated
      })
    } catch (err) {
      showAlert({
        variant: "error",
        title: "Gagal!",
        message: `Failed to fetch events:` + err,
      })
    }
  }, [fetchedKeys, filter, showAlert])

  const handleDateSelect = async (selectInfo: DateSelectArg) => {
    if (!selectInfo) {
      return
    }
    const selectedStart = new Date(selectInfo!.start)
    selectedStart.setHours(0, 0, 0, 0)

    const selectedEnd = new Date(selectedStart)
    selectedEnd.setHours(23, 59, 59, 999)

    const key = `${filter.value}-${getDayKey(selectedStart)}`;
    let dataFilter: any = []
    if (!fetchedKeys.has(key)) {
      try {
        const raw = await listBooking({
          limit: 100,
          filter: {
            roomId: filter.value, 
            startDate: `${formatDateForQuery(selectInfo.start)} 00:00:00`,
            endDate: `${formatDateForQuery(selectInfo.start)} 23:59:59`,
            status: BookingStatus.approved
          }
        })

        dataFilter = raw.list && raw.list.map((item: Booking) => ({
          id: item.id,
          title: item.title,
          start: new Date(item.startDate),
          end: new Date(item.endDate),
          extendedProps: {
            category: item.category,
            description: item.description,
            roomName: item.room.name,
            floor: item.room.floor,
            capacity: item.room.capacity,
            bookedBy: item.user.name,
          }
        })) || []

        setFetchedKeys(prev => {
          const updated = new Set(prev)
          updated.add(key)
          return updated
        })
      } catch (err) {
        showAlert({
          variant: "error",
          title: "Gagal!",
          message: `Failed to fetch events:` + err,
        })
      }
    }
    setSelectedDay(selectedStart)
    setSelectedDate(prev => {
      const merged = [...prev, ...dataFilter]

      const map = new Map<string, EventInput>()
      merged.forEach((event: any) => {
        map.set(event.id, event)
      })

      return Array.from(map.values())
    })
    openModal()
  }

  const selectedDateForModal = React.useMemo(() => {
    if (!selectedDay) return [];

    const startDay = new Date(selectedDay);
    startDay.setHours(0, 0, 0, 0);

    const endDay = new Date(selectedDay);
    endDay.setHours(23, 59, 59, 999);

    return selectedDate.filter((event: any) => {
      const start = new Date(event.start as string | Date);
      const end = new Date(event.end as string | Date);

      return start <= endDay && end >= startDay;
    });
  }, [selectedDay, selectedDate]);


  const handleMoreLinkClick = (data: MoreLinkArg) => {
    const pseudoSelectArg = {
      start: data.date,
      end: new Date(new Date(data.date).getTime() + 24 * 60 * 60 * 1000),
      allDay: data.allDay,
      jsEvent: data.jsEvent,
      view: data.view,
    } as DateSelectArg

    handleDateSelect(pseudoSelectArg)
  }

  // const handleEventClick = (clickInfo: EventClickArg) => {
  //   console.log("TYPE", typeof clickInfo.event)
  //   console.log("Event di click", clickInfo.event)
  //   const event = clickInfo.event;
  //   setSelectedEvent();
  //   console.log("Click Info", clickInfo.event)
  //   openModal();
  // }

  useEffect(() => {
    if (!calendarRef.current) return;

    const calendarApi = calendarRef.current.getApi();
    const view = calendarApi.view;

    if (filter.value !== prevFilter) {
      setFetchedKeys(new Set())
      setAllEvents([])
      setPrevFilter(filter.value)

      handleDatesSet({
        start: view.activeStart,
        end: view.activeEnd,
        view,
        startStr: view.activeStart.toISOString(),
        endStr: view.activeEnd.toISOString(),
        timeZone: "local",
      })
    }
  }, [handleDatesSet, filter])

  return (
    <div className="rounded-2xl border border-gray-200 bg-white">
      <div className="custom-calendar">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next addEventButton",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          datesSet={handleDatesSet}
          events={allEvents}
          selectable={true}
          select={handleDateSelect}
          // eventClick={handleEventClick}
          eventContent={renderEventContent}
          dayMaxEvents={2}
          moreLinkClick={(arg) => {
            arg.jsEvent.preventDefault()
            handleMoreLinkClick(arg)
            return "none"
          }}
          customButtons={{
            addEventButton: {
              text: "Booking Room",
              click: () => handleGoToBooking(),
            },
          }}
        />
      </div>
      <ModalBooking
        isOpen={isOpen}
        closeModal={closeModal}
        selectedDate={selectedDateForModal}
        selectedDay={selectedDay}
        roomLabel={filter.label}
        handleGoToBooking={() => handleGoToBooking(filter)}
      />
    </div>
  );
};

const renderEventContent = (eventInfo: EventContentArg) => {
  const startDate = eventInfo.event.start
  const endDate = eventInfo.event.end

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const isPast = endDate! < today

  if (!startDate || !endDate) return null

  const startTime = formatTime(startDate)
  const endTime = formatTime(endDate)
  
  return (
    <div
        className={`event-fc-color flex fc-event-main p-1 rounded-sm ${
          isPast ? "fc-bg-danger" : "fc-bg-primary"
        }`}
        style={{ width: "-webkit-fill-available" }}
      >
      <span className="fc-event-time shrink-0 truncate">{startTime} - {endTime}</span>
      <span className="fc-event-title truncate">{eventInfo.event.title}</span>
    </div>
  );
};

export default Calendar
