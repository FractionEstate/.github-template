"use client";

import { useState } from "react";
import WalletConnect from "@/components/WalletConnect";
import TransactionBuilder from "@/components/TransactionBuilder";
import type { Lucid } from "@lucid-evolution/lucid";

export default function Home() {
  const [lucid, setLucid] = useState<Lucid | null>(null);

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">Cardano DApp</h1>

      <WalletConnect onConnect={setLucid} />

      {lucid && (
        <div className="mt-8">
          <TransactionBuilder lucid={lucid} />
        </div>
      )}
    </main>
  );
}
