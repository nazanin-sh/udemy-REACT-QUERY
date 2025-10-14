import type { Treatment } from "@shared/types";

import { axiosInstance } from "@/axiosInstance";
import { queryKeys } from "@/react-query/constants";
import { useQuery } from "@tanstack/react-query";
// import { useCustomToast } from "@/components/app/hooks/useCustomToast";

// for when we need a query function for useQuery
async function getTreatments(): Promise<Treatment[]> {
  const { data } = await axiosInstance.get("/treatments");
  return data;
}

export function useTreatments(): Treatment[] {
  // const toast = useCustomToast();
  const fallback: any = [];
  const {
    data = fallback,
    isError,
    error,
  } = useQuery({
    queryKey: [queryKeys.treatments],
    queryFn: getTreatments,
  });
  // if (isError && error) {
  //   const title =
  //     error instanceof Error
  //       ? error.toString().replace(/^Error:\s*/, "")
  //       : "Error connecting to the server";
  //   toast({ title, status: "error" });
  // }
  return data;
}
