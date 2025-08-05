'use client'

import ComponentCard from "@/components/common/ComponentCard"
import PageBreadcrumb from "@/components/common/PageBreadCrumb"
import { useAlert } from "@/context/AlertContext"
import { useLoading } from "@/context/LoadingContext"
import { getRoomById, RoomRes } from "@/features/room"
import Room from "@/features/room/pages/RoomForm"
import { usePrivilege } from "@/hooks/usePrivileges"
import { useRouter } from "next/navigation"

import { use, useEffect, useState } from "react"

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  
  const { showAlert } = useAlert()
  const { setLoading, showLoading } = useLoading()
  const router = useRouter()

  const notHasUpdatedRoom = !usePrivilege("room", "update")
  const notHasCreatedRoom = !usePrivilege("room", "created")

  const [ room, setRoom ] = useState<RoomRes>()

  useEffect(() => {
    if (!id) return

    setLoading(true)
    
    if (notHasCreatedRoom && notHasUpdatedRoom) {
      showAlert({
        variant: "error",
        title: "Unauthorize",
        message: "Unauthorize",
      })
      
      setTimeout(() => {
        router.back()
      }, 0)
      return
    }

    if (id) {
      const handleGetRoom = async () => {
        try {
          const res = await getRoomById(id) as RoomRes
          setRoom(res)
        
        } catch (err: any) {
          showAlert({
            variant: "error",
            title: "Gagal!",
            message: `Failed to fetch room:` + err.message,
          })
        }
      }
      handleGetRoom()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, notHasCreatedRoom, notHasUpdatedRoom])

  return (
    <div>
      <PageBreadcrumb pageTitle={id} />
      <div className="space-y-6">
        <ComponentCard title={id}>
          {showLoading && !room ? (
              <div className="flex flex-col justify-center items-center gap-3 h-40">
                {showLoading}
                <span className="text-gray-300">Loading</span>
              </div>
            ) : (
          <Room room={room} roomId={id} mode="update"/>
          )}
        </ComponentCard>
      </div>
    </div>
  )
}