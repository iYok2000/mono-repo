export type ServiceConfig = {
  key: "node" | "go";
  name: string;
  url: string;
  description: string;
};

const withDefault = (value: string | undefined, fallback: string) =>
  value && value.trim().length > 0 ? value : fallback;

export const services: ServiceConfig[] = [
  {
    key: "node",
    name: "Node API",
    url: withDefault(
      process.env.NEXT_PUBLIC_NODE_HEALTH_URL,
      "http://localhost:3001/health"
    ),
    description: "Express service health endpoint",
  },
  {
    key: "go",
    name: "Go API",
    url: withDefault(
      process.env.NEXT_PUBLIC_GO_HEALTH_URL,
      "http://localhost:8080/health"
    ),
    description: "Gin service health endpoint",
  },
];
