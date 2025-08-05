'use client'

import React, { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Check, SquarePen, X } from "lucide-react"
import { usePrivilege } from "@/hooks/usePrivileges"
import { Department, FilterData } from "../types/department"
import { useAlert } from "@/context/AlertContext"
import { useLoading } from "@/context/LoadingContext"
import { createDepartment, listDepartment, updateDepartment } from "../services/departmentService"
import Input from "@/components/ui/form/input/InputField"

interface Props {
  filter: FilterData
  page: number
  addRow: boolean
  onTotalPagesChange: (total: number) => void
  onFinishAddRow: () => void
}

export default function ListDepartmentTable({ filter, page, addRow, onTotalPagesChange, onFinishAddRow }: Props) {
  const { showAlert } = useAlert()
  const { showLoading, setLoading } = useLoading()

  const hasUpdatedRooms = usePrivilege("department", "updated")

  const [ departmentData, setDepartmentData ] = useState<Department[]>([])
  const [newName, setNewName] = useState("")
  const [editRowId, setEditRowId] = useState<string | null>(null)
  const [editName, setEditName] = useState<string>("")

  const [inputNameError, setInputNameError] = useState<string>("")

  const handleFetchDataDepartment = async (data: FilterData, page: number) => {
    setLoading(true)
    try {
      const response = await listDepartment({
        page: page,
        limit: 10,
        filter: {
          name: data.name
        }
      })
      setDepartmentData(response.list)
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

  const handleCreateDepartment = async () => {
     if (!newName.trim()) {
      setInputNameError("Nama departemen tidak boleh kosong")
      return
    }
    setInputNameError("")

    setLoading(true)
    try {
      await createDepartment({ name: newName })
      showAlert({
        variant: "success",
        title: "Berhasil",
        message: "Departemen berhasil ditambahkan.",
      })
      setNewName("")
      onFinishAddRow()
      handleFetchDataDepartment(filter, page)
    } catch (err: any) {
      showAlert({
        variant: "error",
        title: "Gagal",
        message: err.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateDepartment = async (id: string) => {
    if (!editName.trim()) {
      setInputNameError("Nama departemen tidak boleh kosong")
      return
    }
    setInputNameError("")

    setLoading(true)
    try {
      await updateDepartment({departmentId: id, name: editName })
      showAlert({
        variant: "success",
        title: "Berhasil",
        message: "Departemen berhasil diupdate.",
      })
      setEditRowId(null)
      setEditName("")
      handleFetchDataDepartment(filter, page)
    } catch (err: any) {
      showAlert({
        variant: "error",
        title: "Gagal",
        message: err.message,
      })
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      handleFetchDataDepartment(filter, page)
      setLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, page])

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400">ID</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400">Name</TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-theme-xs text-gray-500 dark:text-gray-400">Aksi</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {addRow && (
                <TableRow>
                  <TableCell className="px-5 py-4 text-start">
                    <span className="text-gray-400 italic">Auto</span>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <Input
                      max='50'
                      value={newName}
                      onChange={(e) => {
                        setNewName(e.target.value)
                        if (inputNameError) setInputNameError("")
                      }}
                      className="w-full px-2 py-1 border border-gray-300 rounded bg-white dark:bg-gray-800 text-black dark:text-white"
                      placeholder="Nama Departemen"
                    />
                     {inputNameError && (
                      <p className="mt-1 text-xs text-red-500">{inputNameError}</p>
                    )}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start">
                    <div className="flex gap-3">
                      <button onClick={handleCreateDepartment}>
                        <Check className="text-brand-500 hover:text-brand-600 cursor-pointer" />
                      </button>
                      <button onClick={() => {
                        setNewName("")
                        onFinishAddRow()
                        if (inputNameError) setInputNameError("")
                      }}>
                        <X className="text-red-500 hover:text-red-600 cursor-pointer" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
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
                  {departmentData && departmentData.map((data) => (
                    <TableRow key={data.id}>
                      <TableCell className="px-5 py-4 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {data.id}
                        </span>
                      </TableCell>

                      <TableCell className="px-5 py-4 text-start">
                        {editRowId === data.id ? (
                          <>
                            <Input
                              max='50'
                              value={editName}
                              onChange={(e) => {
                                setEditName(e.target.value)
                                if (inputNameError) setInputNameError("")
                              }}
                              className="w-full px-2 py-1 border border-gray-300 rounded bg-white dark:bg-gray-800 text-black dark:text-white"
                            />
                            {inputNameError && editRowId === data.id && (
                              <p className="mt-1 text-xs text-red-500">{inputNameError}</p>
                            )}                         
                          </>
                        ) : (
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {data.name}
                          </span>
                        )}
                      </TableCell>

                      {hasUpdatedRooms && (
                        <TableCell className="px-5 py-4 text-start">
                          {editRowId === data.id ? (
                            <div className="flex gap-3">
                              <button onClick={() => handleUpdateDepartment(data.id)}>
                                <Check className="text-brand-500 hover:text-brand-600 cursor-pointer" />
                              </button>
                              <button onClick={() => {
                                  setEditRowId(null)
                                  setEditName("")
                                }}>
                                <X className="text-red-500 hover:text-red-600 cursor-pointer" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setEditRowId(data.id)
                                setEditName(data.name)
                                if (inputNameError) setInputNameError("")
                              }}
                            >
                              <SquarePen className="text-blue-300 hover:text-blue-400 cursor-pointer" />
                            </button>
                          )}
                        </TableCell>
                      )}
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
