'use client'

import React, { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { SquarePen } from "lucide-react"
import { usePrivilege } from "@/hooks/usePrivileges"
import Link from "next/link"
import { listRoom } from "../services/roomService"
import { FilterData, Room } from "../types/room"
import { useAlert } from "@/context/AlertContext"
import { useLoading } from "@/context/LoadingContext"

interface Props {
  filter: FilterData
  page: number
  onTotalPagesChange: (total: number) => void
}

export default function ListRoomTable({ filter, page, onTotalPagesChange }: Props) {
  const { showAlert } = useAlert()
  const { showLoading, setLoading } = useLoading()

  const hasUpdatedRooms = usePrivilege("rooms", "updated")
  // // const hasApprovalApprove = usePrivilege("bookings", "approval")

  const [ roomData, setRoomData ] = useState<Room[]>([])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleFetchDataRoom = async (data: FilterData, page: number) => {
    setLoading(true)
    try {
      const response = await listRoom({
        // page: page,
        // limit: 10,
        // filter: {
        //   name: data.name
        // }
      })
      setRoomData(response.list)
      onTotalPagesChange(response.totalPage)
    
    } catch (err: any) {
      showAlert({
        variant: "error",
        title: "Gagal!",
        message: err.message,
      })
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      handleFetchDataRoom(filter, page)
      setLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [filter, page])

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400">Room</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400">Capacity</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400">Floor</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {showLoading ? 
                <TableRow>
                  <TableCell colSpan={5} className=" text-center px-5 py-4 h-40">
                    <div className="flex flex-col justify-center items-center gap-3">
                      {showLoading}
                      <span className="text-gray-300">Loading...</span>
                    </div>
                  </TableCell>
                </TableRow>
              : (
                <>
                  {roomData && roomData.map((data) => (
                    <TableRow key={data.id}>
                      <TableCell className="px-5 py-4 text-start">
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {data.name}
                          </span>
                          <span className="block text-gray-500 text-theme-xs dark:text-gray-400">Location : {data.location.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {data.capacity}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {data.floor}
                        </span>
                      </TableCell>
                      {hasUpdatedRooms && <TableCell className="px-5 py-4 text-start">
                        <Link
                          href={`/rooms/${data.id}`}
                        >
                          <SquarePen className="text-blue-300 hover:text-blue-400"/>
                        </Link>
                      </TableCell>}
                    </TableRow>
                  ))}
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
