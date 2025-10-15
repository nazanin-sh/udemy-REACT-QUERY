import { useState, useCallback } from "react";

import type { Staff } from "@shared/types";

import { filterByTreatment } from "../utils";

import { axiosInstance } from "@/axiosInstance";
import { queryKeys } from "@/react-query/constants";
import { useQuery } from "@tanstack/react-query";
// query function for useQuery
async function getStaff(): Promise<Staff[]> {
  const { data } = await axiosInstance.get("/staff");
  return data;
}

export function useStaff() {
  // for filtering staff by treatment
  const [filter, setFilter] = useState("all");
  const selectfn = useCallback(
    (unfilteredData: any) => filterByTreatment(unfilteredData, filter),
    [filter]
  );
  const fallback: any = [];
  const { data: staff = fallback } = useQuery({
    queryKey: [queryKeys.staff],
    queryFn: getStaff,
    select: filter !== "all" ? selectfn : undefined,
  });

  return { staff, filter, setFilter };
}
