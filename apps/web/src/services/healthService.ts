import { ApiResponse, HealthCheck } from "@mono-repo/shared-types";
import { ServiceConfig, services } from "../config/services";

export type ServiceHealth = {
  key: ServiceConfig["key"];
  name: string;
  status: HealthCheck["status"];
  description: string;
  latencyMs?: number;
  checkedAt: string;
  endpoint: string;
};

const mapStatus = (data?: HealthCheck): HealthCheck["status"] =>
  data?.status === "healthy" ? "healthy" : "unhealthy";

const fetchHealth = async (
  service: ServiceConfig
): Promise<ServiceHealth> => {
  const startedAt = Date.now();
  try {
    const res = await fetch(service.url, {
      cache: "no-store",
    });
    const latencyMs = Date.now() - startedAt;

    if (!res.ok) {
      return {
        key: service.key,
        name: service.name,
        status: "unhealthy",
        description: `HTTP ${res.status}`,
        latencyMs,
        checkedAt: new Date().toISOString(),
        endpoint: service.url,
      };
    }

    const body = (await res.json()) as ApiResponse<HealthCheck>;
    const status = body.success ? mapStatus(body.data) : "unhealthy";
    const description =
      status === "healthy"
        ? body.message || service.description
        : body.error || "Service reported unhealthy";

    return {
      key: service.key,
      name: service.name,
      status,
      description,
      latencyMs,
      checkedAt: new Date().toISOString(),
      endpoint: service.url,
    };
  } catch (error) {
    return {
      key: service.key,
      name: service.name,
      status: "unhealthy",
      description:
        (error as Error)?.message || "Unknown error while reaching service",
      checkedAt: new Date().toISOString(),
      endpoint: service.url,
    };
  }
};

export const fetchHealthStatuses = async (): Promise<ServiceHealth[]> =>
  Promise.all(services.map((svc) => fetchHealth(svc)));
