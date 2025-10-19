import { Lucid, Blockfrost } from "@lucid-evolution/lucid";

export async function initLucid() {
  const lucid = await Lucid(
    new Blockfrost(
      process.env.NEXT_PUBLIC_BLOCKFROST_URL!,
      process.env.NEXT_PUBLIC_BLOCKFROST_KEY!
    ),
    process.env.NEXT_PUBLIC_NETWORK as "Mainnet" | "Preprod" | "Preview"
  );

  return lucid;
}
