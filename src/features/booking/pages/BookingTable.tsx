'use client'

import Filter from "../components/Filter"
import Pagination from "@/components/table/Pagination"
import ListBookingTable from "../components/ListBookingTable"
import { useState } from "react"
import { FilterData } from "../types/booking"

export default function BookingTable() {
  const [filter, setFilter] = useState<FilterData>({
    room: '',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: ''
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  return (
    <div>
      <Filter
        value={filter}
        onChange={(newFilter) => {
          setFilter(newFilter)
          setCurrentPage(1)
        }}
        date={true}
        status={true}
      />

      <ListBookingTable
        filter={filter}
        page={currentPage}
        onTotalPagesChange={setTotalPages}
      />

      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  )
}
