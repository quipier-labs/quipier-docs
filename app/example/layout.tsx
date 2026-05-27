import Link from "next/link";
import type { ReactNode } from "react";
import "./playground.css";

export default function ExampleLayout({ children }: { children: ReactNode }) {
  return (
    <div className="qp-pg-root">
      <div className="qp-pg-bar">
        <Link href="/docs">← Quipier Docs</Link>
      </div>
      {children}
    </div>
  );
}
