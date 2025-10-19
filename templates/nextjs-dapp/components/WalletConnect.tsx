"use client";

import { useState } from "react";
import { Lucid, Blockfrost } from "@lucid-evolution/lucid";

interface WalletConnectProps {
  onConnect: (lucid: Lucid) => void;
}

export default function WalletConnect({ onConnect }: WalletConnectProps) {
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  const connectWallet = async (walletName: string) => {
    setConnecting(true);
    setError(null);

    try {
      // Check if wallet is available
      if (!window.cardano || !window.cardano[walletName]) {
        throw new Error(`${walletName} wallet not found. Please install it.`);
      }

      // Enable wallet
      const api = await window.cardano[walletName].enable();

      // Initialize Lucid
      const lucid = await Lucid(
        new Blockfrost(
          process.env.NEXT_PUBLIC_BLOCKFROST_URL!,
          process.env.NEXT_PUBLIC_BLOCKFROST_KEY!
        ),
        process.env.NEXT_PUBLIC_NETWORK as "Mainnet" | "Preprod" | "Preview"
      );

      // Select wallet
      lucid.selectWallet.fromAPI(api);

      // Get address
      const address = await lucid.wallet().address();
      console.log("Connected to address:", address);

      onConnect(lucid);
      setConnected(true);
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet");
      console.error("Wallet connection error:", err);
    } finally {
      setConnecting(false);
    }
  };

  if (connected) {
    return (
      <div className="p-4 bg-green-100 rounded">
        <p className="text-green-800">✅ Wallet connected successfully!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Connect Wallet</h2>

      <div className="flex gap-4">
        <button
          onClick={() => connectWallet("nami")}
          disabled={connecting}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {connecting ? "Connecting..." : "Connect Nami"}
        </button>

        <button
          onClick={() => connectWallet("eternl")}
          disabled={connecting}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
        >
          {connecting ? "Connecting..." : "Connect Eternl"}
        </button>

        <button
          onClick={() => connectWallet("lace")}
          disabled={connecting}
          className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50"
        >
          {connecting ? "Connecting..." : "Connect Lace"}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-100 rounded">
          <p className="text-red-800">❌ {error}</p>
        </div>
      )}
    </div>
  );
}
