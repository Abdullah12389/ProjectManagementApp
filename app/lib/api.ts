"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

export function visit(path: string) {
  window.location.href = path.startsWith("/") ? path : `/${path}`;
}

export function useApiResource<T>(url: string, fallback: T) {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<T>(url);
      setData(response.data);
    } catch (error: any) {
      if (error?.response?.status === 401) {
        router.push("/");
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, [router, url]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { data, setData, loading, reload };
}
