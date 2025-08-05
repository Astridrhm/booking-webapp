'use client'

import Pagination from "@/components/table/Pagination"
import ListRoomTable from "../components/ListRoomTable"
import { useState } from "react"
import Filter from "../components/Filter"
import Button from "@/components/ui/button/Button"
import { Plus } from "lucide-react"
import { usePrivilege } from "@/hooks/usePrivileges"
import { useRouter } from "next/navigation"

export default function RoomTable() {
  const [filter, setFilter] = useState({
    name: ''
  })

  const router = useRouter()

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const hasCreatedRole = usePrivilege("rooms", "create")

  const handleGoToCreate = () => {
    router.push("/rooms/create")
  }

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
        {hasCreatedRole && <div className="shrink-0">
          <Button type="button" size="sm" onClick={handleGoToCreate}>
            <Plus size={17}/>
            <div className="hidden lg:block">Create Room</div>
          </Button>
        </div>}
      </div>

      <ListRoomTable
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
