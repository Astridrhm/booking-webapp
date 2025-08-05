"use client";

import { Eye, EyeOff } from "lucide-react";
// import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form"
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/form/input/InputField";
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from "../context/AuthContext";
import { useAlert } from "@/context/AlertContext";
import { useLoading } from "@/context/LoadingContext";

const loginSchema = z.object({
  email: z.email("Invalid Email"),
  password: z.string("Password is required").min(2, "Password Wajib diisi")
});

type LoginSchema = z.infer<typeof loginSchema>;

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [ failed, setFailed ] = useState<string>("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const expired = searchParams.get('expired');

  const { showAlert } = useAlert()

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const { login } = useAuth()
  const { showLoading, setLoading } = useLoading()

  useEffect(() => {
    setLoading(false)
    if (expired) {
      showAlert?.({
        variant: "warning",
        title: "Session Expired",
        message: "Sesi kamu sudah habis. Silakan login kembali",
      });

      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete('expired');
      router.replace(`/login?${newParams.toString()}`, { scroll: false });
    }
  }, [expired]);

  const onSubmit = async (data: LoginSchema) => {
    setLoading(true)
    try {
      await login(data.email, data.password);
      router.push('/');
    
    } catch (err: any) {
      setFailed(`Login Gagal : ` + err.data.message);
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full">
      <div className="flex flex-col justify-center flex-1 w-full ">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex w-full flex-col gap-3">
                <div>
                  <Controller 
                    control={control}
                    name="email"
                    render={({field}) => (
                    <>
                      <div>
                        <Input type="text" placeholder="username" {...field}/>
                      </div>
                      <span className={`text-xs block min-h-[1rem] ${errors.email ? "text-red-400" : "invisible"}`}>
                        {errors.email?.message || "placeholder"}
                      </span>
                    </>
                    )}  
                  />
                </div>
                <div>
                  <Controller 
                    control={control}
                    name="password"
                    render={({field}) => (
                    <>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="password"
                          {...field}
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                        >
                          {showPassword ? (
                            <Eye className="text-gray-300"/>
                          ) : (
                            <EyeOff className="text-gray-300"/>
                          )}
                        </button>
                      </div>
                      <span className={`text-xs block min-h-[1rem] ${errors.password ? "text-red-400" : "invisible"}`}>
                        {errors.password?.message || "placeholder"}
                      </span>
                    </>
                    )}  
                  />
                </div>
               
                <div>
                  <div>
                    <span className={`text-sm block min-h-[1rem] pb-2 ${failed ? "text-red-400" : "invisible"}`}>
                      {failed || "placeholder"}
                    </span>
                  </div>

                  <Button type="submit" size="sm" className="w-full">
                    {showLoading ? 
                      <div className="flex flex-row justify-center items-center gap-3">
                        {showLoading}
                        <span className="text-white">Loading...</span>
                      </div> : <span>Login</span>}
                  </Button>
                </div>
              </div>
            </form>

            {/* <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account? {""}
                <Link
                  href="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
