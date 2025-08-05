'use client'

import ComponentCard from "@/components/common/ComponentCard"
import PageBreadcrumb from "@/components/common/PageBreadCrumb"
import UserTable from "@/features/users/pages/UserTable"

export default function Page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Users" />
      <div className="space-y-6">
        <ComponentCard title="User">
          <UserTable />
        </ComponentCard>
      </div>
    </div>
  )
}