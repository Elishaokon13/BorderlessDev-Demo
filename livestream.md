# 🎥 LIVE STREAM PLAN: Build a POAP on Base Challenge

## 🎯 Stream Objective
Build a complete POAP (Proof of Attendance Protocol) application on Base using Base Minikit that works in Farcaster frames. Attendees can mint non-transferable workshop badges as Soulbound Tokens.

## ⏰ Estimated Time: 3 Hours
- **Setup & Smart Contract**: 45 minutes
- **Frontend Development**: 90 minutes  
- **Deployment & Testing**: 45 minutes

---

## 📋 Pre-Stream Checklist
- [ ] MetaMask installed with Base Testnet configured
- [ ] Farcaster account ready
- [ ] Node.js installed
- [ ] Code editor ready
- [ ] Remix IDE bookmarked
- [ ] Vercel account ready

---

## 🚀 PHASE 1: PROJECT SETUP (15 mins)

### Step 1: Initialize Base Minikit Project
```bash
npx create-onchain --mini
cd your-project-name
npm install
```

### Step 2: Install Additional Dependencies
```bash
npm install canvas-confetti
npm install --save-dev @types/canvas-confetti @types/node
```

### Step 3: Environment Setup
Create `.env` file with:
```env
NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME="BUILD ON BASE CHALLENGE"
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your-api-key-here
```

**🎬 Stream Talking Points:**
- Explain what Base Minikit is and why it's perfect for Farcaster frames
- Show the project structure created
- Discuss the importance of environment variables

---

## ⛓️ PHASE 2: SMART CONTRACT DEVELOPMENT (30 mins)

### Step 1: Create POAP Contract in Remix
Open [Remix IDE](https://remix.ethereum.org) and create `WorkshopPOAP.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WorkshopPOAP is ERC721, Ownable {
    struct WorkshopMetadata {
        string name;
        uint256 startDate;
        uint256 endDate;
    }
    
    WorkshopMetadata public workshop;
    mapping(address => bool) public hasMinted;
    uint256 private _tokenIdCounter;
    
    constructor(
        string memory _name,
        uint256 _startDate,
        uint256 _endDate
    ) ERC721("Workshop POAP", "WPOAP") Ownable(msg.sender) {
        workshop = WorkshopMetadata(_name, _startDate, _endDate);
    }
    
    function mint() external {
        require(!hasMinted[msg.sender], "Already minted");
        
        uint256 tokenId = _tokenIdCounter++;
        hasMinted[msg.sender] = true;
        
        _mint(msg.sender, tokenId);
    }
    
    function getWorkshopDetails() external view returns (string memory, uint256, uint256) {
        return (workshop.name, workshop.startDate, workshop.endDate);
    }
    
    // Override transfer functions to make it Soulbound
    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);
        require(from == address(0), "Soulbound: Transfer not allowed");
        return super._update(to, tokenId, auth);
    }
    
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        
        return string(abi.encodePacked(
            'data:application/json;base64,',
            Base64.encode(bytes(abi.encodePacked(
                '{"name":"', workshop.name, '",',
                '"description":"POAP for workshop attendance",',
                '"image":"data:image/svg+xml;base64,', _generateSVG(), '"}'
            )))
        ));
    }
    
    function _generateSVG() private pure returns (string memory) {
        return Base64.encode(bytes(
            '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">'
            '<circle cx="200" cy="200" r="180" fill="#0052FF"/>'
            '<text x="200" y="180" text-anchor="middle" fill="white" font-size="24" font-family="Arial">BUILD ON</text>'
            '<text x="200" y="220" text-anchor="middle" fill="white" font-size="24" font-family="Arial">BASE</text>'
            '</svg>'
        ));
    }
}

