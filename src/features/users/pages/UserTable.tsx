'use client'

import Pagination from "@/components/table/Pagination"
import ListUserTable from "../components/ListUserTable"
import Filter from "../components/Filter"
import { useState } from "react"
import { FilterData } from "../types/user"
import { useDebounce } from 'use-debounce';
import Button from "@/components/ui/button/Button"
import { usePrivilege } from "@/hooks/usePrivileges"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"


export default function UserTable() {
  const [ filter, setFilter ] = useState<FilterData>({ name: '' })
  const [ debouncedFilter ] = useDebounce(filter, 500);

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const router = useRouter()

  const handleGoToCreate = () => {
    router.push("/users/create")
  }

  const hasCreateUser = usePrivilege("users", "create")

  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="w-full">
          <Filter value={filter} onChange={setFilter}/>
        </div>
        {hasCreateUser && <div className="shrink-0">
            <Button type="button" size="sm" onClick={handleGoToCreate}>
              <Plus size={17}/>
              <div className="hidden lg:block">Create User</div>
            </Button>
          </div>}
      </div>

      <ListUserTable
        filter={debouncedFilter}
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
