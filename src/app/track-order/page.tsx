"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Package,
  Settings,
  CheckCircle2,
  X,
  Copy,
  Check,
  Rocket,
} from "lucide-react";
import PageTransition from "@/components/shared/PageTransition";
import { formatDateTime } from "@/lib/utils";
import type { IOrder, OrderStatus } from "@/types";

const POLL_INTERVAL = 10_000;
const TERMINAL_STATUSES: OrderStatus[] = ["delivered", "cancelled"];

function timeSince(date: Date): string {
  const sec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (sec < 5) return "just now";
  if (sec < 60) return `${sec}s ago`;
  return `${Math.floor(sec / 60)}m ago`;
}

const STATUS_STEPS: {
  key: OrderStatus;
  label: string;
  sublabel: string;
  Icon: React.ElementType;
}[] = [
  {
    key: "pending",
    label: "Received",
    sublabel: "Order confirmed",
    Icon: Package,
  },
  {
    key: "processing",
    label: "Processing",
    sublabel: "Being prepared",
    Icon: Settings,
  },
  { key: "ready", label: "Ready", sublabel: "Out for delivery", Icon: Rocket },
  {
    key: "delivered",
    label: "Delivered",
    sublabel: "Order completed",
    Icon: CheckCircle2,
  },
];

const STATUS_INDEX: Record<OrderStatus, number> = {
  pending: 0,
  processing: 1,
  ready: 2,
  delivered: 3,
  cancelled: -1,
};

function CopyInline({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }}
      className="ml-1.5 text-[#5A7A99] hover:text-[#1B6CA8] transition-colors"
      aria-label="Copy order ID"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </button>
  );
}

function TrackOrderPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<IOrder | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [, setTick] = useState(0);

  // Tick every second to keep "Updated Xs ago" fresh
  useEffect(() => {
    if (!lastChecked) return;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [lastChecked]);

  // Auto-poll every 10s while order is in a non-terminal state
  const activeOrderId = order?.orderId ?? null;
  const activeStatus = order?.status ?? null;
  useEffect(() => {
    if (
      !activeOrderId ||
      !activeStatus ||
      TERMINAL_STATUSES.includes(activeStatus as OrderStatus)
    )
      return;
    const id = setInterval(async () => {
      try {
        const res = await fetch(`/api/track/${activeOrderId}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data.order);
          setLastChecked(new Date());
        }
      } catch {
        // silent — don't disrupt UI on network hiccup
      }
    }, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [activeOrderId, activeStatus]);

  async function fetchOrder(id: string) {
    setLoading(true);
    setError("");
    setOrder(null);
    setLastChecked(null);
    try {
      const res = await fetch(`/api/track/${id.toUpperCase()}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
        setLastChecked(new Date());
      } else {
        setError("Order not found. Double-check your Order ID.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // On mount: restore from ?id= param
  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setOrderId(id);
      fetchOrder(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSearch() {
    const trimmed = orderId.trim();
    if (!trimmed) return;
    router.replace(
      `/track-order?id=${encodeURIComponent(trimmed.toUpperCase())}`,
    );
    fetchOrder(trimmed);
  }

  const currentStep = order ? STATUS_INDEX[order.status] : -1;
  const isLive = order && !TERMINAL_STATUSES.includes(order.status);

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F4F8FC]">
        {/* Page header */}
        <div className="py-10 px-4 bg-[#F4F8FC]">
          <div className="max-w-7xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-2">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-[#1B6CA8]"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <p
                className="text-xs tracking-widest uppercase text-[#1B6CA8]"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                Live Tracking
              </p>
            </div>
            <h1
              className="text-3xl sm:text-4xl font-bold text-[#1A2E42] mb-1"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              Track Your Order
            </h1>
            <p
              className="text-[#5A7A99]"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              Enter your Order ID for real-time status updates
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
          {/* Search card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl border border-[#C8DFF0] p-6 sm:p-8"
            style={{ boxShadow: "0 2px 12px rgba(27,108,168,0.06)" }}
          >
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="e.g. DBH-2026-1234"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 h-11 px-4 rounded-xl text-[#1A2E42] placeholder-[#A0B8CC] text-sm outline-none border border-[#C8DFF0] focus:border-[#1B6CA8] transition-colors bg-[#F4F8FC]"
                style={{ fontFamily: "Outfit, sans-serif" }}
              />
              <motion.button
                onClick={handleSearch}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="h-11 px-6 rounded-xl text-sm font-semibold flex items-center gap-2 shrink-0 disabled:opacity-60 bg-[#1B6CA8] hover:bg-[#0D4F82] text-white transition-colors"
                style={{
                  fontFamily: "Outfit, sans-serif",
                  boxShadow: "0 4px 14px rgba(27,108,168,0.3)",
                }}
              >
                {loading ? (
                  <motion.div
                    className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                {loading ? "Scanning…" : "Track"}
              </motion.button>
            </div>

            {/* Idle hint */}
            <AnimatePresence>
              {!order && !error && !loading && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 text-xs text-[#A0B8CC]"
                  style={{ fontFamily: "Outfit, sans-serif" }}
                >
                  Your Order ID looks like{" "}
                  <span className="font-medium text-[#5A7A99]">
                    DBH-2026-1234
                  </span>{" "}
                  — check your WhatsApp confirmation message.
                </motion.p>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 border border-red-100"
                >
                  <X className="w-4 h-4 text-red-400 shrink-0" />
                  <p
                    className="text-sm text-red-500"
                    style={{ fontFamily: "Outfit, sans-serif" }}
                  >
                    {error}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Order result */}
          <AnimatePresence>
            {order && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="bg-white rounded-2xl border border-[#C8DFF0] overflow-hidden"
                style={{ boxShadow: "0 2px 12px rgba(27,108,168,0.06)" }}
              >
                {/* Order header */}
                <div className="px-6 pt-6 pb-5 border-b border-[#EAF3FB]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <span
                          className="text-lg font-bold text-[#1A2E42] tracking-wide"
                          style={{
                            fontFamily: "Plus Jakarta Sans, sans-serif",
                          }}
                        >
                          {order.orderId}
                        </span>
                        <CopyInline value={order.orderId} />
                      </div>
                      <p
                        className="text-sm text-[#5A7A99]"
                        style={{ fontFamily: "Outfit, sans-serif" }}
                      >
                        {order.customerName}
                      </p>

                      {/* Live indicator */}
                      {lastChecked && (
                        <div className="flex items-center gap-1.5 mt-1.5">
                          {isLive ? (
                            <motion.div
                              className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                              animate={{ opacity: [1, 0.3, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            />
                          ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-[#A0B8CC]" />
                          )}
                          <span
                            className="text-[10px] text-[#A0B8CC]"
                            style={{ fontFamily: "Outfit, sans-serif" }}
                          >
                            {isLive ? "Live · " : ""}Updated{" "}
                            {timeSince(lastChecked)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Status badge */}
                    <span
                      className="text-xs font-semibold px-3 py-1.5 rounded-full capitalize shrink-0"
                      style={
                        order.status === "delivered"
                          ? {
                              background: "#DCFCE7",
                              color: "#16A34A",
                              border: "1px solid #BBF7D0",
                              fontFamily: "Outfit, sans-serif",
                            }
                          : order.status === "cancelled"
                            ? {
                                background: "#FEE2E2",
                                color: "#DC2626",
                                border: "1px solid #FECACA",
                                fontFamily: "Outfit, sans-serif",
                              }
                            : order.status === "ready"
                              ? {
                                  background: "#EAF3FB",
                                  color: "#1B6CA8",
                                  border: "1px solid #C8DFF0",
                                  fontFamily: "Outfit, sans-serif",
                                }
                              : order.status === "processing"
                                ? {
                                    background: "#FEF9C3",
                                    color: "#A16207",
                                    border: "1px solid #FDE68A",
                                    fontFamily: "Outfit, sans-serif",
                                  }
                                : {
                                    background: "#F1F5F9",
                                    color: "#64748B",
                                    border: "1px solid #E2E8F0",
                                    fontFamily: "Outfit, sans-serif",
                                  }
                      }
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {order.status === "cancelled" ? (
                  <div className="px-6 py-10 text-center">
                    <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
                      <X className="w-6 h-6 text-red-400" />
                    </div>
                    <p
                      className="font-semibold text-[#1A2E42] mb-1"
                      style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                    >
                      Order Cancelled
                    </p>
                    <p
                      className="text-sm text-[#5A7A99]"
                      style={{ fontFamily: "Outfit, sans-serif" }}
                    >
                      Please contact us on WhatsApp for assistance.
                    </p>
                  </div>
                ) : (
                  <div className="px-6 py-8">
                    {/* Horizontal step tracker */}
                    <div className="relative">
                      {/* Background connector */}
                      <div className="absolute top-5 left-[calc(12.5%)] right-[calc(12.5%)] h-0.5 bg-[#E2EDF5]" />

                      {/* Animated progress fill */}
                      <motion.div
                        className="absolute top-5 left-[calc(12.5%)] h-0.5 bg-[#1B6CA8]"
                        style={{ boxShadow: "0 0 6px rgba(27,108,168,0.4)" }}
                        initial={{ width: "0%" }}
                        animate={{
                          width:
                            currentStep <= 0
                              ? "0%"
                              : currentStep === 1
                                ? "33.33%"
                                : currentStep === 2
                                  ? "66.66%"
                                  : "100%",
                        }}
                        transition={{
                          duration: 0.8,
                          delay: 0.3,
                          ease: "easeOut",
                        }}
                      />

                      {/* Steps */}
                      <div className="relative flex justify-between">
                        {STATUS_STEPS.map((step, i) => {
                          const isCompleted = i <= currentStep;
                          const isCurrent = i === currentStep;
                          const historyEntry = order.statusHistory?.find(
                            (h) => h.status === step.key,
                          );
                          return (
                            <div
                              key={step.key}
                              className="flex flex-col items-center w-1/4"
                            >
                              {/* Node */}
                              <div className="relative mb-3">
                                {isCurrent && (
                                  <motion.div
                                    className="absolute -inset-2 rounded-full bg-[#1B6CA8]/10 border border-[#1B6CA8]/20"
                                    animate={{
                                      scale: [1, 1.35, 1],
                                      opacity: [0.7, 0, 0.7],
                                    }}
                                    transition={{
                                      duration: 2,
                                      repeat: Infinity,
                                    }}
                                  />
                                )}
                                <motion.div
                                  className="w-10 h-10 rounded-full flex items-center justify-center"
                                  style={
                                    isCompleted
                                      ? {
                                          background: "#1B6CA8",
                                          boxShadow: isCurrent
                                            ? "0 0 16px rgba(27,108,168,0.35)"
                                            : "0 2px 8px rgba(27,108,168,0.2)",
                                        }
                                      : {
                                          background: "#F4F8FC",
                                          border: "1.5px solid #C8DFF0",
                                        }
                                  }
                                  initial={{ scale: 0.7, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{
                                    duration: 0.35,
                                    delay: i * 0.08,
                                  }}
                                >
                                  <step.Icon
                                    className="w-4 h-4"
                                    style={{
                                      color: isCompleted
                                        ? "#ffffff"
                                        : "#C8DFF0",
                                    }}
                                  />
                                </motion.div>
                              </div>

                              {/* Labels */}
                              <p
                                className="text-xs font-semibold text-center leading-tight mb-0.5"
                                style={{
                                  color: isCurrent
                                    ? "#1B6CA8"
                                    : isCompleted
                                      ? "#1A2E42"
                                      : "#A0B8CC",
                                  fontFamily: "Plus Jakarta Sans, sans-serif",
                                }}
                              >
                                {step.label}
                              </p>
                              <p
                                className="text-[10px] text-center leading-tight"
                                style={{
                                  color: "#A0B8CC",
                                  fontFamily: "Outfit, sans-serif",
                                }}
                              >
                                {historyEntry
                                  ? formatDateTime(historyEntry.timestamp)
                                  : step.sublabel}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}

export default function TrackOrderPageWrapper() {
  return (
    <Suspense>
      <TrackOrderPage />
    </Suspense>
  );
}
