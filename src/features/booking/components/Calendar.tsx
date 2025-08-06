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
import { formatDateForQuery, FormatTime } from "@/utils/time";
import { listBooking } from "../services/bookingService";
import { useAlert } from "@/context/AlertContext";
import { Booking, BookingStatus } from "../types/booking";
import ModalBooking from "./ModalBooking";

type CalendarProps = {
  filter: string;
};

const Calendar: React.FC<CalendarProps> = ({ filter }) => {
  const router = useRouter();
  const { showAlert } = useAlert();
  const calendarRef = useRef<FullCalendar>(null);

  const { isOpen, openModal, closeModal } = useModal();

  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<EventInput[]>([]);
  const [allEvents, setAllEvents] = useState<EventInput[]>([]);

  const [fetchedKeys, setFetchedKeys] = useState<Set<string>>(new Set());
  const [prevFilter, setPrevFilter] = useState<string | null>(null);

  const handleGoToBooking = () => {
    router.push("/booking/create");
  };

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
  
  const handleDatesSet = useCallback(async (info: DatesSetArg) => {
    if (!filter) return;

    const viewType = info.view?.type ?? "";
    let key = "";
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

    key = `${filter}-${key}`;

    console.log("FINAL FETCH RANGE:", {
      viewType,
      key,
      rangeStart: rangeStart.toISOString(),
      rangeEnd: rangeEnd.toISOString(),
    });

    if (fetchedKeys.has(key)) {
      console.log("✅ Skip fetch (cached):", key);
      return;
    }

    try {
      console.log("ini data", formatDateForQuery(rangeStart))
      const raw = await listBooking({ 
        // orderDir: "",
        // orderBy: "DESC",
        filter: { 
          roomId: filter, 
          startDate: `${formatDateForQuery(rangeStart)} 00:00:00`,
          endDate: `${formatDateForQuery(rangeEnd)} 23:59:00`,
          status: BookingStatus.approved
        }
      })

      const data: EventInput[] = raw.list && raw.list.map((item: Booking) => ({
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
      })) || [];

      setAllEvents(prev => {
        const merged = [...prev, ...data];
        const map = new Map();
        merged.forEach(event => map.set(event.id, event));
        return Array.from(map.values());
      });

      setFetchedKeys(prev => {
        const updated = new Set(prev);
        updated.add(key);
        return updated;
      });
    } catch (err) {
      showAlert({
        variant: "error",
        title: "Gagal!",
        message: `Failed to fetch events:` + err,
      });
    }
  }, [fetchedKeys, filter]);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const selectedStart = new Date(selectInfo.start ?? selectInfo.start);
    selectedStart.setHours(0, 0, 0, 0);

    const selectedEnd = new Date(selectedStart);
    selectedEnd.setHours(23, 59, 59, 999);

    const dataFilter = allEvents.filter((data) => {
      const startDate = new Date(data.start as string | Date);
      const endDate = new Date(data.end as string | Date);
      return startDate <= selectedEnd && endDate >= selectedStart;
    });

    setSelectedDay(selectedStart);
    setSelectedDate(dataFilter);
    openModal()
  };

  const handleMoreLinkClick = (data: MoreLinkArg) => {
    const pseudoSelectArg = {
      start: data.date,
      end: new Date(new Date(data.date).getTime() + 24 * 60 * 60 * 1000),
      allDay: data.allDay,
      jsEvent: data.jsEvent,
      view: data.view,
    } as DateSelectArg;

    handleDateSelect(pseudoSelectArg);
  };

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

    if (filter !== prevFilter) {
      setFetchedKeys(new Set());
      setAllEvents([]);
      setPrevFilter(filter);

      handleDatesSet({
        start: view.activeStart,
        end: view.activeEnd,
        view,
        startStr: view.activeStart.toISOString(),
        endStr: view.activeEnd.toISOString(),
        timeZone: "local",
      });
    }
  }, [handleDatesSet, filter]);


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
            arg.jsEvent.preventDefault();
            handleMoreLinkClick(arg);
            return "none";
          }}
          customButtons={{
            addEventButton: {
              text: "Booking Room",
              click: handleGoToBooking,
            },
          }}
        />
      </div>
      <ModalBooking
        isOpen={isOpen}
        closeModal={closeModal}
        selectedDate={selectedDate}
        selectedDay={selectedDay}
        handleGoToBooking={handleGoToBooking}
      />
    </div>
  );
};

const renderEventContent = (eventInfo: EventContentArg) => {
  const startDate = eventInfo.event.start;
  const endDate = eventInfo.event.end;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isPast = endDate! < today;

  if (!startDate || !endDate) return null;

  const startTime = FormatTime(startDate);
  const endTime = FormatTime(endDate);
  
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

export default Calendar;
