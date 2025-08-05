import { useAuth } from "@/features/auth";

export function usePrivilege(resource: string, action: string): boolean {
  const { user } = useAuth();

  const privileges = user?.role?.privileges ?? [];

  if (privileges === "*") {
    return true
  }

  const matched = privileges.find((priv: { resource: string }) => priv.resource === resource);
  return matched?.scopes.includes(action) ?? false;
}