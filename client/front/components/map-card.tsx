"use client";

import { ReactNode } from "react";

export function MapCard({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {children}
    </div>
  );
}