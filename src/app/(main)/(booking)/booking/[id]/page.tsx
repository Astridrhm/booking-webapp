'use client'

import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useAlert } from "@/context/AlertContext";
import { useLoading } from "@/context/LoadingContext";
import BookingForm from "@/features/booking/pages/BookingForm";
import { Booking, getBooking } from "@/features/booking";
import { useAuth } from "@/features/auth";
import { RoleID } from "@/features/role";

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const { id } = use(params)

  const { setLoading, showLoading } = useLoading();
  const { showAlert } = useAlert()
   const { user } = useAuth()
  
  const [ booking, setBooking ] = useState<Booking>()
  const [hasRedirected, setHasRedirected] = useState(false)

  useEffect(() => {
    if (!id || !user || hasRedirected) return
   
    if (id) {
      setLoading(true)
      const handleGetBooking = async () => {
        try {
          const res = await getBooking(id) as Booking

          const end = new Date(res.endDate)
          const now = new Date()

          if ((user?.role.id === RoleID.user || user?.role.id === RoleID.admin) && user?.user.id !== res.user.id) {
            throw new Error("Anda tidak memiliki akses untuk booking ini")
          }

          if (end < now) {
            throw new Error("Booking selesai")
          }
          
          setBooking(res)
          setLoading(false)
        } catch (err: any) {
          setHasRedirected(true)
          router.replace("/booking")

          showAlert({
            variant: "error",
            title: "Gagal!",
            message: `Failed : ` + err.message,
          })
        }
      }
      handleGetBooking()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user, hasRedirected])
   
  return (
    <div>
      <PageBreadcrumb pageTitle={id} />
        <div className="flex flex-col">
          <ComponentCard title="Booking Room">
            {showLoading && !booking ? (
              <div className="flex flex-col justify-center items-center gap-3 h-40">
                {showLoading}
                <span className="text-gray-300">Loading</span>
              </div>
            ) : (
              <BookingForm bookingId={id} bookingData={booking} mode="update" />
            )}
          </ComponentCard>
        </div>
    </div>
  )
}