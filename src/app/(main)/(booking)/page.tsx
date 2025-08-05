'use client'

import Calendar from "@/features/booking/components/Calendar";
import Filter from "@/features/booking/components/Filter";
import { FilterData } from "@/features/booking";
import { useState } from "react";

export default function Page() {
  const [filter, setFilter] = useState<FilterData>({
    room: '',
    startDate: undefined,
    endDate: undefined,
    status: ''
  })

  return (
    <>
      <Filter value={filter} onChange={setFilter}/>
      <Calendar filter={filter.room} />
    </>
  );
}