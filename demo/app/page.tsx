'use client';

import React, { useEffect, useState } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}` | undefined;

if (!CONTRACT_ADDRESS) {
  throw new Error('NEXT_PUBLIC_CONTRACT_ADDRESS is not defined');
}

const contractABI = [
  {
    type: 'function',
    name: 'mint',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
  {
    type: 'function',
    name: 'hasMinted',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    type: 'function',
    name: 'getWorkshopDetails',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: 'name', type: 'string' },
      { name: 'startDate', type: 'uint256' },
      { name: 'endDate', type: 'uint256' },
    ],
  },
] as const;

interface WorkshopDetails {
  0: string; // name
  1: bigint; // startDate
  2: bigint; // endDate
  name: string;
  startDate: bigint;
  endDate: bigint;
}

export default function Home() {
  const { setFrame, isReady: isFrameReady } = useMiniKit();
  const { address, isConnected } = useAccount();
  const [hasMinted, setHasMinted] = useState<boolean>(false);

  const { data: mintStatus } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'hasMinted',
    args: [address],
    enabled: isConnected && !!address,
  });

  const { data: workshopDetails } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'getWorkshopDetails',
    enabled: true,
  }) as { data: WorkshopDetails | undefined };

  const { write: mint, isLoading: isMinting, data: mintData } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'mint',
  });

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady(true);
    }
  }, [isFrameReady, setFrameReady]);

  useEffect(() => {
    if (mintStatus !== undefined) {
      setHasMinted(mintStatus);
    }
  }, [mintStatus]);

  const handleMint = async () => {
    try {
      await mint();
    } catch (error) {
      console.error('Error minting:', error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-blue-600]">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm space-y-8">
        <h1 className="text-4xl font-bold text-center text-white mb-8">
          BASEBALL BATCHES 001
        </h1>
        <h2 className="text-2xl font-semibold text-center text-white mb-12">
          HOMEBATCH WORKSHOPS
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
            // @ts-ignore: Web3Modal button is a custom element
            <w3m-button />
          ) : hasMinted ? (
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-md">
              You have already minted your POAP!
            </div>
          ) : (
            <button
              onClick={handleMint}
              disabled={isMinting}
              aria-label="Mint your POAP"
              className={`px-6 py-3 rounded-lg text-white font-semibold ${
                isMinting ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isMinting ? 'Minting...' : 'Mint POAP'}
            </button>
          )}

          {mintData && (
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