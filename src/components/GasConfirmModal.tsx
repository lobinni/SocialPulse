import { useState, useEffect } from "react";
import { Shield, Zap, X, Loader2, CheckCircle2, AlertTriangle, Fuel, DollarSign } from "lucide-react";
import { 
  estimateGas, 
  estimateGasWei,
  getConnectedAccount, 
  signAction,
  GENLAYER_CHAINS,
  type MetaMaskAccount,
} from "../services/genlayer";

interface GasConfirmModalProps {
  isOpen: boolean;
  action: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}

type ModalState = "confirm" | "signing" | "processing" | "success" | "error";

// GEN price estimate (for display purposes)
const GEN_PRICE_USD = 0.15; // Example price

export default function GasConfirmModal({ isOpen, action, description, onConfirm, onCancel }: GasConfirmModalProps) {
  const [state, setState] = useState<ModalState>("confirm");
  const [txHash, setTxHash] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [account, setAccount] = useState<MetaMaskAccount | null>(null);

  useEffect(() => {
    if (isOpen) {
      setState("confirm");
      setTxHash("");
      setErrorMessage("");
      getConnectedAccount().then(setAccount);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const gasDisplay = estimateGas(action);
  const gasWei = estimateGasWei(action);
  const gasGEN = Number(gasWei) / 1e18;
  const gasUSD = (gasGEN * GEN_PRICE_USD).toFixed(4);
  const chainConfig = account?.network ? GENLAYER_CHAINS[account.network] : GENLAYER_CHAINS.testnetBradbury;

  const handleConfirm = async () => {
    if (!account) {
      setErrorMessage("Please connect your wallet first");
      setState("error");
      return;
    }

    if (!account.network) {
      setErrorMessage("Please switch to GenLayer network");
      setState("error");
      return;
    }

    setState("signing");

    try {
      const result = await signAction(action, description);
      
      if (result.success) {
        setTxHash(result.signature || "");
        setState("success");

        setTimeout(() => {
          setState("confirm");
          setTxHash("");
          onConfirm();
        }, 1500);
      } else {
        setErrorMessage(result.error || "Transaction failed");
        setState("error");
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Transaction failed");
      setState("error");
    }
  };

  const handleCancel = () => {
    setState("confirm");
    setTxHash("");
    setErrorMessage("");
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={state === "confirm" ? handleCancel : undefined} />
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-dark-900 p-6 shadow-2xl shadow-brand-500/10 animate-fade-in">
        {/* Header */}
        {state === "confirm" && (
          <button onClick={handleCancel} className="absolute right-4 top-4 text-dark-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        )}

        {/* Confirm State */}
        {state === "confirm" && (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600/20 text-brand-400">
                <Shield size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-white">Confirm Transaction</h3>
                <p className="text-xs text-dark-400">{chainConfig.chainName}</p>
              </div>
            </div>

            <div className="rounded-lg border border-white/5 bg-dark-800/50 p-4 mb-4">
              <p className="text-sm text-dark-200 mb-3">{description}</p>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-dark-500">Action</span>
                  <span className="text-dark-200 font-mono">{action}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-dark-500">Network</span>
                  <span className="text-dark-200">{chainConfig.chainName}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-dark-500">From</span>
                  <span className="text-dark-200 font-mono text-[10px]">
                    {account ? `${account.address.slice(0, 8)}...${account.address.slice(-6)}` : "Not connected"}
                  </span>
                </div>
                {account && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-dark-500">Balance</span>
                    <span className="text-dark-200">{account.balance} GEN</span>
                  </div>
                )}
              </div>
            </div>

            {/* Gas Fee Box - More Prominent */}
            <div className="rounded-lg border-2 border-amber-500/30 bg-amber-500/5 p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Fuel size={16} className="text-amber-400" />
                <span className="text-sm font-semibold text-amber-400">Estimated Gas Fee</span>
              </div>
              
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">{gasDisplay}</p>
                  <p className="text-xs text-dark-400 mt-0.5">{gasGEN.toFixed(6)} GEN</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-dark-400">
                    <DollarSign size={12} />
                    <span className="text-sm">≈ ${gasUSD} USD</span>
                  </div>
                  <p className="text-[10px] text-dark-500 mt-0.5">@ $0.15/GEN</p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-amber-500/20">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-dark-500">Gas Limit</span>
                  <span className="text-dark-300 font-mono">21,000</span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-dark-500">Gas Price</span>
                  <span className="text-dark-300 font-mono">{(Number(gasWei) / 21000 / 1e9).toFixed(2)} Gwei</span>
                </div>
              </div>
            </div>

            {!account && (
              <div className="flex items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/5 p-3 mb-4 text-xs text-rose-400">
                <AlertTriangle size={14} />
                <span>Connect your MetaMask wallet first</span>
              </div>
            )}

            {account && !account.network && (
              <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 mb-4 text-xs text-amber-400">
                <AlertTriangle size={14} />
                <span>Please switch to GenLayer Bradbury Testnet</span>
              </div>
            )}

            {account && account.network && parseFloat(account.balance) < gasGEN && (
              <div className="flex items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/5 p-3 mb-4 text-xs text-rose-400">
                <AlertTriangle size={14} />
                <span>Insufficient GEN balance. Get tokens from faucet.</span>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={handleCancel} className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm font-medium text-dark-300 transition-colors hover:bg-white/5">
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={!account || !account.network}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-brand-600 py-2.5 text-sm font-medium text-white transition-all hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-brand-600/20"
              >
                <Zap size={14} />
                Sign & Pay {gasDisplay}
              </button>
            </div>
          </>
        )}

        {/* Signing State */}
        {state === "signing" && (
          <div className="flex flex-col items-center py-8">
            <div className="relative mb-4">
              <div className="h-16 w-16 rounded-full border-2 border-brand-500/30 flex items-center justify-center">
                <span className="text-3xl">🦊</span>
              </div>
              <Loader2 size={20} className="absolute -right-1 -bottom-1 text-brand-400 animate-spin" />
            </div>
            <h3 className="text-white font-semibold mb-1">Waiting for Signature</h3>
            <p className="text-xs text-dark-400">Please confirm in MetaMask...</p>
            <div className="mt-4 rounded-lg bg-dark-800/50 px-4 py-2">
              <p className="text-xs text-amber-400">
                <Fuel size={12} className="inline mr-1" />
                Gas: {gasDisplay}
              </p>
            </div>
          </div>
        )}

        {/* Processing State */}
        {state === "processing" && (
          <div className="flex flex-col items-center py-8">
            <Loader2 size={40} className="text-brand-400 animate-spin mb-4" />
            <h3 className="text-white font-semibold mb-1">Processing on GenLayer</h3>
            <p className="text-xs text-dark-400">Validators are executing and verifying...</p>
            <div className="mt-4 flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-dark-500">Consensus in progress</span>
            </div>
          </div>
        )}

        {/* Success State */}
        {state === "success" && (
          <div className="flex flex-col items-center py-8">
            <CheckCircle2 size={40} className="text-emerald-400 mb-4" />
            <h3 className="text-white font-semibold mb-1">Transaction Confirmed!</h3>
            <p className="text-xs text-dark-400 mb-3">Successfully verified on GenLayer</p>
            <div className="rounded-lg bg-dark-800/50 px-4 py-2 mb-2">
              <p className="text-xs text-emerald-400">
                <Fuel size={12} className="inline mr-1" />
                Gas Used: {gasDisplay}
              </p>
            </div>
            {txHash && (
              <div className="rounded-lg bg-dark-800/50 px-3 py-1.5 text-[10px] font-mono text-dark-400">
                {txHash.slice(0, 18)}...{txHash.slice(-8)}
              </div>
            )}
          </div>
        )}

        {/* Error State */}
        {state === "error" && (
          <div className="flex flex-col items-center py-8">
            <AlertTriangle size={40} className="text-rose-400 mb-4" />
            <h3 className="text-white font-semibold mb-1">Transaction Failed</h3>
            <p className="text-xs text-dark-400 mb-4 text-center px-4">{errorMessage}</p>
            <button onClick={handleCancel} className="rounded-lg border border-white/10 px-6 py-2 text-sm text-dark-300 hover:bg-white/5">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
