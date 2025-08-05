'use client'

import { useEffect, useRef, useState } from "react"
import Select from "@/components/ui/form/Select"
import { useAlert } from "@/context/AlertContext"
import DatePicker from "@/components/ui/form/date-picker"
import { BookingStatus, FilterData } from "../types/booking"
import { listRoom } from "@/features/room/services/roomService"

type GroupedOption = {
  label: string
  options: {
    value: string
    label: string
  }[]
}

type FilterProps = {
  value: FilterData
  onChange: React.Dispatch<React.SetStateAction<FilterData>>
  date?: boolean
  status?: boolean
}

const statusOptions = [
  { value: "all", label: "semua" },
  { value: BookingStatus.approved, label: "approved" },
  // { value: BookingStatus.requested, label: "requested" },
  // { value: BookingStatus.rejected, label: "rejected" },
  { value: BookingStatus.canceled, label: "canceled" },
]

export default function Filter({ value, onChange, date, status }: FilterProps) {
  const [roomFilter, setRoomFilter] = useState<GroupedOption[]>([])

  const { showAlert } = useAlert()
   const mountedRef = useRef(false)

  const handleRoomFilter = async () => {
    try {
      const res = await listRoom({})
      const grouped: Record<string, GroupedOption> = {}

      if (!res.list) {
        return 
      }

      res.list.forEach((room) => {
        const locId = room.locationId
        const locName = room.location.name

        if (!grouped[locId]) {
          grouped[locId] = {
            label: locName,
            options: []
          }
        }

        grouped[locId].options.push({
          value: room.id,
          label: room.name
        })
      })

      const groupList = Object.values(grouped)
      setRoomFilter(groupList)

      if (!value.room && groupList.length > 0) {
        const defaultRoomId = groupList[0].options[0].value
        const newFilter = { ...value, room: defaultRoomId }
        onChange(newFilter)
      }

    } catch (error: any) {
      showAlert({
        variant: "error",
        title: "Terjadi Kesalahan!",
        message: error.message,
      })
    }
  }

  useEffect(() => {
    if (mountedRef.current) return
    mountedRef.current = true
    handleRoomFilter()
  }, [])

  const updateFilter = (key: keyof FilterData, val: string | Date) => {
    onChange(prev => ({ ...prev, [key]: val }))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 justify-around py-3">
      <div
        className={`col-span-1 relative z-20 ${
          !date && !status ? "lg:col-span-3" : ""
        }`}
      >
        <Select
          options={roomFilter}
          isGrouped
          placeholder="Pilih ruangan"
          value={value.room}
          onChange={(val) => updateFilter("room", val)}
          className="bg-white"
        />
      </div>

      {date && (
        <div className="relative z-10">
          <DatePicker
            id="range-date-picker"
            placeholder="Pilih rentang tanggal"
            mode="range"
            onChange={(selectedDates, _, instance) => {
              const [start, end] = selectedDates
              if (start) updateFilter("startDate", start)
              if (end) updateFilter("endDate", end)
              if (selectedDates.length === 2) instance.close()
            }}
          defaultDate={value.startDate && value.endDate ? [value.startDate, value.endDate] : undefined}
          />
        </div>
      )}

      {status && (
        <Select
          placeholder="Pilih status"
          options={statusOptions}
          value={value.status === "" ? "all" : value.status}
          onChange={(val) => updateFilter("status", val === "all" ? "" : val)}
          className="bg-white"
        />
      )}
    </div>
  )
}
