import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  api,
  GeneralApiResponse,
  GeneralApiResponsePagination,
} from "./axios.service";

export interface IVendor {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type QueryObj = {
  limit?: string;
  page?: string;
  search?: string;
};

/* MUTATIONS */
const mutations = {
  createVendor: (data: Partial<IVendor>) => {
    return api.post<GeneralApiResponse<IVendor>>("/vendor", data);
  },
  updateVendor: (data: Partial<IVendor>) => {
    return api.patch<GeneralApiResponse<IVendor>>(`/vendor/${data?._id}`, data);
  },
  deleteVendor: (vendorId: string) => {
    return api.delete<GeneralApiResponse<IVendor>>(`/vendor/${vendorId}`);
  },
};

/* QUERIES */
const queries = {
  getVendors: (queryObj: QueryObj) => {
    const query = new URLSearchParams(
      queryObj as Record<string, string>
    ).toString();
    return api.get<GeneralApiResponsePagination<IVendor>>(`/vendor?${query}`);
  },
  getVendorById: (vendorId: string) => {
    return api.get<GeneralApiResponse<IVendor>>(`/vendor/${vendorId}`);
  },
};

/* HOOKS */
export const useCreateVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mutations.createVendor,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
    },
  });
};

export const useUpdateVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mutations.updateVendor,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      queryClient.invalidateQueries({ queryKey: ["vendor"] });
    },
  });
};

export const useDeleteVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mutations.deleteVendor,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      queryClient.invalidateQueries({ queryKey: ["vendor"] });
    },
  });
};

export const useVendors = (queryObj: QueryObj) => {
  return useQuery({
    queryKey: ["vendors", queryObj],
    queryFn: () => queries.getVendors(queryObj).then((res) => res.data),
  });
};

export const useVendor = (vendorId: string, enabled = true) => {
  return useQuery({
    queryKey: ["vendor", vendorId],
    queryFn: () => queries.getVendorById(vendorId).then((res) => res.data),
    enabled: enabled,
  });
};
