# POAP on Base - Workshop Project

## Background and Motivation
Building a POAP (Proof of Attendance Protocol) application on Base using Base Minikit. This app will allow users to mint POAPs as proof of attending events/workshops. The project needs to be completed within a 3-hour workshop timeframe, focusing on core functionality while leveraging Base Minikit's built-in features.

## Key Challenges and Analysis
1. Time constraint (3 hours) - Need to focus on core functionality
2. Integration with Base network and Base Minikit
3. Smart contract development and deployment on Base
4. User-friendly frontend interface with Base Minikit components
5. Proper setup of Base Minikit and environment configuration

## Technical Stack
1. Base Minikit for core functionality
2. Next.js for frontend framework
3. Tailwind CSS for styling
4. Solidity for smart contract
5. OnchainKit for blockchain interactions

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
1. Create POAP smart contract
   - Success Criteria:
     - Basic ERC721 contract for POAP tokens
     - Minting functionality with event metadata
     - Events emitted for tracking
   - Key Features:
     - mintPOAP function
     - Event metadata storage
     - Access control for minting

### Frontend Development (60 mins)
1. Create basic UI components using Base Minikit
   - Success Criteria:
     - Working connect wallet button using MiniKitProvider
     - Form to input POAP details
     - Minting interface
   - Components needed:
     - MiniKitProvider setup
     - Wallet connection component
     - POAP minting form
     - Transaction status display

### Integration & Testing (45 mins)
1. Connect frontend with smart contract
   - Success Criteria:
     - Successful test mint on Base testnet
     - Error handling implemented
     - Transaction feedback for users
   - Features:
     - Contract interaction through Base Minikit
     - Transaction status updates
     - Error message display

## Project Status Board
- [ ] Project initialization with Base Minikit
- [ ] Smart contract development
- [ ] Frontend setup with MiniKit components
- [ ] Contract deployment to Base testnet
- [ ] Frontend-contract integration
- [ ] Testing and verification

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
  - Will use Base testnet for development
  - Need to ensure proper network configuration in Base Minikit 