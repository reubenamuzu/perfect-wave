"use client";
import { AnimatePresence, motion } from "framer-motion";
import BundleCard from "./BundleCard";
import type { IBundle } from "@/types";

interface BundleGridProps {
  bundles: IBundle[];
}

export default function BundleGrid({ bundles }: BundleGridProps) {
  if (bundles.length === 0) {
    return (
      <div className="py-16 text-center text-gray-400">
        No bundles found for {bundles.length > 0 ? ` (${bundles[0].network})` : ''}.
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={bundles.map((b) => b._id).join(",")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
      >
        {bundles.map((bundle, i) => (
          <BundleCard key={bundle._id} bundle={bundle} index={i} />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
