'use client';
import React from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { useEffect, useState } from 'react';
import { useAccount, useContractRead, useContractWrite, useTransaction } from 'wagmi';
import { parseAbi } from 'viem';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

interface WorkshopDetails {
  name: string;
  startDate: bigint;
  endDate: bigint;
}

const contractABI = parseAbi([
  'function mint() external',
  'function hasMinted(address) external view returns (bool)',
  'function getWorkshopDetails() external view returns (tuple(string name, uint256 startDate, uint256 endDate))',
]) as const;

export default function Home() {
  const { setFrameReady, isFrameReady } = useMiniKit();
  const { address, isConnected } = useAccount();
  const [hasMinted, setHasMinted] = useState<boolean>(false);

  const { data: mintStatus } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'hasMinted',
    args: [address as `0x${string}`],
    enabled: isConnected && !!address,
  });

  const { data: workshopDetails } = useContractRead<typeof contractABI, 'getWorkshopDetails', WorkshopDetails>({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'getWorkshopDetails',
    enabled: true,
  });

  const { write: mint, data: mintData } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'mint',
  });

  const { isLoading: isMinting, isSuccess: mintSuccess } = useTransaction({
    hash: mintData?.hash,
  });

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [isFrameReady, setFrameReady]);

  useEffect(() => {
    if (mintStatus !== undefined) {
      setHasMinted(mintStatus);
    }
  }, [mintStatus]);

  const handleMint = async () => {
    try {
      mint();
    } catch (error) {
      console.error('Error minting:', error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-[#0052FF]">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center text-white mb-8">
          BASE BATCHES 001
        </h1>
        <h2 className="text-2xl text-center text-white mb-12">
          HOMEBASE WORKSHOPS
        </h2>

        <div className="bg-white rounded-lg p-8 mb-8">
          <h3 className="text-xl font-semibold mb-4">Workshop Details</h3>
          {workshopDetails && (
            <div className="space-y-2">
              <p>Name: {workshopDetails.name}</p>
              <p>Start Date: {new Date(Number(workshopDetails.startDate) * 1000).toLocaleDateString()}</p>
              <p>End Date: {new Date(Number(workshopDetails.endDate) * 1000).toLocaleDateString()}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-center space-y-4">
          {!isConnected ? (
            <w3m-button />
          ) : hasMinted ? (
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-md">
              You have already minted your POAP!
            </div>
          ) : (
            <button
              onClick={handleMint}
              disabled={isMinting}
              className={`px-6 py-3 rounded-lg text-white font-semibold ${
                isMinting
                  ? 'bg-gray-500'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isMinting ? 'Minting...' : 'Mint POAP'}
            </button>
          )}

          {mintSuccess && (
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-md">
              Successfully minted your POAP!
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-4 left-0 w-full text-center text-white text-sm">
        Powered by Base Minikit
      </div>
    </main>
  );
} 