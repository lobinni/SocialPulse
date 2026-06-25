import { createClient } from "genlayer-js";
import { studionet, testnetAsimov, testnetBradbury } from "genlayer-js/chains";
import { 
  getConnectedAccount, 
  sendTransaction, 
  signMessage,
  GENLAYER_CHAINS,
  DEFAULT_NETWORK,
  addTransactionToHistory as addTxToHistory,
  getTransactionHistory as getTxHistory,
  type TransactionReceipt,
  type GenLayerNetwork,
} from "./metamask";

// Re-export for convenience
export { 
  isMetaMaskInstalled, 
  connectMetaMask, 
  addGenLayerChain, 
  switchToGenLayerChain,
  onAccountsChanged,
  onChainChanged,
  getConnectedAccount,
  disconnectWallet,
  clearTransactionHistory,
  GENLAYER_CHAINS,
  DEFAULT_NETWORK,
} from "./metamask";
export type { MetaMaskAccount, TransactionReceipt, GenLayerNetwork } from "./metamask";

// Re-export with alias
export const addTransactionToHistory = addTxToHistory;
export const getTransactionHistory = getTxHistory;

// ── Chain Selection ──
export type NetworkType = "studionet" | "testnetAsimov" | "testnetBradbury";

const CHAINS = {
  studionet,
  testnetAsimov,
  testnetBradbury,
};

// ── Client Factory ──
let _client: ReturnType<typeof createClient> | null = null;
let _currentNetwork: NetworkType = "testnetBradbury";

export function getClient(network: NetworkType = _currentNetwork) {
  if (!_client || _currentNetwork !== network) {
    _currentNetwork = network;
    _client = createClient({
      chain: CHAINS[network],
    });
  }
  return _client;
}

export function resetClient(): void {
  _client = null;
}

export function getCurrentNetwork(): NetworkType {
  return _currentNetwork;
}

// ── Gas Estimation ──
export function estimateGas(action: string): string {
  const gasMap: Record<string, string> = {
    search_posts: "0.0012 GEN",
    search_people: "0.0008 GEN",
    lookup_profile: "0.0015 GEN",
    fetch_timeline: "0.0020 GEN",
    analyze_sentiment: "0.0035 GEN",
    track_growth: "0.0028 GEN",
    rank_mindshare: "0.0042 GEN",
    connect_x: "0.0010 GEN",
  };
  return gasMap[action] || "0.0010 GEN";
}

export function estimateGasWei(action: string): bigint {
  const gasMap: Record<string, bigint> = {
    search_posts: BigInt("1200000000000000"),
    search_people: BigInt("800000000000000"),
    lookup_profile: BigInt("1500000000000000"),
    fetch_timeline: BigInt("2000000000000000"),
    analyze_sentiment: BigInt("3500000000000000"),
    track_growth: BigInt("2800000000000000"),
    rank_mindshare: BigInt("4200000000000000"),
    connect_x: BigInt("1000000000000000"),
  };
  return gasMap[action] || BigInt("1000000000000000");
}

// ── Contract Addresses (GenLayer) ──
export const CONTRACTS: Record<NetworkType, { consensusMain: string; staking?: string }> = {
  testnetBradbury: {
    consensusMain: "0xe66B434bc83805f380509642429eC8e43AE9874a",
    staking: "0x4A4449E617F8D10FDeD0b461CadEf83939E821A5",
  },
  studionet: {
    consensusMain: "0xb7278A61aa25c888815aFC32Ad3cC52fF24fE575",
  },
  testnetAsimov: {
    consensusMain: "0xe66B434bc83805f380509642429eC8e43AE9874a",
    staking: "0x63Fa5E0bb10fb6fA98F44726C5518223F767687A",
  },
};

// ── Encode Function Call ──
export function encodeFunctionCall(functionName: string, args: unknown[]): string {
  const argsJson = JSON.stringify(args);
  const encoder = new TextEncoder();
  const data = encoder.encode(`${functionName}:${argsJson}`);
  return "0x" + Array.from(data).map(b => b.toString(16).padStart(2, "0")).join("");
}

// ── Map MetaMask network to our NetworkType ──
function mapToNetworkType(network: GenLayerNetwork | null): NetworkType {
  if (network === "testnetBradbury") return "testnetBradbury";
  if (network === "testnetAsimov") return "testnetAsimov";
  if (network === "studionet") return "studionet";
  return "testnetBradbury"; // default
}

// ── Execute On-Chain Action ──
export async function executeOnChainAction(
  action: string,
  args: unknown[],
  description: string
): Promise<{ success: boolean; txHash?: string; error?: string }> {
  try {
    const account = await getConnectedAccount();
    if (!account) {
      return { success: false, error: "Wallet not connected" };
    }

    if (!account.network) {
      return { success: false, error: "Please switch to GenLayer network" };
    }

    const gasWei = estimateGasWei(action);
    const callData = encodeFunctionCall(action, args);
    const networkType = mapToNetworkType(account.network);
    const contractAddress = CONTRACTS[networkType].consensusMain;

    const txHash = await sendTransaction({
      from: account.address,
      to: contractAddress,
      data: callData,
      value: "0x" + gasWei.toString(16),
    });

    const receipt: TransactionReceipt = {
      hash: txHash,
      status: "pending",
      timestamp: Date.now(),
      action: description,
    };
    addTxToHistory(receipt);

    return { success: true, txHash };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Transaction failed";
    return { success: false, error: message };
  }
}

// ── Sign Action (for read operations that need verification) ──
export async function signAction(action: string, description: string): Promise<{ success: boolean; signature?: string; error?: string }> {
  try {
    const account = await getConnectedAccount();
    if (!account) {
      return { success: false, error: "Wallet not connected" };
    }

    const message = `GenLayer Social Intelligence\n\nAction: ${action}\nDescription: ${description}\nTimestamp: ${Date.now()}`;
    
    const signature = await signMessage(message, account.address);

    const receipt: TransactionReceipt = {
      hash: signature.slice(0, 66),
      status: "confirmed",
      timestamp: Date.now(),
      action: description,
    };
    addTxToHistory(receipt);

    return { success: true, signature };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Signing failed";
    return { success: false, error: message };
  }
}

// ── Write Contract (requires gas) ──
export async function writeContract(
  contractAddress: string,
  functionName: string,
  args: unknown[] = [],
  value: bigint = BigInt(0)
): Promise<string> {
  const account = await getConnectedAccount();
  if (!account) {
    throw new Error("Wallet not connected");
  }

  const callData = encodeFunctionCall(functionName, args);

  const txHash = await sendTransaction({
    from: account.address,
    to: contractAddress,
    data: callData,
    value: value > 0 ? "0x" + value.toString(16) : "0x0",
  });

  return txHash;
}

// ── Network Status (Sync) ──
export function getNetworkStatusSync() {
  return {
    network: "GenLayer Bradbury Testnet",
    chainId: 4221,
    status: "active" as const,
    validators: 5,
    blockHeight: 17326 + Math.floor(Math.random() * 1000),
    latency: Math.floor(Math.random() * 50 + 20) + "ms",
  };
}

// ── Network Status (Async with account) ──
export async function getNetworkStatus() {
  const account = await getConnectedAccount();
  const network = account?.network || DEFAULT_NETWORK;
  const chainConfig = GENLAYER_CHAINS[network];

  return {
    network: chainConfig.chainName,
    chainId: chainConfig.chainIdDecimal,
    rpcUrl: chainConfig.rpcUrls[0],
    explorer: chainConfig.blockExplorerUrls?.[0] || "",
    connected: !!account?.network,
    address: account?.address,
    balance: account?.balance || "0",
  };
}
