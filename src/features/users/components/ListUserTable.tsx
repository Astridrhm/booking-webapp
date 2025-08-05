'use client'

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

import Badge from "../../../components/ui/badge/Badge";
import Link from "next/link";
import { SquarePen } from "lucide-react";
import { activateUser, deactiveUser, listUser } from "../services/userServices";
import { useAlert } from "@/context/AlertContext";
import { FilterData, UserRes } from "../types/user";
import { useLoading } from "@/context/LoadingContext";
import Switch from "@/components/ui/form/switch/Switch";
import { usePrivilege } from "@/hooks/usePrivileges";
interface Props {
  filter: FilterData
  page: number
  onTotalPagesChange: (total: number) => void
}

export default function ListUserTable({filter, page, onTotalPagesChange}: Props) {
  const { showAlert } = useAlert()
  const { showLoading, setLoading} = useLoading()

  const [ userData, setUserData ] = useState<UserRes[]>()
  
  const hasUpdateUser = usePrivilege("users", "update")
  const hasDeactiveUser = usePrivilege("users", "delete")
  const hasActivateUser = usePrivilege("users", "activate")

  const handleUserData = async () => {
    setLoading(true)
    try {
      const res = await listUser({
        page: page,
        limit: 10,
        filter: {
          name: filter.name
        }
      })
      setUserData(res.list)
      onTotalPagesChange(res.page)

    
    } catch (err: any) {
      showAlert({
        variant: "error",
        title: "Gagal",
        message: err.message,
      });
    } finally {
      setLoading(false)
    }
  }

  const handleActivateStatus = async (checked: boolean, userId: string) => {
    console.log("Switch is now:", checked ? "ON" : "OFF");
    
    let statusUser: boolean
    try {
      if (checked) {
        await activateUser(userId)
        statusUser = true
      } else {
        await deactiveUser(userId)
        statusUser = false
      }
      setUserData(prev =>
        prev?.map(item =>
          item.id === userId ? { ...item, isActive: statusUser } : item
        )
      )
    } catch (err: any) {
      showAlert({
        variant: "error",
        title: "Gagal",
        message: err.message,
      });
    }

  };
  
  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      handleUserData()
    }, 300)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  return (
    <>
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Name</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Contact</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Department</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Status</TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
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
              :
              <>
              {userData && userData.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {user.name}
                        </span>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                          {user.role.name}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          email : {user.email || "-"}
                        </span>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          contact: {user.contact || "-"}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm">
                    {user.deparment.name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm">
                    <Badge
                      size="sm"
                      color={
                        user.isActive
                          ? "success" : "error"
                      }
                    >
                      {user.isActive ? "Active" : "inActive"}
                    </Badge>
                  </TableCell>
                  {(hasDeactiveUser && hasActivateUser) && <TableCell className="px-4 py-3 text-gray-500 text-theme-sm">
                    <Switch
                      defaultChecked={user.isActive}
                      onChange={(checked) => handleActivateStatus(checked, user.id)}
                    />
                  </TableCell>}
                  {hasUpdateUser && <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm">
                    <Link
                      href={`/users/${user.id}`}
                    >
                      <SquarePen className="text-blue-300 hover:text-blue-400"/>
                    </Link>
                  </TableCell>}
                </TableRow>
              ))}
              </>
              }
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
    {/* <Pagination currentPage={0} totalPages={12} onPageChange={function (page: number): void {
        
      } }/> */}
    </>
  );
}
