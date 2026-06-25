// ══════════════════════════════════════
// MetaMask & GenLayer Chain Integration
// ══════════════════════════════════════

// GenLayer Network Configurations
export const GENLAYER_CHAINS = {
  testnetBradbury: {
    chainId: "0x107D", // 4221 in hex
    chainIdDecimal: 4221,
    chainName: "GenLayer Bradbury Testnet",
    rpcUrls: ["https://rpc-bradbury.genlayer.com"],
    nativeCurrency: {
      name: "GEN Token",
      symbol: "GEN",
      decimals: 18,
    },
    blockExplorerUrls: ["https://explorer-bradbury.genlayer.com"],
  },
  studionet: {
    chainId: "0xF21F", // 61999 in hex
    chainIdDecimal: 61999,
    chainName: "GenLayer Studionet",
    rpcUrls: ["https://studio.genlayer.com/api"],
    nativeCurrency: {
      name: "GEN Token",
      symbol: "GEN",
      decimals: 18,
    },
    blockExplorerUrls: ["https://genlayer-explorer.vercel.app"],
  },
  testnetAsimov: {
    chainId: "0x107D", // 4221 in hex (same as Bradbury)
    chainIdDecimal: 4221,
    chainName: "GenLayer Asimov Testnet",
    rpcUrls: ["https://rpc-asimov.genlayer.com"],
    nativeCurrency: {
      name: "GEN Token",
      symbol: "GEN",
      decimals: 18,
    },
    blockExplorerUrls: ["https://explorer-asimov.genlayer.com"],
  },
} as const;

// Default network for first-time connection
export const DEFAULT_NETWORK: GenLayerNetwork = "testnetBradbury";

export type GenLayerNetwork = keyof typeof GENLAYER_CHAINS;

// ── Types ──
export interface MetaMaskAccount {
  address: string;
  chainId: string;
  network: GenLayerNetwork | null;
  balance: string;
}

export interface TransactionRequest {
  to?: string;
  from: string;
  data: string;
  value?: string;
  gas?: string;
}

export interface TransactionReceipt {
  hash: string;
  status: "pending" | "confirmed" | "failed";
  blockNumber?: number;
  gasUsed?: string;
  timestamp: number;
  action: string;
}

// ── MetaMask Detection ──
export function isMetaMaskInstalled(): boolean {
  return typeof window !== "undefined" && typeof window.ethereum !== "undefined" && window.ethereum.isMetaMask === true;
}

// ── Get Current Account ──
export async function getConnectedAccount(): Promise<MetaMaskAccount | null> {
  if (!isMetaMaskInstalled()) return null;
  
  try {
    const accounts = await window.ethereum!.request({ method: "eth_accounts" }) as string[];
    if (accounts.length === 0) return null;

    const chainId = await window.ethereum!.request({ method: "eth_chainId" }) as string;
    const network = getNetworkFromChainId(chainId);
    
    let balance = "0";
    try {
      const balanceHex = await window.ethereum!.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      }) as string;
      balance = formatBalance(balanceHex);
    } catch {
      // Balance fetch failed
    }

    return {
      address: accounts[0],
      chainId,
      network,
      balance,
    };
  } catch {
    return null;
  }
}

// ── Connect MetaMask ──
export async function connectMetaMask(): Promise<MetaMaskAccount> {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask is not installed. Please install MetaMask extension.");
  }

  try {
    const accounts = await window.ethereum!.request({ method: "eth_requestAccounts" }) as string[];
    
    if (accounts.length === 0) {
      throw new Error("No accounts found. Please unlock MetaMask.");
    }

    const chainId = await window.ethereum!.request({ method: "eth_chainId" }) as string;
    const network = getNetworkFromChainId(chainId);

    let balance = "0";
    try {
      const balanceHex = await window.ethereum!.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      }) as string;
      balance = formatBalance(balanceHex);
    } catch {
      // Balance fetch failed
    }

    return {
      address: accounts[0],
      chainId,
      network,
      balance,
    };
  } catch (error: unknown) {
    if ((error as { code?: number }).code === 4001) {
      throw new Error("Connection rejected by user.");
    }
    throw error;
  }
}

// ── Add GenLayer Chain to MetaMask ──
export async function addGenLayerChain(network: GenLayerNetwork = DEFAULT_NETWORK): Promise<boolean> {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask is not installed.");
  }

  const chainConfig = GENLAYER_CHAINS[network];

  try {
    await window.ethereum!.request({
      method: "wallet_addEthereumChain",
      params: [{
        chainId: chainConfig.chainId,
        chainName: chainConfig.chainName,
        rpcUrls: chainConfig.rpcUrls,
        nativeCurrency: chainConfig.nativeCurrency,
        blockExplorerUrls: chainConfig.blockExplorerUrls,
      }],
    });
    return true;
  } catch (error: unknown) {
    if ((error as { code?: number }).code === 4001) {
      throw new Error("User rejected adding the network.");
    }
    throw error;
  }
}

