"use client";

import { useState } from "react";
import type { Lucid } from "@lucid-evolution/lucid";

interface TransactionBuilderProps {
  lucid: Lucid;
}

export default function TransactionBuilder({ lucid }: TransactionBuilderProps) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sendADA = async () => {
    if (!recipient || !amount) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError(null);
    setTxHash(null);

    try {
      // Build transaction
      const tx = await lucid
        .newTx()
        .pay.ToAddress(recipient, { lovelace: BigInt(Number(amount) * 1_000_000) })
        .complete();

      // Sign transaction
      const signedTx = await tx.sign.withWallet().complete();

      // Submit transaction
      const hash = await signedTx.submit();

      setTxHash(hash);
      console.log("Transaction submitted:", hash);

      // Reset form
      setRecipient("");
      setAmount("");
    } catch (err: any) {
      setError(err.message || "Transaction failed");
      console.error("Transaction error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Send ADA</h2>

      <div className="space-y-2">
        <input
          type="text"
          placeholder="Recipient address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        />

        <input
          type="number"
          placeholder="Amount (ADA)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        />

        <button
          onClick={sendADA}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>

      {txHash && (
        <div className="p-4 bg-green-100 rounded">
          <p className="text-green-800">✅ Transaction submitted!</p>
          <a
            href={`https://preprod.cardanoscan.io/transaction/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View on CardanoScan
          </a>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 rounded">
          <p className="text-red-800">❌ {error}</p>
        </div>
      )}
    </div>
  );
}
