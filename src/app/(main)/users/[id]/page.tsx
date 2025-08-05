'use client'

import ComponentCard from "@/components/common/ComponentCard"
import PageBreadcrumb from "@/components/common/PageBreadCrumb"
import { useAlert } from "@/context/AlertContext"
import { useLoading } from "@/context/LoadingContext"
import { useAuth } from "@/features/auth"
import { RoleID } from "@/features/role"
import User from "@/features/users/pages/UserForm"
import { getUserById } from "@/features/users/services/userServices"
import { UserRes } from "@/features/users/types/user"
import useGoBack from "@/hooks/useGoBack"
import { useRouter } from "next/navigation"

import { use, useEffect, useState } from "react"

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  
  const { showAlert } = useAlert()
  const { user } = useAuth()
  const { setLoading, showLoading } = useLoading()
  const goBack= useGoBack()

  const [ userData, setUserData ] = useState<UserRes>()

  useEffect(() => {
    if (!id || !user) return
    
    if (id) {
      setLoading(true)
      const handleGetUser = async () => {
        try {
          const res = await getUserById(id) as UserRes

          if (user.role.id != RoleID.superAdmin && user.user.id !== id) {
            goBack()
            throw new Error("Unauthorize")
          }
          setUserData(res)

        } catch (err: any) {
          showAlert({
            variant: "error",
            title: "Gagal!",
            message: `Failed : ` + err.message,
          })
        }
      }
      handleGetUser()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user])

  return (
    <div>
      <PageBreadcrumb pageTitle={id} />
      <div className="space-y-6">
        <ComponentCard title={id}>
          {showLoading && !userData ? (
              <div className="flex flex-col justify-center items-center gap-3 h-40">
                {showLoading}
                <span className="text-gray-300">Loading</span>
              </div>
            ) : (
          <User user={userData} userId={id} mode="update"/>
          )}
        </ComponentCard>
      </div>
    </div>
  )
}