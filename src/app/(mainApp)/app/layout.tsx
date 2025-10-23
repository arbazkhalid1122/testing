"use client";
import { ReactNode, Suspense } from "react";
import "./App.css";
import { AppHeader } from "./components/AppHeader";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="App">
      <Suspense>
        <AppHeader />
        {children}
      </Suspense>
    </div>
  );
}
