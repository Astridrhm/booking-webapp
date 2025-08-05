"use client";

import { useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
// import Button from "@/components/ui/button/Button";
import Checkbox from "@/components/ui/form/input/Checkbox";
import { getRole } from "@/features/role/services/roleServices";
import { useAlert } from "@/context/AlertContext";
import { Role } from "@/features/role/types/role";
import { parseData } from "@/utils/parseDate";

// const privilegeMapToArray = (
//   privs: Record<string, string[]>
// ): Role["privileges"] => {
//   return Object.entries(privs).map(([resource, scopes]) => ({ resource, scopes }));
// };

const resources = [
  {
    id: "users",
    label: "User",
    privilege: ["detail", "create", "read", "delete"],
  },
  {
    id: "role",
    label: "Role",
    privilege: ["read", "update"],
  },
  {
    id: "bookings",
    label: "Bookings",
    privilege: ["read", "create", "cancel", "approval"],
  },
];

export default function Page() {
  const [roleData, setRoleData] = useState<Role[]>([]);
  const { showAlert } = useAlert();

  const handleChecked = (
    roleIndex: number,
    resourceId: string,
    permission: string,
    checked: boolean
  ) => {
    setRoleData((prev) => {
     
      const updated = [...prev];
      const role = updated[roleIndex];

      if (Array.isArray(role.privileges)) {
        const privilegeIndex = role.privileges.findIndex(
          (p) => p.resource === resourceId
        );

        if (privilegeIndex !== -1) {
          const currentScopes = role.privileges[privilegeIndex].scopes;
          const newScopes = checked
            ? Array.from(new Set([...currentScopes, permission]))
            : currentScopes.filter((s) => s !== permission);

          role.privileges[privilegeIndex] = {
            ...role.privileges[privilegeIndex],
            scopes: newScopes,
          };
        } else if (checked) {
          role.privileges.push({
            resource: resourceId,
            scopes: [permission],
          });
        }

        updated[roleIndex] = { ...role };
      } else {
        // ✅ Jika "*", mungkin kamu bisa skip atau beri warning
        console.warn("Cannot modify privileges because role has full access (*)");
      }
      return updated;
    });
  };


  // const handleSubmit = async () => {
  //   console.log("INI SUBMIT ROLE", roleData)
  //   try {
  //     const formatted: Role[] = roleData.map((role) => ({
  //       id: role.id,
  //       name: role.name,
  //       privileges: role.privileges,
  //     }));

  //     // await saveRole(formatted); 
  //     console.log("Saving:", formatted); 

  //     showAlert({
  //       variant: "success",
  //       title: "Berhasil!",
  //       message: "Perubahan disimpan.",
  //     });

    
  //   } catch (err: any) {
  //     showAlert({
  //       variant: "error",
  //       title: "Gagal!",
  //       message: "Gagal menyimpan: " + err.message,
  //     });
  //   }
  // };

  const handleRoleOptions = async () => {
    try {
      const res = await getRole() 
      console.log("ini response nya", res)
      const list = res.map((role) => ({
        ...role,
        privileges: parseData(role.privileges),
      }))
      setRoleData(list);
      
    
    } catch (err: any) {
      showAlert({
        variant: "error",
        title: "Gagal!",
        message: `Failed to fetch role: ${err.message}`,
      });
    }
  };

  useEffect(() => {
    handleRoleOptions();
  }, []);

  return (
    <div>
      <PageBreadcrumb pageTitle="Roles" />
      <div className="space-y-6">
        <ComponentCard title="Role Permission">
          <div className="overflow-auto">
            <table className="min-w-full border text-sm">
              <thead>
                <tr>
                  <th className="border px-3 py-2 text-left bg-gray-100">Role</th>
                  {resources.map((res) =>
                    res.privilege.map((perm) => (
                      <th
                        key={`${res.id}-${perm}`}
                        className="border px-3 py-2 text-center bg-gray-100"
                      >
                        {res.label} - {perm}
                      </th>
                    ))
                  )}
                </tr>
              </thead>
              <tbody>
                {roleData.map((role, roleIndex) => (
                  <tr key={role.id} className="hover:bg-gray-50">
                    <td className="border px-3 py-2 font-semibold">{role.name}</td>
                    {resources.map((res) =>
                      res.privilege.map((perm) => {
                        const isChecked =
                          role.privileges === "*" ||
                          (Array.isArray(role.privileges) &&
                            role.privileges.some(
                              (priv) => priv.resource === res.id && priv.scopes.includes(perm)
                            ));
                        const isDisabled = role.privileges === "*";

                        return (
                          <td
                            key={`${role.id}-${res.id}-${perm}`}
                            className="border px-3 py-2 text-center"
                          >
                            <Checkbox
                              id={`${role.id}-${res.id}-${perm}`}
                              checked={isChecked}
                              disabled={isDisabled}
                              onChange={(checked) =>
                                handleChecked(roleIndex, res.id, perm, checked)
                              }
                            />
                          </td>
                        );
                      })
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* <div className="mt-6">
            <Button type="button" size="sm" onClick={handleSubmit}>
              Simpan
            </Button>
          </div> */}
        </ComponentCard>
      </div>
    </div>
  );
}