// ── Switch to GenLayer Chain ──
export async function switchToGenLayerChain(network: GenLayerNetwork = DEFAULT_NETWORK): Promise<boolean> {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask is not installed.");
  }

  const chainConfig = GENLAYER_CHAINS[network];

  try {
    await window.ethereum!.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainConfig.chainId }],
    });
    return true;
  } catch (error: unknown) {
    // Chain not added yet, try to add it
    if ((error as { code?: number }).code === 4902) {
      return await addGenLayerChain(network);
    }
    if ((error as { code?: number }).code === 4001) {
      throw new Error("User rejected switching network.");
    }
    throw error;
  }
}

// ── Send Transaction ──
export async function sendTransaction(request: TransactionRequest): Promise<string> {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask is not installed.");
  }

  try {
    const txHash = await window.ethereum!.request({
      method: "eth_sendTransaction",
      params: [{
        from: request.from,
        to: request.to,
        data: request.data,
        value: request.value || "0x0",
        gas: request.gas,
      }],
    }) as string;

    return txHash;
  } catch (error: unknown) {
    if ((error as { code?: number }).code === 4001) {
      throw new Error("Transaction rejected by user.");
    }
    throw error;
  }
}

// ── Sign Message ──
export async function signMessage(message: string, from: string): Promise<string> {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask is not installed.");
  }

  try {
    const signature = await window.ethereum!.request({
      method: "personal_sign",
      params: [message, from],
    }) as string;

    return signature;
  } catch (error: unknown) {
    if ((error as { code?: number }).code === 4001) {
      throw new Error("Signature rejected by user.");
    }
    throw error;
  }
}

// ── Get Transaction Receipt ──
export async function getTransactionReceipt(txHash: string): Promise<unknown> {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask is not installed.");
  }

  const receipt = await window.ethereum!.request({
    method: "eth_getTransactionReceipt",
    params: [txHash],
  });

  return receipt;
}

// ── Watch for Account/Chain Changes ──
export function onAccountsChanged(callback: (accounts: string[]) => void): () => void {
  if (!isMetaMaskInstalled()) return () => {};
  
  const handler = (accounts: unknown) => callback(accounts as string[]);
  window.ethereum!.on("accountsChanged", handler);
  return () => window.ethereum!.removeListener("accountsChanged", handler);
}

export function onChainChanged(callback: (chainId: string) => void): () => void {
  if (!isMetaMaskInstalled()) return () => {};
  
  const handler = (chainId: unknown) => callback(chainId as string);
  window.ethereum!.on("chainChanged", handler);
  return () => window.ethereum!.removeListener("chainChanged", handler);
}

// ── Helper Functions ──
function getNetworkFromChainId(chainId: string): GenLayerNetwork | null {
  const chainIdLower = chainId.toLowerCase();
  
  // Check Bradbury first (primary testnet)
  if (chainIdLower === GENLAYER_CHAINS.testnetBradbury.chainId.toLowerCase()) {
    return "testnetBradbury";
  }
  // Check Studionet
  if (chainIdLower === GENLAYER_CHAINS.studionet.chainId.toLowerCase()) {
    return "studionet";
  }
  
  return null;
}

function formatBalance(balanceHex: string): string {
  const balanceWei = BigInt(balanceHex);
  const balanceEth = Number(balanceWei) / 1e18;
  return balanceEth.toFixed(4);
}

// ── Transaction History (Local Storage) ──
export function getTransactionHistory(): TransactionReceipt[] {
  try {
    const stored = localStorage.getItem("genlayer_tx_history");
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return [];
}

export function addTransactionToHistory(tx: TransactionReceipt): void {
  const history = getTransactionHistory();
  history.unshift(tx);
  if (history.length > 100) history.pop();
  localStorage.setItem("genlayer_tx_history", JSON.stringify(history));
}

export function clearTransactionHistory(): void {
  localStorage.removeItem("genlayer_tx_history");
}

// ── Disconnect (clear local state) ──
export function disconnectWallet(): void {
  localStorage.removeItem("genlayer_connected");
  localStorage.removeItem("x_profile");
}

// ── Type declarations for window.ethereum ──
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, handler: (data: unknown) => void) => void;
      removeListener: (event: string, handler: (data: unknown) => void) => void;
    };
  }
}
