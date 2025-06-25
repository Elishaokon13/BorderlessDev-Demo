# POAP on Base - Workshop Project

## Background and Motivation
Building a POAP (Proof of Attendance Protocol) application on Base using Base Minikit. This app will allow users to mint POAPs as proof of attending events/workshops. The POAP will be implemented as a Soulbound Token (SBT) with a limit of 1 per address, ensuring each attendee can only have one non-transferable token. The project needs to be completed within a 3-hour workshop timeframe, focusing on core functionality while leveraging Base Minikit's built-in features.

## Workshop Details
- Name: "BASE BATCHES 001 - HOMEBASE WORKSHOPS"
- Type: Workshop Attendee Badge
- Visual: Blue circular badge with Base home icon
- Metadata Storage: On-chain
- Start Date: June 16, 2025 (1718553600) // Unix timestamp
- End Date: June 25, 2025 (1719331200) // Unix timestamp
- Network: Base Testnet

## Key Challenges and Analysis
1. Time constraint (3 hours) - Need to focus on core functionality
2. Integration with Base network and Base Minikit
3. Smart contract development and deployment via Remix
4. Implementation of SBT functionality (non-transferable tokens)
5. User-friendly frontend interface with Base Minikit components
6. Proper setup of Base Minikit and environment configuration

## Technical Stack
1. Base Minikit for core functionality
2. Next.js for frontend framework
3. Tailwind CSS for styling
4. Solidity for smart contract (ERC721 with SBT modifications)
5. OnchainKit for blockchain interactions
6. Remix IDE for smart contract deployment

## High-level Task Breakdown

### Setup Phase (30 mins)
1. Initialize project with Base Minikit
   - Success Criteria: 
     - Project structure created with all necessary dependencies
     - Base Minikit properly configured
     - Environment variables set up
   - Commands:
     ```
     npx create-onchain --mini
     cd your-project-name
     npm install
     ```

### Smart Contract Development (45 mins)
1. Create POAP smart contract as SBT
   - Success Criteria:
     - ERC721 contract modified for SBT functionality
     - One-per-address minting restriction
     - Non-transferable token implementation
     - On-chain metadata storage
     - Events emitted for tracking
   - Key Features:
     - mintPOAP function with address check
     - Disabled transfer functions
     - Struct for workshop metadata:
       ```solidity
       struct WorkshopMetadata {
           string name;    // "BASE BATCHES 001 - HOMEBASE WORKSHOPS"
           uint256 startDate;  // 1718553600
           uint256 endDate;    // 1719331200
       }
       ```
     - Access control for minting
   - Contract Requirements:
     - Override transfer functions to prevent transfers
     - Mapping to track minted addresses
     - Check for existing tokens before minting
     - Store workshop details on-chain
     - Emit events for minting and attempts
   - Deployment Steps:
     1. Open Remix IDE (https://remix.ethereum.org)
     2. Create new contract file
     3. Compile contract
     4. Connect MetaMask to Base Testnet
     5. Deploy using Injected Provider
     6. Save contract address for frontend integration

### Frontend Development (60 mins)
1. Create basic UI components using Base Minikit
   - Success Criteria:
     - Working connect wallet button using MiniKitProvider
     - Simple minting interface with Base branding
     - Clear feedback for already-minted addresses
   - Components needed:
     - MiniKitProvider setup
     - Wallet connection component
     - POAP minting button
     - Transaction status display
     - Already-minted status display
   - Visual Elements:
     - Base blue color scheme (#0052FF)
     - Circular badge design
     - Workshop details display
     - Base home icon integration
   - Contract Integration:
     - Store deployed contract address in environment variables
     - Use contract ABI from Remix deployment

### Integration & Testing (45 mins)
1. Connect frontend with smart contract
   - Success Criteria:
     - Successful test mint on Base testnet
     - Error handling for already-minted addresses
     - Transaction feedback for users
     - Verification of non-transferability
     - Correct display of on-chain metadata
   - Features:
     - Contract interaction through Base Minikit
     - Transaction status updates
     - Error message display
     - Minting status check
     - Metadata retrieval and display
   - Testing Steps:
     1. Test minting with different addresses
     2. Verify one-per-address limitation
     3. Attempt transfer to confirm SBT functionality
     4. Check metadata display accuracy

## Project Status Board
- [ ] Project initialization with Base Minikit
- [ ] Smart contract development with SBT functionality and on-chain metadata
- [ ] Contract deployment via Remix to Base Testnet
- [ ] Frontend setup with Base branding and MiniKit components
- [ ] Frontend-contract integration
- [ ] Testing and verification of SBT constraints

## Current Status / Progress Tracking
Not started - awaiting initial setup

## Executor's Feedback or Assistance Requests
No current requests

## Lessons
- Base Minikit setup requirements:
  - Need CDP Client API key for additional functionalities
  - Farcaster account for testing and deployment
  - Proper environment variable configuration
- Smart contract deployment process on Base:
  - Use Remix IDE for contract deployment
  - Connect MetaMask to Base Testnet
  - Save contract ABI and address for frontend
- SBT Implementation:
  - Override transfer functions in ERC721
  - Implement one-per-address restriction
  - Add clear error messages for transfer attempts
- Visual Implementation:
  - Use Base brand colors (#0052FF)
  - Implement circular badge design
  - Include workshop metadata display 