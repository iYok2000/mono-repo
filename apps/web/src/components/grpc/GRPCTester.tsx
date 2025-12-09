"use client";

import { useState } from "react";
import {
  callSayHello,
  callSayHelloStream,
  type GRPCResponse,
} from "../../services/grpcService";

export const GRPCTester = () => {
  const [name, setName] = useState("Noppachai");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GRPCResponse | null>(null);
  const [streamResults, setStreamResults] = useState<GRPCResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSayHello = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    const res = await callSayHello(name);

    if (res.success && res.data) {
      setResult(res.data);
    } else {
      setError(res.error || "Unknown error");
    }

    setLoading(false);
  };

  const handleSayHelloStream = async () => {
    setLoading(true);
    setError(null);
    setStreamResults([]);

    await callSayHelloStream(
      name,
      (message) => {
        setStreamResults((prev) => [...prev, message]);
      },
      () => {
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString();
  };

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
          gRPC Testing
        </p>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
          Greeter Service
        </h2>
        <p className="text-sm text-zinc-600">
          Test unary and streaming gRPC calls via REST wrapper
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-zinc-700"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
            placeholder="Enter your name"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSayHello}
            disabled={loading || !name.trim()}
            className="flex-1 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Say Hello (Unary)
          </button>
          <button
            onClick={handleSayHelloStream}
            disabled={loading || !name.trim()}
            className="flex-1 rounded-full border border-zinc-900 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Say Hello (Stream)
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <strong className="font-semibold">Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-semibold text-emerald-800">
            Unary Response:
          </p>
          <p className="mt-1 text-emerald-900">{result.message}</p>
          <p className="mt-1 text-xs text-emerald-700">
            Timestamp: {formatTimestamp(result.timestamp)}
          </p>
        </div>
      )}

      {streamResults.length > 0 && (
        <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-semibold text-blue-800">
            Stream Responses ({streamResults.length}):
          </p>
          <div className="mt-2 space-y-2">
            {streamResults.map((msg, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-blue-300 bg-white p-3"
              >
                <p className="text-sm text-blue-900">{msg.message}</p>
                <p className="mt-1 text-xs text-blue-700">
                  {formatTimestamp(msg.timestamp)}
                </p>
              </div>
            ))}
          </div>
          {loading && (
            <p className="mt-2 text-xs text-blue-700">
              Receiving messages...
            </p>
          )}
        </div>
      )}
    </section>
  );
};
