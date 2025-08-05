import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import RoomTable from "@/features/room/pages/RoomTable";

export default function Page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Rooms" />
      <div className="space-y-6">
        <ComponentCard title="Room">
          <RoomTable/>
        </ComponentCard>
      </div>
    </div>
  )
}