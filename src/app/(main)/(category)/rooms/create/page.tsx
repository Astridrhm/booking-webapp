'use client'

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Room from "@/features/room/pages/RoomForm";

export default function Page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="create" />
      <div className="space-y-6">
        <ComponentCard title="Room">
          <Room/>
        </ComponentCard>
      </div>
    </div>
  )
}