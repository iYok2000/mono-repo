"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchHealthStatuses, ServiceHealth } from "../services/healthService";

type State = {
  data: ServiceHealth[];
  loading: boolean;
  error: string | null;
};

export const useHealthChecks = () => {
  const [state, setState] = useState<State>({
    data: [],
    loading: true,
    error: null,
  });

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const results = await fetchHealthStatuses();
      setState({ data: results, loading: false, error: null });
    } catch (error) {
      setState({
        data: [],
        loading: false,
        error:
          (error as Error)?.message ||
          "Unable to load health statuses at the moment.",
      });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    refresh: load,
  };
};
