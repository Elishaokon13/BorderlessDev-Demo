'use client';

import React, { useEffect, useState } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import confetti from 'canvas-confetti';

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
  const { setFrameReady, isFrameReady } = useMiniKit();
  const { address, isConnected } = useAccount();
  const [hasMinted, setHasMinted] = useState<boolean>(false);
  const [justMinted, setJustMinted] = useState<boolean>(false);
  
  // Debug logging
  console.log('Debug - isConnected:', isConnected, 'address:', address, 'isFrameReady:', isFrameReady);

  const { data: mintStatus } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'hasMinted',
    args: address ? [address] : undefined,
    query: { enabled: isFrameReady && !!address },
  });

  const { data: workshopDetails } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'getWorkshopDetails',
  }) as { data: WorkshopDetails | undefined };

  const { writeContract: mint, isPending: isMinting, isSuccess: mintSuccess } = useWriteContract();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [isFrameReady, setFrameReady]);

  useEffect(() => {
    if (mintStatus !== undefined) {
      setHasMinted(Boolean(mintStatus));
    }
  }, [mintStatus]);

  // Trigger confetti when mint is successful
  useEffect(() => {
    if (mintSuccess && !justMinted) {
      setJustMinted(true);
      
      // Create a burst of confetti
      const duration = 3000;
      const end = Date.now() + duration;

      const colors = ['#0052FF', '#00D4FF', '#FFFFFF', '#FFD700', '#FF6B6B'];

      (function frame() {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());

      // Big burst in the center
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: colors
      });

      // Reset after 5 seconds
      setTimeout(() => {
        setJustMinted(false);
      }, 5000);
    }
  }, [mintSuccess, justMinted]);

  const handleMint = async () => {
    try {
      mint({
        address: CONTRACT_ADDRESS!,
        abi: contractABI,
        functionName: 'mint',
      });
    } catch (error) {
      console.error('Error minting:', error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-[#0052FF]">
      <div className="w-full max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">
            BUILD ON BASE CHALLENGE
          </h1>
          <h2 className="text-xl text-white/90">
            BORDERLESS WORKSHOPS
          </h2>
        </div>

        {/* Workshop Details Card */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Workshop Details</h3>
          {workshopDetails ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Event:</span>
                <span className="text-gray-800">{workshopDetails.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Start Date:</span>
                <span className="text-gray-800">
                  {new Date(Number(workshopDetails.startDate) * 1000).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">End Date:</span>
                <span className="text-gray-800">
                  {new Date(Number(workshopDetails.endDate) * 1000).toLocaleDateString()}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Event:</span>
                <span className="text-gray-800">BUILD ON BASE CHALLENGE - BORDERLESS WORKSHOPS</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Start Date:</span>
                <span className="text-gray-800">June 16, 2025</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">End Date:</span>
                <span className="text-gray-800">June 25, 2025</span>
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Loading contract data...
              </div>
            </div>
          )}
        </div>

        {/* Action Section */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="text-center space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Claim Your POAP
              </h3>
              <p className="text-gray-600">
                Proof of Attendance Protocol - One per address, non-transferable
              </p>
            </div>

            {!isFrameReady || !address ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
                  <span className="text-yellow-800">
                    {!isFrameReady ? 'Initializing frame...' : 'Connecting to your Farcaster wallet...'}
                  </span>
                </div>
              </div>
            ) : hasMinted || justMinted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-green-800 font-medium">
                    {justMinted ? '🎉 POAP Minted Successfully! 🎉' : 'You have already claimed your POAP!'}
                  </span>
                </div>
                {justMinted && (
                  <div className="mt-3 text-center">
                    <p className="text-green-700 text-sm animate-pulse">
                      Congratulations! Your POAP is now in your wallet! 🚀
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                  <div>Connected via Farcaster</div>
                  <div className="font-mono">{address?.slice(0, 6)}...{address?.slice(-4)}</div>
                </div>
                <button
                  onClick={handleMint}
                  disabled={isMinting}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-colors ${
                    isMinting
                      ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                      : 'bg-[#0052FF] hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isMinting ? 'Minting POAP...' : '🎉 Mint POAP'}
                </button>
              </div>
            )}

            {isMinting && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-blue-800">Transaction pending...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-white/70 text-sm">
          Powered by Base Minikit
        </div>
      </div>
    </main>
  );
}