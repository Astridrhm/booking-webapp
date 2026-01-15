'use client'

import React, { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { SquarePen, Trash} from "lucide-react"
import { Booking, BookingStatus, FilterData } from "../types/booking"
import { useAlert } from "@/context/AlertContext"
import { approvalBooking, listBooking } from "../services/bookingService"
import { formatDateForQuery, formatTime } from "@/utils/time"
import Badge from "@/components/ui/badge/Badge"
import { usePrivilege } from "@/hooks/usePrivileges"
import Link from "next/link"
import { useLoading } from "@/context/LoadingContext"
import { useAuth } from "@/features/auth"
import { RoleID } from "@/features/role"

interface Props {
  filter: FilterData
  page: number
  onTotalPagesChange: (total: number) => void
}

export default function ListBookingTable({ filter, page, onTotalPagesChange }: Props) {
  const { showAlert } = useAlert()
  const { user } = useAuth()
  const { setLoading, showLoading } = useLoading()

  const hasApprovalDelete = usePrivilege("bookings", "cancel")
  // const hasApprovalApprove = usePrivilege("bookings", "approval")

  const [ bookingData, setBookingData ] = useState<Booking[]>([])
  const [approvalStatus, setApprovalStatus] = useState<{ id: string; status: string } | null>(null)
  const [ bookingUserId, setBookingUserId ] = useState<string>("")

  const handleFetchDataBooking = async (data: FilterData, page: number) => {
    setLoading(true)
    try {
      const response = await listBooking({
        page: page, 
        limit: 10, 
        filter: {
          userid: bookingUserId,
          roomId: data.room.value,
          startDate: data.startDate && formatDateForQuery(data.startDate),
          endDate: data.endDate && formatDateForQuery(data.endDate),
          status: data.status
        }
      })

      setBookingData(response.list)
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

  const handleApproval = async (id: string, status: string) => {
    try {
      await approvalBooking(id, status)
      setApprovalStatus({ id, status })
      setBookingData(prev =>
        prev?.map(item =>
          item.id === id ? { ...item, status } : item
        )
      )
    
    } catch (err: any) {
      showAlert({
        variant: "error",
        title: "Gagal",
        message: err.message,
      })
    }
  }
  
  useEffect(() => {
    if (!user) return

    if (user.role.id === RoleID.user) {
      setBookingUserId(user.user.id)
    }

    setLoading(true)
    const timer = setTimeout(() => {
      handleFetchDataBooking(filter, page)
    }, 300)

    return () => clearTimeout(timer)
  }, [filter, page, user])

  const isToday = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400">Title</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400">Time</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400">PIC</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400">Description</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400">Status</TableCell>
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
                    {bookingData && bookingData.map((data) => (
                      <TableRow key={data.id}>
                        <TableCell className="px-5 py-4 text-start">
                          <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {data.title}
                            </span>
                            <span className="block text-gray-500 text-theme-xs dark:text-gray-400">Requestor : {data.user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start">
                          <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {formatTime(new Date(data.startDate))} - {formatTime(new Date(data.endDate))}
                            </span>
                            <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                              {formatDateForQuery(new Date(data.startDate))}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm">
                          {data.pic || data.user.name}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm">
                          {data.description || "-"}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm">
                          <Badge
                            size="sm"
                            color={
                              data.status === BookingStatus.approved
                                ? "primary"
                                : data.status === BookingStatus.requested
                                ? "warning"
                                : "error"
                            }
                          >
                            {data.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start text-theme-sm flex gap-2 items-center">
                          {approvalStatus?.id === data.id && isToday(data.startDate) ? (
                            <span></span>
                          ) : (
                            (() => {
                              const now = new Date();
                              const end = new Date(data.endDate);
                              const isPast = end < now;

                              if (isPast) {
                                return (
                                  <div className="p-3">
                                    <Badge size="sm" color="green">
                                      Selesai
                                    </Badge>
                                  </div>
                                )
                              }

                              return (
                                <>
                                  {/* {data.status === BookingStatus.requested && (
                                    <>
                                      {hasApprovalApprove && (
                                        <>
                                          <button
                                            className="p-2 hover:bg-gray-100 rounded"
                                            onClick={() => handleApproval(data.id, BookingStatus.approved)}
                                          >
                                            <Check className="text-green-600" />
                                          </button>
                                          <button
                                            className="p-2 hover:bg-gray-100 rounded"
                                            onClick={() => handleApproval(data.id, BookingStatus.rejected)}
                                          >
                                            <X className="text-red-600" />
                                          </button>
                                        </>
                                      )}
                                    </>
                                  )} */}
                                  {(data.status === BookingStatus.approved || data.status === BookingStatus.requested) &&
                                    hasApprovalDelete && (
                                      <button
                                        className="p-2 hover:bg-gray-100 rounded"
                                        onClick={() => handleApproval(data.id, BookingStatus.canceled)}
                                      >
                                        <Trash className="text-gray-500" />
                                      </button>
                                    )}
                                  {data.status !== BookingStatus.canceled && (
                                    <div className="p-3">
                                      <Link href={`/booking/${data.id}`}>
                                        <SquarePen className="text-blue-300 hover:text-blue-400" />
                                      </Link>
                                    </div>               
                                  )}
                                </>
                              )
                            })()
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                )
              }
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
