'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, DeepPartial, useForm, useWatch  } from "react-hook-form"
import z from "zod"
import Label from "../../../components/ui/form/Label"
import Input from "../../../components/ui/form/input/InputField"
import Select from "../../../components/ui/form/Select"
import Button from "../../../components/ui/button/Button"
import { useEffect, useRef, useState } from "react"
import useGoBack from "@/hooks/useGoBack"
import DatePicker from "../../../components/ui/form/date-picker"
import { formatDateForQuery, formatTime, getCurrenttimeSlot, getSelectedDate, splitTime, timeSlot } from "@/utils/time"
import TextArea from "../../../components/ui/form/input/TextArea"
import { useAlert } from "@/context/AlertContext"
import { createBooking, listBooking, updateBooking } from "../services/bookingService"
import { Booking, BookingStatus, BookingRequest } from "../types/booking"
import { useAuth } from "@/features/auth/context/AuthContext"
import Switch from "@/components/ui/form/switch/Switch"
import { getLocation, listRoom } from "@/features/room/services/roomService"
import { Room } from "@/features/room/types/room"
import { listCategories, listSubCategories } from "@/features/category/services/categoryService"
import { useRouter } from "next/navigation"

interface props {
  bookingId?: string
  bookingData?: Booking
  mode?: string
}

const createSchema = z.object({
  category: z.string().min(2, "Wajib diisi"),
  subCategory: z.string().min(2, "Wajib diisi"),
  pic: z.string().optional().or(z.literal("")),
  contactType: z.string().min(2, "Wajib diisi"),
  detailContactType: z.string().min(2, "Wajib diisi"),
  location: z.string("Wajib diisi"),
  shortDescription: z.string().min(2, "Wajib diisi"),
  detailDescription: z.string().optional(),
  room: z.string(),
  capacity: z.string(),
  floor: z.string(),
  startDate: z.string().min(1, "Wajib diisi"),
  startTime: z.string("Wajib diisi"),
  endTime: z.string("Wajib diisi")
})

const updateSchema = createSchema.partial()

type CreateBookingData = z.infer<typeof createSchema>
type UpdateBookingData = z.infer<typeof updateSchema>

