import SignInForm from "@/features/auth/components/SignInForm";
import ComponentCard from "@/components/common/ComponentCard";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <ComponentCard className="w-2xl">
        <Suspense>
          <SignInForm/>
        </Suspense>
      </ComponentCard>
    </div>
  )
}