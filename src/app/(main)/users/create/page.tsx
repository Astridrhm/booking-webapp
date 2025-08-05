'use client'

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import User from "@/features/users/pages/UserForm";

export default function Page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="create" />
      <div className="space-y-6">
        <ComponentCard title="User">
          <User/>
        </ComponentCard>
      </div>
    </div>
  )
}