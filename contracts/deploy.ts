/**
 * Deploy SocialIntelligence contract to GenLayer Testnet Bradbury
 *
 * Usage:
 *   npx tsx contracts/deploy.ts
 *
 * Prerequisites:
 *   npm install genlayer-js tsx
 *   Set PRIVATE_KEY env var or it will auto-generate one.
 */

import { readFileSync } from "fs";
import { createClient, createAccount } from "genlayer-js";
import { testnetBradbury } from "genlayer-js/chains";

async function main() {
  // ── Account Setup ──
  const privateKey = process.env.PRIVATE_KEY as `0x${string}` | undefined;
  const account = privateKey ? createAccount(privateKey) : createAccount();
  console.log("\n🔑 Deployer address:", account.address);

  if (!privateKey) {
    console.log("⚠️  No PRIVATE_KEY env var set — generated a new account.");
    console.log("    Fund it from: https://testnet-faucet.genlayer.foundation/");
    console.log("    Then re-run with: PRIVATE_KEY=0x... npx tsx contracts/deploy.ts\n");
  }

  // ── Client ──
  const client = createClient({
    chain: testnetBradbury,
    account,
  });

  console.log("🌐 Network: GenLayer Bradbury Testnet (chain 4221)");
  console.log("🔗 RPC:     https://rpc-bradbury.genlayer.com\n");

  // ── Read Contract Code ──
  const contractCode = readFileSync("./contracts/social_intelligence.py", "utf-8");
  console.log("📜 Contract: social_intelligence.py");
  console.log(`   Size: ${contractCode.length} bytes\n`);

  // ── Deploy ──
  console.log("🚀 Deploying...");
  try {
    const txHash = await client.deployContract({
      code: contractCode,
      args: [],
      leaderOnly: false,
    });
    console.log("📤 Tx hash:", txHash);

    // ── Wait for Receipt ──
    console.log("⏳ Waiting for confirmation...\n");
    const receipt = await client.waitForTransactionReceipt({
      hash: txHash,
      status: "FINALIZED",
      retries: 60,
      interval: 5000,
    });

    const contractAddress = (receipt as any).data?.contract_address
      || (receipt as any).contract_address
      || "unknown";

    console.log("✅ Contract deployed successfully!");
    console.log("📍 Contract address:", contractAddress);
    console.log("\n────────────────────────────────────────────");
    console.log("Add this to your frontend .env:");
    console.log(`VITE_CONTRACT_ADDRESS=${contractAddress}`);
    console.log("────────────────────────────────────────────\n");
  } catch (error: any) {
    console.error("❌ Deployment failed:", error.message || error);
    process.exit(1);
  }
}

main();
