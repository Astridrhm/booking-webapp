import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DepartmentPage from "@/features/department/pages/DepartmentTable";

export default function Page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Departments" />
      <div className="space-y-6">
        <ComponentCard title="Departments">
          <DepartmentPage/>
        </ComponentCard>
      </div>
    </div>
  )
}