import { AxiosResponse } from "axios";

import type { User } from "@shared/types";
import { useLoginData } from "@/auth/AuthContext";
import { axiosInstance, getJWTHeader } from "@/axiosInstance";
import { queryKeys } from "@/react-query/constants";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
// query function
async function getUser(userId: number, userToken: string) {
  const { data }: AxiosResponse<{ user: User }> = await axiosInstance.get(
    `/user/${userId}`,
    {
      headers: getJWTHeader(userToken),
    }
  );

  return data.user;
}

export function useUser() {
  const queryClient = useQueryClient();
  // TODO: call useQuery to update user data from server
  const { userId, userToken } = useLoginData();
  console.log({ userId });

  const { data: user } = useQuery({
    queryKey: [queryKeys.user, userId],
    queryFn: () => getUser(userId, userToken),
    enabled: !!userId,
    staleTime: Infinity,
  });
  // meant to be called from useAuth
  function updateUser(newUser: User): void {
    // TODO: update the user in the query cache
    queryClient.setQueryData([queryKeys.user, userId], newUser);
  }

  // meant to be called from useAuth
  function clearUser() {
    // TODO: reset user to null in query cache
    queryClient.removeQueries({ queryKey: [queryKeys.user, userId] });
    queryClient.removeQueries({
      queryKey: [queryKeys.appointments, queryKeys.user],
    });
  }

  return { user, updateUser, clearUser };
}
