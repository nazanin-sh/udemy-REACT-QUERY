import jsonpatch from "fast-json-patch";
import { useMutation, UseMutateFunction } from "@tanstack/react-query";
import type { User } from "@shared/types";

import { axiosInstance, getJWTHeader } from "../../../axiosInstance";
import { useUser } from "./useUser";
import { useCustomToast } from "@/components/app/hooks/useCustomToast";
import { queryKeys } from "@/react-query/constants";

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
    onMutate: async (newData: User | null, context) => {
      await context.client.cancelQueries({
        queryKey: [queryKeys.user, user.id],
      });
      const prevData: any = context.client.getQueryData([
        queryKeys.user,
        user.id,
      ]);
      updateUser(newData);
      return { prevData };
    },
    onError: (error, _variables, context) => {
      toast({
        title: "update failed!!",
        status: "warning",
      });
      if (context.prevData) updateUser(context?.prevData);
    },
    onSuccess: (userData: User | null) => {
      if (user) {
        toast({
          title: "User has been updated!",
          status: "success",
        });
      }
    },
    onSettled: (newUer, error, variables, onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: [queryKeys.user, user.id] });
    },
  });
  return patchUser;
}
