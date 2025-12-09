const API_BASE = process.env.NEXT_PUBLIC_GO_API_URL || "http://localhost:8080";

export type GRPCResponse = {
  message: string;
  timestamp: number;
};

export type APIResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export const callSayHello = async (
  name: string
): Promise<APIResponse<GRPCResponse>> => {
  try {
    const res = await fetch(`${API_BASE}/api/grpc/say-hello`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    return await res.json();
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
    };
  }
};

export const callSayHelloStream = async (
  name: string,
  onMessage: (message: GRPCResponse) => void,
  onComplete: () => void,
  onError: (error: string) => void
): Promise<void> => {
  try {
    const res = await fetch(`${API_BASE}/api/grpc/say-hello-stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) {
      const data = await res.json();
      onError(data.error || "Stream failed");
      return;
    }

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      onError("No response body");
      return;
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.substring(6);
          try {
            const parsed = JSON.parse(data) as GRPCResponse;
            onMessage(parsed);
          } catch {
            // Ignore malformed JSON
          }
        }
      }
    }

    onComplete();
  } catch (error) {
    onError((error as Error).message);
  }
};
