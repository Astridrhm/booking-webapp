import { Privilege } from "@/features/role/types/role"

export const parseData = (data: string): Privilege[] | "*" => {
  let parsed = JSON.parse(data)

  if (parsed === "*") {
    return "*"
  }

  if (typeof parsed === "string") {
    parsed = JSON.parse(parsed)
  }

  if (
    Array.isArray(parsed) &&
    parsed.every(
      (item) =>
        typeof item.resource === 'string' &&
        Array.isArray(item.scopes) &&
        
        item.scopes.every((s: any) => typeof s === 'string')
    )
  ) {
    return parsed as Privilege[]
  } else {
    console.log("Parsed data tapi tidak valid")
    return []
  }
}