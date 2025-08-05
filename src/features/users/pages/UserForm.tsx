'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import z from "zod"
import Label from "@/components/ui/form/Label"
import Input from "@/components/ui/form/input/InputField"
import Select from "@/components/ui/form/Select"
import Button from "@/components/ui/button/Button"
import useGoBack from "@/hooks/useGoBack"
import { createUser, updateUser } from "../services/userServices"
import { useAlert } from "@/context/AlertContext"
import { getRole } from "@/features/role/services/roleServices"
import { UserReq, UserRes } from "../types/user"
import { getDepartment } from "@/features/department/services/departmentService"

interface props {
  userId?: string
  user?: UserRes
  mode?: string
}

const createSchema = z.object({
  email: z.email("Email tidak valid"),
  name: z.string("Wajib diisi").min(2, "Wajib diisi"),
  contact: z.string("Wajib diisi").regex(/^(\+62|62|0)8[1-9][0-9]{6,10}$/, "Nomor HP tidak valid"),
  department: z.string("Wajib diisi"),
  role: z.string("Wajib diisi"),
  password: z
    .string("Wajib diisi")
    .min(12, "Minimal 12 karakter")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, "Password harus mengandung huruf besar, huruf kecil, dan angka")
})

const updateSchema = createSchema.partial();

type CreateUserData = z.infer<typeof createSchema>;
type UpdateUserData = z.infer<typeof updateSchema>;

export default function User({userId, user, mode}: props) {
  const isUpdate = mode === "update";

  const goBack = useGoBack()

  const { showAlert } = useAlert()

  const [ departmentOptions, setdepartmentOptions ] = useState<
    Array<{ value: string; label: string }>
  >([])
  const [ roleOptions, setRoleOptions ] = useState<
    Array<{ value: string; label: string }>
  >([])

  const { control, handleSubmit, reset, formState: { errors } } = useForm<CreateUserData | UpdateUserData>({
    resolver: zodResolver(isUpdate ? updateSchema : createSchema),
    defaultValues: isUpdate ? {
      email: user?.email,
      name: user?.name,
      contact: user?.contact,
      department: user?.departmentid,
      role: user?.role.id,
    } : {
      email: "",
      name: "",
      contact: "",
      department: "",
      role: "",
      password: ""
    }
  })

  type Option = { id: string; name: string };
  type SelectOption = { value: string; label: string };

  const fetchOptions = async (
    fetcher: () => Promise<Option[]>,
    setter: (options: SelectOption[]) => void,
    label: string
  ) => {
    try {
      const res = await fetcher();
      const options = res.map((item) => ({
        value: item.id,
        label: item.name,
      }));
      setter(options);
    } catch (err: any) {
      showAlert({
        variant: "error",
        title: "Gagal!",
        message: `Failed to fetch ${label}: ${err.message}`,
      });
    }
  };
  
  useEffect(() => {
    fetchOptions(getDepartment, setdepartmentOptions, "department")
    fetchOptions(getRole, setRoleOptions, "role")
  }, [])

  // useEffect(() => {
  //   if (!user) return 

  //   if (isUpdate) {
  //      reset({
  //       email: user.email,
  //       name: user.name,
  //       contact: user.contact,
  //       department: user.deparment.id,
  //       role: user.role.id
  //     })
  //   }
  // }, [reset, user])
  
  const onSubmit = async (values: CreateUserData | UpdateUserData) => {
    console.log(values)
    let sendData: UserReq
    try {
      if(isUpdate) {
        sendData = {
          userId: userId,
          email: values.email,
          contact: values.contact,
          password: values?.password,
          departmentId: values.department
        }
        await updateUser(sendData)
      } else {
        sendData = {
          email: values.email,
          name: values.name,
          contact: values.contact,
          password: values.password,
          roleId: values.role,
          departmentId: values.department
        }
        await createUser(sendData)
        reset()
      }
      showAlert({
        variant: "success",
        title: "Berhasil!",
        message: "Data berhasil disimpan!",
      })

    
    } catch (err: any) {
      showAlert({
        variant: "error",
        title: "Gagal!",
        message: err.message,
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-3">
        <div>
          <Controller 
            control={control}
            name="email"
            render={({field}) => (
            <>
              <div>
                <Label>
                  Email <span className="text-error-500">*</span>{" "}
                </Label>
                <Input type="text" placeholder="Email" {...field}/>
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
            name="name"
            render={({field}) => (
            <>
              <div>
                <Label>
                  Name <span className="text-error-500">*</span>{" "}
                </Label>
                <Input type="text" placeholder="name" {...field}/>
              </div>
              <span className={`text-xs block min-h-[1rem] ${errors.name ? "text-red-400" : "invisible"}`}>
                {errors.name?.message || "placeholder"}
              </span>
            </>
            )}  
          />
        </div>
        <div>
          <Controller 
            control={control}
            name="contact"
            render={({field}) => (
            <>
              <div>
                <Label>
                  Contact <span className="text-error-500">*</span>{" "}
                </Label>
                <Input type="tel" placeholder="081234567890" {...field}/>
              </div>
              <span className={`text-xs block min-h-[1rem] ${errors.contact ? "text-red-400" : "invisible"}`}>
                {errors.contact?.message || "placeholder"}
              </span>
            </>
            )}  
          />
        </div>
        <div>
          <Controller 
            control={control}
            name="department"
            render={({field}) => (
            <>
              <div>
                <Label>
                  department <span className="text-error-500">*</span>{" "}
                </Label>
                <div className="relative">
                  <Select
                    options={departmentOptions}
                    placeholder="Select department"
                    {...field}
                  />
                </div>
              </div>
              <span className={`text-xs block min-h-[1rem] ${errors.department ? "text-red-400" : "invisible"}`}>
                {errors.department?.message || "placeholder"}
              </span>
            </>
            )}  
          />
        </div>
        <div>
          <Controller 
            control={control}
            name="role"
            render={({field}) => (
            <>
              <div>
                <Label>
                  Role <span className="text-error-500">*</span>{" "}
                </Label>
                <div className="relative">
                  <Select
                    options={roleOptions}
                    placeholder="Select Role"
                    disabled={isUpdate}
                    {...field}
                  />
                </div>
              </div>
              <span className={`text-xs block min-h-[1rem] ${errors.role ? "text-red-400" : "invisible"}`}>
                {errors.role?.message || "placeholder"}
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
              <div>
                <Label>
                  Password {!isUpdate && <><span className="text-error-500">*</span>{" "}</>}
                </Label>
                <Input type="text" placeholder="Password" {...field}/>
              </div>
              <span className={`text-xs block min-h-[1rem] ${errors.password ? "text-red-400" : "invisible"}`}>
                {errors.password?.message || "placeholder"}
              </span>
            </>
            )}  
          />
        </div>
        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={goBack}>
            Cancel
          </Button>
          <Button type="submit">
            {isUpdate ? "Update" : "Create"}
          </Button>
        </div>
      </div>
    </form>
  )
}