export default function BookingForm({bookingId, bookingData, mode}: props) {
  const isUpdate = mode === 'update'
  
  const { showAlert } = useAlert()
  const { user } = useAuth()
  const goBack = useGoBack()
  const router = useRouter()

  const initialized = useRef(false)

  const [categoryOptions, setCategoryOptions] = useState< Array<{ value: string; label: string }>>([])
  const [subCategoryOptions, setSubCategoryOptions] = useState<Array<{ value: string; label: string }>>([])
  const [locationDropdownOption, setLocationDropdownOption] = useState<Array<{ value: string; label: string }>>([])
  const [ roomDropdownOption, setRoomDropdownOption ] = useState<Array<{ value: string; label: string }>>([])
  const [roomRawList, setRoomRawList] = useState<Room[]>([])
  
  const [ selfBooking, setSelfBooking ] = useState<boolean>()

  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [startBookedDate, setStartBookedDate] = useState<string[]>([])

  const { control, reset, watch, setValue, getValues, handleSubmit, formState: { errors } } = useForm<CreateBookingData | UpdateBookingData>({
    resolver: zodResolver(isUpdate? updateSchema : createSchema),
    defaultValues: {
      category: bookingData?.category || "",
      subCategory: bookingData?.subCategoryId || "",
      pic: bookingData?.pic || "",
      contactType: "",
      detailContactType: "",
      location: bookingData?.room && bookingData?.room.locationId || "",
      shortDescription: bookingData?.title || "",
      detailDescription: bookingData?.description || "",
      room: bookingData?.roomId || "",
      capacity: bookingData?.room && bookingData?.room.capacity || "",
      floor: bookingData?.room && bookingData?.room.floor || "",
      startDate: "",
      startTime: "",
      endTime: ""
    }
  })

  const selectedContactType = useWatch({ control, name: 'contactType' })
  const selectedStartDate = useWatch({ control, name: 'startDate' })
  const selectedStartTime = useWatch({ control, name: 'startTime' })
  const selectedCategory = useWatch({ control, name: 'category' })
  const selectedRoom = useWatch({ control, name: 'room' })
  const selectedLocation = useWatch({ control, name: 'location' })
  const currentFormDetailContact = watch("detailContactType")

  useEffect(() => {
    if (!user || !selfBooking) return

    const currentValue = selectedContactType === 'email' ? user.user.email : user.user.contact
    if (currentValue && currentFormDetailContact !== currentValue) {
      setValue("detailContactType", currentValue)
    } else if (!currentValue && currentFormDetailContact !== "") {
      setValue("detailContactType", "") 
      showAlert({
        variant: "warning",
        title: `${selectedContactType} tidak tersedia`,
        message: "Silakan lengkapi profil Anda.",
      })
    }
  }, [user, selectedContactType, selfBooking, currentFormDetailContact, setValue, showAlert])

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const initData = async () => {
      const [cat, loc] = await Promise.all([listCategories(), getLocation()])
      setCategoryOptions(cat.map(c => ({ value: c.id, label: c.name })))
      setLocationDropdownOption(loc.map(l => ({ value: l.id, label: l.name })))
    }

    initData()
  }, [])

  useEffect(() => {
    if (!selectedCategory) return
    listSubCategories(selectedCategory).then(res => {
      setSubCategoryOptions(res.map(s => ({ value: s.id, label: s.name })))
    })
  }, [selectedCategory])

  useEffect(() => {
    setValue("category", categoryOptions[0]?.value)
    setValue("subCategory", subCategoryOptions[0]?.value)
  }, [categoryOptions, subCategoryOptions])

  useEffect(() => {
    if (!selectedLocation) return
    listRoom({ filter: { locationId: selectedLocation } }).then(res => {
      const rooms = res.list || []
      setRoomDropdownOption(rooms.map(r => ({ value: r.id, label: r.name })))
      setRoomRawList(rooms)
    })
  }, [selectedLocation])

  useEffect(() => {
    if (!selectedRoom) return
    const r = roomRawList.find(r => r.id === selectedRoom)
    if (r) {
      setValue("capacity", r.capacity)
      setValue("floor", r.floor)
    }
  }, [selectedRoom, roomRawList])

  const disabledTimeOption = (time: string) => {
    const startIndex = timeSlot.indexOf(selectedStartTime!) 
    const currentIndex = timeSlot.indexOf(time) 

    if (currentIndex <= startIndex) return true
    if (bookedSlots.includes(time) && !startBookedDate.includes(time)) return true 

    const timeRange = timeSlot.slice(startIndex + 1, currentIndex + 1)
    return timeRange.some(t => bookedSlots.includes(t) && !startBookedDate.includes(t))
  }

  const duration = (time: string): string => {
    if (!selectedStartTime) return "";

    const start = splitTime(selectedStartTime);
    const end = splitTime(time);

    if (end <= start) return "";

    const totalMinutes = end - start;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours && minutes) return `${hours} hours ${minutes} minutes`;
    if (hours) return `${hours} hours`;
    if (minutes) return `${minutes} minutes`;

    return "";
  }

  const handleLabelEndTime = (time: string): string => {
    const dur = duration(time);
    return `${time}${dur ? ` (${dur})` : ''}`;
  }

  useEffect(() => {
    const fetchBookingData = async () => {
      if (!selectedStartDate || !selectedRoom) return

      try {
        const res = await listBooking({
          filter: {
            roomId: selectedRoom,
            startDate: `${selectedStartDate} 00:00:00`,
            endDate: `${selectedStartDate} 23:59:00`,
            status: BookingStatus.approved
          },
        })
        const booked = res.list && res.list.flatMap(booking => {
          if (isUpdate && booking.id === bookingId) {
            return []
          }
          const start = timeSlot.indexOf(formatTime(new Date(booking.startDate)))
          const end = timeSlot.indexOf(formatTime(new Date(booking.endDate)))

          if (start === -1 || end === -1) {
            return []
          }
          return timeSlot.slice(start, end)
        }) || []

        const startDateSlot = res.list && res.list.flatMap((booking) => formatTime(new Date(booking.startDate))) || []
      
        const today = new Date().toLocaleDateString('en-CA')
        const currenttimeSlot = getCurrenttimeSlot()

        let disabledtimeSlot: string[] = []
        if (selectedStartDate === today) {
          disabledtimeSlot = timeSlot.filter(time => time < currenttimeSlot)
        }

        const allDisabledSlots = [...booked, ...disabledtimeSlot]

        setBookedSlots(allDisabledSlots)
        setStartBookedDate(startDateSlot)
      } catch (err: any) {
        showAlert({ variant: 'error', title: 'Gagal!', message: err.message })
      }
    }
    fetchBookingData()
  }, [bookingId, isUpdate, selectedRoom, selectedStartDate])

  useEffect(() => {
    let draft: DeepPartial<Booking> = {}
    let full: Booking | null = null

    if (isUpdate && bookingData) {
      full = bookingData
    } else {
      if (
        Object.keys(sessionStorage).some(value => value.includes("temp"))
      ) {
        draft = {
          roomId: sessionStorage.getItem("temp_room")!,
          startDate: sessionStorage.getItem("temp_date")!,
          room: {
            id: sessionStorage.getItem("temp_room")!,
            locationId: sessionStorage.getItem("temp_locId")!,
          },
        }
      }
    }

    if (draft.roomId || full) {
      reset({
        contactType: full?.detailContact && /^\d+$/.test(full.detailContact) ? "whatsapp" : "email",
        detailContactType: full?.detailContact || "",
        room: roomDropdownOption.find(opt => opt.value === (full?.roomId || draft.roomId || ""))?.value || "",
        startDate: "",
        startTime: "",
        endTime: "",
      })

      if (full?.startDate && full?.endDate) {
        const startDate = getSelectedDate(new Date(full.startDate))
        const startTime = formatTime(new Date(full.startDate))
        const endTime = formatTime(new Date(full.endDate))

        setValue("startDate", startDate)
        setValue("startTime", startTime)
        setValue("endTime", endTime)
      }

      if (draft.startDate) {
        const startDate = getSelectedDate(new Date(draft.startDate))
        const startTime = formatTime(new Date(draft.startDate))
        setValue("startDate", startDate)
        setValue("startTime", startTime)
        setValue("location", draft.room?.locationId)
      }

      setSelfBooking(full?.pic === "" || draft.pic === "")
    }
  }, [bookingData, isUpdate, roomDropdownOption, reset, setValue])

  useEffect(() => {
    const currentEndTime = getValues("endTime")

    if (selectedStartTime && currentEndTime) {
      const start = splitTime(selectedStartTime)
      const end = splitTime(currentEndTime)

      if (end <= start) {
        setValue("endTime", "")
      }
    } else {
      setValue("endTime", "")
    }
  }, [selectedStartTime])

  useEffect(() => {
    const handleClick = () => {
      const keys = Object.keys(sessionStorage)
      for (let i = 0; i <= keys.length; i++) {
        const key = keys[i]
        if (key && key.includes('temp')) {
          sessionStorage.removeItem(key)
        }
      }
    }

    document.addEventListener("click", handleClick)

    return () => {
      document.removeEventListener("click", handleClick)
    }
  }, [])

  const onSubmit = async (values: CreateBookingData | UpdateBookingData) => {
    const payload: BookingRequest = {
      ...(isUpdate ? {
        bookingId: bookingId,
      } : {
        roomId: values.room,
        userId: user!.user.id,
        category: values.category,
        subCategoryId: values.subCategory
      }),
      title: values.shortDescription,
      description: values.detailDescription,
      startDate: `${values.startDate} ${values.startTime}:00`,
      endDate: `${values.startDate} ${values.endTime}:00`,
      pic: values.pic?.trim() === "" ? null : `${values.pic}`,
      detailContact: currentFormDetailContact
    }

    try {
      if (isUpdate) {
        await updateBooking(payload)
      } else {
        await createBooking(payload)
      }
      showAlert({ variant: 'success', title: 'Berhasil!', message: 'Data berhasil disimpan!' })
      router.replace("/booking")
    } catch (err: any) {
      showAlert({ variant: 'error', title: 'Gagal!', message: err.message })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-3">
        <div>
          <Controller 
            control={control}
            name="category"
            render={({field}) => (
            <>
              <div>
                <Label>
                  Category <span className="text-error-500">*</span>{" "}
                </Label>
                <div className="relative">
                  <Select
                    options={categoryOptions}
                    placeholder="Select Category"
                    disabled={isUpdate || true}
                    {...field}
                  />
                </div>
              </div>
              <span className={`text-xs block min-h-[1rem] ${errors.category ? "text-red-400" : "invisible"}`}>
                {errors.category?.message || "placeholder"}
              </span>
            </>
            )}  
          />
        </div>
        <div>
          <Controller 
            control={control}
            name="subCategory"
            render={({field}) => (
            <>
              <div>
                <Label>
                  Sub Category <span className="text-error-500">*</span>{" "}
                </Label>
                <div className="relative">
                  <Select
                    options={subCategoryOptions}
                    disabled={!selectedCategory || true}
                    placeholder="Select Sub Category"
                    {...field}
                  />
                </div>
              </div>
              <span className={`text-xs block min-h-[1rem] ${errors.subCategory ? "text-red-400" : "invisible"}`}>
                {errors.subCategory?.message || "placeholder"}
              </span>
            </>
            )}  
          />
        </div>
        <div>
          <Controller 
            control={control}
            name="pic"
            render={({field}) => (
            <>
              <div>
                <Label>
                  PIC
                </Label>
                <Switch checked={selfBooking} onChange={(checked) => setSelfBooking(checked)} label="book for your self"/>
                {!selfBooking && <div className="pt-3">
                  <Input type="text" placeholder="PIC" {...field}/>
                  </div>}
              </div>
              <span className={`text-xs block min-h-[1rem] ${errors.detailContactType ? "text-red-400" : "invisible"}`}>
                {errors.detailContactType?.message || "placeholder"}
              </span>
            </>
            )}  
          />
        </div>
        <div>
          <Controller 
            control={control}
            name="contactType"
            render={({field}) => (
            <>
              <div>
                <Label>
                  Contact Type <span className="text-error-500">*</span>{" "}
                </Label>
                <div className="relative">
                  <Select
                    options={[
                      { value: "whatsapp", label: "Whatsapp" },
                      { value: "email", label: "Email" }
                    ]}
                    placeholder="Select Contact Type"
                    className="dark:bg-dark-900"
                    {...field}
                  />
                </div>
              </div>
              <span className={`text-xs block min-h-[1rem] ${errors.contactType ? "text-red-400" : "invisible"}`}>
                {errors.contactType?.message || "placeholder"}
              </span>
            </>
            )}  
          />
        </div>
        <div>
          <Controller 
            control={control}
            name="detailContactType"
            render={({field}) => (
            <>
              <div>
                <Label>
                  Detail Contact Type
                </Label>
                <Input type="text" placeholder="Detail Contact Type " {...field}/>
              </div>
              <span className={`text-xs block min-h-[1rem] ${errors.detailContactType ? "text-red-400" : "invisible"}`}>
                {errors.detailContactType?.message || "placeholder"}
              </span>
            </>
            )}  
          />
        </div>
        <div>
          <Controller 
            control={control}
            name="location"
            render={({field}) => (
            <>
              <div>
                <Label>
                  Building <span className="text-error-500">*</span>{" "}
                </Label>
                <div className="relative">
                  <Select
                    options={locationDropdownOption}
                    placeholder="contact type"
                    disabled={isUpdate}
                    {...field}
                  />
                </div>
              </div>
              <span className={`text-xs block min-h-[1rem] ${errors.location ? "text-red-400" : "invisible"}`}>
                {errors.location?.message || "placeholder"}
              </span>
            </>
            )}  
          />
        </div>
        <div>
          <Controller 
            control={control}
            name="shortDescription"
            render={({field}) => (
            <>
              <div>
                <Label>
                  Short Description <span className="text-error-500">*</span>{" "}
                </Label>
                <Input type="text" placeholder="Detail Contact Type " {...field}/>
              </div>
              <span className={`text-xs block min-h-[1rem] ${errors.shortDescription ? "text-red-400" : "invisible"}`}>
                {errors.shortDescription?.message || "placeholder"}
              </span>
            </>
            )}  
          />
        </div>
        <div>
          <Controller 
            control={control}
            name="detailDescription"
            render={({field}) => (
            <>
              <div>
                <Label>
                  Detail Description
                </Label>
                <TextArea {...field}/>
              </div>
              <span className={`text-xs block min-h-[1rem] ${errors.detailDescription ? "text-red-400" : "invisible"}`}>
                {errors.detailDescription?.message || "placeholder"}
              </span>
            </>
            )}  
          />
        </div>
        <div>
          <Controller 
            control={control}
            name="room"
            render={({field}) => (
            <>
              <div>
                <Label>
                  Room <span className="text-error-500">*</span>{" "}
                </Label>
                <div className="relative">
                  <Select
                    options={roomDropdownOption}
                    disabled={!roomDropdownOption || isUpdate}
                    placeholder="Select Room"
                    className="dark:bg-dark-900"
                    {...field}
                  />
                </div>
              </div>
              <span className={`text-xs block min-h-[1rem] ${errors.room ? "text-red-400" : "invisible"}`}>
                {errors.room?.message || "placeholder"}
              </span>
            </>
            )}  
          />
        </div>
        <div>
          <Controller 
            control={control}
            name="capacity"
            render={({field}) => (
            <>
              <div>
                <Label>
                  Capacity
                </Label>
                <Input type="text" placeholder="capacity" disabled {...field}/>
              </div>
              <span className={`text-xs block min-h-[1rem] ${errors.capacity ? "text-red-400" : "invisible"}`}>
                {errors.capacity?.message || "placeholder"}
              </span>
            </>
            )}  
          />
        </div>
        <div>
          <Controller 
            control={control}
            name="floor"
            render={({field}) => (
            <>
              <div>
                <Label>
                  Floor
                </Label>
                <Input type="text" placeholder="Floor" disabled {...field}/>
              </div>
              <span className={`text-xs block min-h-[1rem] ${errors.floor ? "text-red-400" : "invisible"}`}>
                {errors.floor?.message || "placeholder"}
              </span>
            </>
            )}  
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 items-end gap-3">
          <Controller 
            control={control}
            name="startDate"
            render={({field}) => (
              <>
                <div>
                  <Label>Date<span className="text-error-500">*</span></Label>
                  <div className="flex flex-col lg:flex-row gap-3">
                    <DatePicker
                      key={field.value} 
                      id="start-date-picker"
                      placeholder="Select a date"
                      onChange={([selectedDate]) => {
                        if (selectedDate instanceof Date) {
                          field.onChange(formatDateForQuery(selectedDate)) 
                        }
                      }}
                      defaultDate={field.value ? new Date(field.value) : undefined}
                    />
                  </div>
                </div>
              </>
            )}
          />
          <Controller 
            control={control}
            name="startTime"
            render={({ field }) => (
              <Select
                options={timeSlot.map((time) => ({
                  value: time,
                  label: time,
                  disabled: bookedSlots.includes(time),
                }))}
                disabled={!selectedStartDate || !selectedRoom}
                placeholder="Start Time"
                value={field.value}
                onChange={(val) => field.onChange(val)}
              />
            )}
          />
          <Controller 
            control={control}
            name="endTime"
            render={({ field }) => (
              <Select
                options={timeSlot.map((time) => ({
                  value: time,
                  label: handleLabelEndTime(time),
                  disabled: disabledTimeOption(time)
                }))}
                disabled={!selectedStartDate || !selectedStartTime}
                placeholder="End time"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>
        <div className="flex gap-3 pt-2 justify-end">
          <Button type="button" size="sm" variant="outline" onClick={goBack}>
            Cancel
          </Button>
          <Button type="submit" size="sm">
            {isUpdate ? "Update" : "Simpan"}
          </Button>
        </div>
      </div>
    </form>
  )
}