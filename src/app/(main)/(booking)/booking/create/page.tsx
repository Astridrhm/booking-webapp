'use client'

import ComponentCard from "@/components/common/ComponentCard";
import BookingForm from "@/features/booking/pages/BookingForm";

export default function Page() {

  return (
    <div className="flex flex-col">
      <ComponentCard title="Booking Room">
        <BookingForm/>
      </ComponentCard>
    </div>
  );
}