library Base64 {
    string internal constant TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    
    function encode(bytes memory data) internal pure returns (string memory) {
        if (data.length == 0) return "";
        
        string memory table = TABLE;
        uint256 encodedLen = 4 * ((data.length + 2) / 3);
        string memory result = new string(encodedLen + 32);
        
        assembly {
            let tablePtr := add(table, 1)
            let resultPtr := add(result, 32)
            
            for {
                let i := 0
            } lt(i, mload(data)) {
                i := add(i, 3)
            } {
                let input := and(mload(add(data, i)), 0xffffff)
                
                let out := mload(add(tablePtr, and(shr(18, input), 0x3F)))
                out := shl(8, out)
                out := add(out, and(mload(add(tablePtr, and(shr(12, input), 0x3F))), 0xFF))
                out := shl(8, out)
                out := add(out, and(mload(add(tablePtr, and(shr(6, input), 0x3F))), 0xFF))
                out := shl(8, out)
                out := add(out, and(mload(add(tablePtr, and(input, 0x3F))), 0xFF))
                out := shl(224, out)
                
                mstore(resultPtr, out)
                
                resultPtr := add(resultPtr, 4)
            }
            
            switch mod(mload(data), 3)
            case 1 {
                mstore(sub(resultPtr, 2), shl(240, 0x3d3d))
            }
            case 2 {
                mstore(sub(resultPtr, 1), shl(248, 0x3d))
            }
            
            mstore(result, encodedLen)
        }
        
        return result;
    }
}
```

### Step 2: Deploy Contract
1. Compile in Remix
2. Connect MetaMask to Base Testnet
3. Deploy with parameters:
   - Name: "BUILD ON BASE CHALLENGE - BORDERLESS WORKSHOPS"
   - Start Date: 1718553600 (June 16, 2025)
   - End Date: 1719331200 (June 25, 2025)
4. Save contract address

**🎬 Stream Talking Points:**
- Explain Soulbound Tokens and why they're perfect for POAPs
- Show the one-per-address restriction
- Discuss on-chain metadata vs IPFS
- Demonstrate the SVG generation for the badge

---

## 🎨 PHASE 3: FRONTEND DEVELOPMENT (90 mins)

### Step 1: Update Environment Variables (5 mins)
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=your-deployed-contract-address
```

### Step 2: Create Main Page Component (45 mins)
Replace `app/page.tsx`:

