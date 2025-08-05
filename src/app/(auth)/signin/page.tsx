import SignInForm from "@/features/auth/components/SignInForm";
import ComponentCard from "@/components/common/ComponentCard";

export default function Page() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <ComponentCard className="w-2xl">
        <SignInForm/>
      </ComponentCard>
    </div>
  )
}