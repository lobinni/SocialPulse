// ══════════════════════════════════════════════════════
//  GenLayer Intelligent Contract Integration
//  Reads/writes the deployed SocialIntelligence contract
// ══════════════════════════════════════════════════════

import { createClient } from "genlayer-js";
import { testnetBradbury } from "genlayer-js/chains";
import { sendTransaction, getConnectedAccount, addTransactionToHistory } from "./metamask";
import type { TransactionReceipt } from "./metamask";

// Contract address — set via env after deploying
const CONTRACT_ADDRESS: string =
  (import.meta as unknown as { env: Record<string, string> }).env
    .VITE_CONTRACT_ADDRESS || "";

// ── Read-only client (no account needed) ──
const readClient = createClient({ chain: testnetBradbury });

// ── Check if contract is configured ──
export function isContractConfigured(): boolean {
  return !!CONTRACT_ADDRESS && CONTRACT_ADDRESS.startsWith("0x");
}

export function getContractAddress(): string {
  return CONTRACT_ADDRESS;
}

// ══════════════════════════════
//  READ METHODS (free, no gas)
// ══════════════════════════════

export async function readLatestPosts(): Promise<unknown> {
  if (!isContractConfigured()) return null;
  try {
    return await readClient.readContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      functionName: "get_latest_posts",
      args: [],
    });
  } catch (e) {
    console.error("readLatestPosts error:", e);
    return null;
  }
}

export async function readSentiment(): Promise<unknown> {
  if (!isContractConfigured()) return null;
  try {
    return await readClient.readContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      functionName: "get_sentiment",
      args: [],
    });
  } catch (e) {
    console.error("readSentiment error:", e);
    return null;
  }
}

export async function readMindshare(): Promise<unknown> {
  if (!isContractConfigured()) return null;
  try {
    return await readClient.readContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      functionName: "get_mindshare",
      args: [],
    });
  } catch (e) {
    console.error("readMindshare error:", e);
    return null;
  }
}

export async function readStats(): Promise<unknown> {
  if (!isContractConfigured()) return null;
  try {
    return await readClient.readContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      functionName: "get_stats",
      args: [],
    });
  } catch (e) {
    console.error("readStats error:", e);
    return null;
  }
}

export async function readAllData(): Promise<unknown> {
  if (!isContractConfigured()) return null;
  try {
    return await readClient.readContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      functionName: "get_all_data",
      args: [],
    });
  } catch (e) {
    console.error("readAllData error:", e);
    return null;
  }
}

// ══════════════════════════════
//  WRITE METHODS (require gas + MetaMask)
// ══════════════════════════════

/**
 * Calls a write method on the contract via MetaMask.
 * MetaMask will prompt the user to confirm the transaction.
 */
async function callWriteMethod(
  functionName: string,
  args: unknown[],
  description: string
): Promise<{ success: boolean; txHash?: string; error?: string }> {
  if (!isContractConfigured()) {
    return {
      success: false,
      error: "Contract not deployed. Set VITE_CONTRACT_ADDRESS in .env",
    };
  }

  const account = await getConnectedAccount();
  if (!account) {
    return { success: false, error: "Wallet not connected" };
  }
  if (!account.network) {
    return { success: false, error: "Switch to GenLayer Bradbury Testnet" };
  }

  try {
    // Encode call data for the GenLayer contract
    const encoder = new TextEncoder();
    const callPayload = JSON.stringify({ method: functionName, args });
    const data =
      "0x" +
      Array.from(encoder.encode(callPayload))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

    const txHash = await sendTransaction({
      from: account.address,
      to: CONTRACT_ADDRESS,
      data,
      value: "0x0",
    });

    const receipt: TransactionReceipt = {
      hash: txHash,
      status: "pending",
      timestamp: Date.now(),
      action: description,
    };
    addTransactionToHistory(receipt);

    return { success: true, txHash };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Transaction failed",
    };
  }
}

// ── Public write wrappers ──

export async function fetchGenLayerPosts() {
  return callWriteMethod(
    "fetch_genlayer_posts",
    [],
    "Fetch @GenLayer posts from X"
  );
}

export async function analyzeSentiment(topic = "GenLayer") {
  return callWriteMethod(
    "analyze_sentiment",
    [topic],
    `Analyze sentiment for "${topic}"`
  );
}

export async function analyzeMindshare() {
  return callWriteMethod(
    "analyze_mindshare",
    [],
    "Analyze @GenLayer mindshare rankings"
  );
}

export async function searchTopic(query: string) {
  return callWriteMethod(
    "search_topic",
    [query],
    `Search topic: "${query}"`
  );
}
