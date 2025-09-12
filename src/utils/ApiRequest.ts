// src/utils/apiRequest.ts

import apiClient from "../services/ApiClient";

type Method = 'get' | 'post' | 'put' | 'delete' | 'patch';

interface ApiRequestOptions {
  url: string;
  method?: Method;
  data?: any;
  params?: any;
  headers?: any;
}

export const apiRequest = async ({
  url,
  method = 'get',
  data = null,
  params = null,
  headers = {},
}: ApiRequestOptions) => {
  try {
    const response = await apiClient.request({
      url,
      method,
      data,
      params,
      headers,
    });

    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};
