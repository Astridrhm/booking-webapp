'use client'

import { useState } from "react"
import ListDepartmentTable from "../components/ListDepartmentTable"
import Pagination from "@/components/table/Pagination"
import Filter from "../components/Filter"
import { usePrivilege } from "@/hooks/usePrivileges"
// import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import Button from "@/components/ui/button/Button"

export default function DepartmentPage() {
  const [filter, setFilter] = useState({
    name: ''
  })

  // const router = useRouter()

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [isAddingDepartment, setIsAddingDepartment] = useState(false)

  const hasCreatedDepartment = usePrivilege("department", "create")

  // const handleGoToCreate = () => {
  //   router.push("/departments/create")
  // }

  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="w-full">
          <Filter
            value={filter}
            onChange={(newFilter) => {
              setFilter(newFilter)
              setCurrentPage(1)
            }}
          />
        </div>
        {hasCreatedDepartment && <div className="shrink-0">
          <Button type="button" size="sm" onClick={() => setIsAddingDepartment(true)}>
          <Plus size={17} />
          <div className="hidden lg:block">Create Department</div>
        </Button>
        </div>}
      </div>

      <ListDepartmentTable
        filter={filter}
        page={currentPage}
        addRow={isAddingDepartment}
        onTotalPagesChange={setTotalPages}
        onFinishAddRow={() => setIsAddingDepartment(false)}
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
