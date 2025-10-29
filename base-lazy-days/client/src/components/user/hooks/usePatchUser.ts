import jsonpatch from "fast-json-patch";
import { useMutation, UseMutateFunction } from "@tanstack/react-query";
import type { User } from "@shared/types";

import { axiosInstance, getJWTHeader } from "../../../axiosInstance";
import { useUser } from "./useUser";
import { useCustomToast } from "@/components/app/hooks/useCustomToast";

async function patchUserOnServer(
  newData: User | null,
  originalData: User | null
): Promise<User | null> {
  if (!newData || !originalData) return null;
  // create a patch for the difference between newData and originalData
  const patch = jsonpatch.compare(originalData, newData);

  // send patched data to the server
  const { data } = await axiosInstance.patch(
    `/user/${originalData.id}`,
    { patch },
    {
      headers: getJWTHeader(originalData.token),
    }
  );
  return data.user;
}

export function usePatchUser(): UseMutateFunction<
  User,
  unknown,
  User,
  unknown
> {
  const { user, updateUser } = useUser();
  const toast = useCustomToast();

  const { mutate: patchUser } = useMutation({
    mutationFn: (newUserDate: User) => patchUserOnServer(newUserDate, user),
    onSuccess: (userData: User | null) => {
      if (user) {
        updateUser(userData);
        toast({
          title: "User has been updated!",
          status: "success",
        });
      }
    },
  });
  return patchUser;
}