```typescript
'use client';

import React, { useEffect, useState } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import confetti from 'canvas-confetti';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

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

export default function Home() {
  const { setFrameReady, isFrameReady } = useMiniKit();
  const { address } = useAccount();
  const [hasMinted, setHasMinted] = useState<boolean>(false);
  const [testMode, setTestMode] = useState<boolean>(false);

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
  });

  const { writeContract: mint, isPending: isMinting, isSuccess: mintSuccess } = useWriteContract();

  useEffect(() => {
    if (!isFrameReady) setFrameReady();
  }, [isFrameReady, setFrameReady]);

  useEffect(() => {
    if (mintStatus !== undefined) {
      setHasMinted(Boolean(mintStatus));
    }
  }, [mintStatus]);

  // Confetti celebration
  useEffect(() => {
    if (mintSuccess) {
      const colors = ['#0052FF', '#00D4FF', '#FFFFFF', '#FFD700'];
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: colors
      });
    }
  }, [mintSuccess]);

  const handleMint = async () => {
    if (testMode && !address) {
      alert('🧪 Test Mode: In a real Farcaster frame, this would mint your POAP!');
      return;
    }
    
    mint({
      address: CONTRACT_ADDRESS!,
      abi: contractABI,
      functionName: 'mint',
    });
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

        {/* Workshop Details */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Workshop Details</h3>
          {workshopDetails ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Event:</span>
                <span className="text-gray-800">{workshopDetails[0]}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Start Date:</span>
                <span className="text-gray-800">
                  {new Date(Number(workshopDetails[1]) * 1000).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">End Date:</span>
                <span className="text-gray-800">
                  {new Date(Number(workshopDetails[2]) * 1000).toLocaleDateString()}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-gray-500">Loading workshop details...</div>
          )}
        </div>

        {/* Mint Section */}
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

            {!testMode && (!isFrameReady || !address) ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-center space-y-3">
                  <div className="text-blue-800">
                    💡 This app is designed for Farcaster frames
                  </div>
                  <button
                    onClick={() => setTestMode(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                  >
                    🧪 Enable Test Mode
                  </button>
                </div>
              </div>
            ) : hasMinted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-green-800 font-medium">
                  ✅ You have already claimed your POAP!
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={handleMint}
                  disabled={isMinting}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-colors ${
                    isMinting
                      ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                      : 'bg-[#0052FF] hover:bg-blue-700 text-white shadow-lg'
                  }`}
                >
                  {isMinting ? 'Minting POAP...' : '🎉 Mint POAP'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="text-center text-white/70 text-sm">
          Powered by Base Minikit
        </div>
      </div>
    </main>
  );
}
```

### Step 3: Test Local Development (15 mins)
```bash
npm run dev
```
- Test the UI components
- Verify test mode functionality
- Check responsive design

### Step 4: Add Celebration Animation (15 mins)
Enhance the confetti effect with multiple bursts and colors.

### Step 5: Error Handling & Polish (10 mins)
- Add loading states
- Improve error messages
- Test edge cases

**🎬 Stream Talking Points:**
- Explain wagmi hooks and React patterns
- Show the difference between test mode and real frame mode
- Demonstrate responsive design principles
- Discuss user experience considerations

---

## 🚀 PHASE 4: FARCASTER INTEGRATION (30 mins)

### Step 1: Generate Farcaster Manifest (5 mins)
```bash
npx create-onchain --manifest
```

### Step 2: Configure Environment (10 mins)
Update `.env` with generated values:
```env
NEXT_PUBLIC_URL=https://your-app.vercel.app
FARCASTER_HEADER=generated-header
FARCASTER_PAYLOAD=generated-payload  
FARCASTER_SIGNATURE=generated-signature
NEXT_PUBLIC_APP_DESCRIPTION="Mint your POAP for attending the BUILD ON BASE CHALLENGE"
NEXT_PUBLIC_APP_SUBTITLE="BORDERLESS WORKSHOPS"
```

### Step 3: Deploy to Vercel (15 mins)
```bash
npx vercel
```
- Follow deployment prompts
- Configure environment variables in Vercel dashboard
- Test deployment

**🎬 Stream Talking Points:**
- Explain Farcaster frame manifest system
- Show the account association process
- Demonstrate deployment workflow

---

## 🧪 PHASE 5: TESTING & DEMONSTRATION (15 mins)

### Step 1: Test Frame Endpoints
- Verify `/.well-known/farcaster.json` endpoint
- Check frame metadata
- Test webhook functionality

### Step 2: Live Demo
- Cast the frame in Farcaster
- Demonstrate wallet connection
- Show POAP minting process
- Verify Soulbound properties

### Step 3: Troubleshooting Common Issues
- Environment variable problems
- Network configuration
- Contract interaction errors

**🎬 Stream Talking Points:**
- Show real-world usage in Farcaster
- Explain the difference between test and production
- Discuss potential improvements

---

## 🎯 SUCCESS CRITERIA

By the end of the stream, viewers should have:
- [ ] ✅ Working POAP smart contract on Base Testnet
- [ ] ✅ Functional Farcaster frame application
- [ ] ✅ Live deployment on Vercel
- [ ] ✅ Successfully minted test POAP
- [ ] ✅ Understanding of Base Minikit integration

---

## 🔧 TROUBLESHOOTING GUIDE

### Common Issues & Solutions

**Smart Contract Deployment Fails:**
- Check MetaMask network (Base Testnet)
- Ensure sufficient ETH for gas
- Verify constructor parameters

**Frontend Not Connecting:**
- Check environment variables
- Verify contract address format
- Ensure ABI matches deployed contract

**Farcaster Frame Not Working:**
- Verify manifest endpoint accessibility
- Check environment variable formatting
- Ensure proper CORS configuration

**Vercel Deployment Issues:**
- Check build logs for errors
- Verify all dependencies installed
- Ensure environment variables set

---

## 📚 ADDITIONAL RESOURCES

- [Base Documentation](https://docs.base.org/)
- [Base Minikit Guide](https://docs.base.org/builderkits/minikit)
- [Farcaster Frames Spec](https://docs.farcaster.xyz/reference/frames/spec)
- [OnchainKit Documentation](https://onchainkit.xyz/)
- [Wagmi Documentation](https://wagmi.sh/)

---

## 🎬 STREAM ENGAGEMENT IDEAS

- **Interactive Polls:** Let viewers vote on design choices
- **Q&A Segments:** Pause for questions during each phase
- **Code Reviews:** Ask viewers to spot potential improvements
- **Challenge Variations:** Discuss how to extend the POAP system
- **Community Building:** Encourage viewers to deploy their own versions

---

## 📝 POST-STREAM DELIVERABLES

- [ ] Complete source code repository
- [ ] Deployed working application
- [ ] Documentation and README
- [ ] Tutorial blog post/video
- [ ] Community Discord/Telegram for follow-up

---

*This plan is designed to be flexible - adjust timing based on audience engagement and technical complexity during the live stream!* 