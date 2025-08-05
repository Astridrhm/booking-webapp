'use client'

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BookingTable from "@/features/booking/pages/BookingTable";

export default function Page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Booking" />
      <div className="space-y-6">
        <ComponentCard title="Booking Room">
          <BookingTable/>
        </ComponentCard>
      </div>
    </div>
  )
}