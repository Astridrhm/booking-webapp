'use client'

import Input from "@/components/ui/form/input/InputField"
import { FilterData } from "../types/department"

type FilterProps = {
  value: FilterData
  onChange: React.Dispatch<React.SetStateAction<FilterData>>
}

export default function Filter({ value, onChange}: FilterProps) {
  const updateFilter = (key: keyof FilterData, val: string | Date) => {
    onChange(prev => ({ ...prev, [key]: val }))
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 justify-around py-3">
      <div className="relative w-full">
        <Input
          placeholder="Search..."
          value={value.name}
          onChange={(e) => updateFilter("name", e.target.value)}
        />
      </div>
    </div>
  )
}
