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
import { useAlert } from "@/context/AlertContext"
import { RoomReq, RoomRes } from "../types/room"
import { createRoom, getLocation, updateRoom } from "../services/roomService"

interface props {
  roomId?: string
  room?: RoomRes
  mode?: string
}

const createSchema = z.object({
  name: z.string(),
  locationId: z.string(),
  floor: z.string(),
  capacity: z.string()
})

const updateSchema = createSchema.partial();

type CreateRoomData = z.infer<typeof createSchema>;
type UpdateRoomData = z.infer<typeof updateSchema>;

export default function Room({roomId, room, mode}: props) {
  const isUpdate = mode === "update";

  const goBack = useGoBack()

  const { showAlert } = useAlert()

  const [ locationDropdownOptions, setLocationDropdownOption ] = useState<
    Array<{ value: string; label: string }>
  >([])

  const { control, handleSubmit, reset, formState: { errors } } = useForm<CreateRoomData | UpdateRoomData>({
    resolver: zodResolver(isUpdate ? updateSchema : createSchema),
    defaultValues: {
      name: room?.name || "",
      locationId: room?.locationId || "",
      floor: room?.floor || "",
      capacity: room?.capacity || ""
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
    fetchOptions(getLocation, setLocationDropdownOption, "location")
  }, [])


  useEffect(() => {
    if (!room) return 

    reset({
      name: room.name,
      locationId: room.locationId,
      floor: room.floor,
      capacity: room.capacity
    })
  }, [reset, room, roomId])
  
  const onSubmit = async (values: CreateRoomData | UpdateRoomData) => {
    console.log(values)
    let sendData: RoomReq
    try {
      if(isUpdate) {
        sendData = {
          roomId: roomId,
          name: values.name,
          locationId: values.locationId,
          floor: values.floor,
          capacity: values.capacity
        }
        await updateRoom(sendData)
      } else {
        sendData = {
          name: values.name,
          locationId: values.locationId,
          floor: values.floor,
          capacity: values.capacity
        }
        await createRoom(sendData)
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
            name="name"
            render={({field}) => (
            <>
              <div>
                <Label>
                  Name <span className="text-error-500">*</span>{" "}
                </Label>
                <Input type="text" placeholder="Name" {...field}/>
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
            name="locationId"
            render={({field}) => (
            <>
              <div>
                <Label>
                  Location <span className="text-error-500">*</span>{" "}
                </Label>
                <div className="relative">
                  <Select
                    options={locationDropdownOptions}
                    placeholder="Select location"
                    {...field}
                  />
                </div>
              </div>
              <span className={`text-xs block min-h-[1rem] ${errors.locationId ? "text-red-400" : "invisible"}`}>
                {errors.locationId?.message || "placeholder"}
              </span>
            </>
            )}  
          />
        </div>
        <div>
          <Controller 
            control={control}
            name="floor"
            render={({field}) => (
            <>
              <div>
                <Label>
                  Floor <span className="text-error-500">*</span>{" "}
                </Label>
                <Input type="text" placeholder="Floor" {...field}/>
              </div>
              <span className={`text-xs block min-h-[1rem] ${errors.floor ? "text-red-400" : "invisible"}`}>
                {errors.floor?.message || "placeholder"}
              </span>
            </>
            )}  
          />
        </div>
        <div>
          <Controller 
            control={control}
            name="capacity"
            render={({field}) => (
            <>
              <div>
                <Label>
                  Capacity <span className="text-error-500">*</span>{" "}
                </Label>
                <Input type="text" placeholder="Capacity" {...field}/>
              </div>
              <span className={`text-xs block min-h-[1rem] ${errors.floor ? "text-red-400" : "invisible"}`}>
                {errors.floor?.message || "placeholder"}
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