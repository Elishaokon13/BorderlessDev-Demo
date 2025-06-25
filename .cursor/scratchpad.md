# POAP on Base - Workshop Project

## Background and Motivation
Building a POAP (Proof of Attendance Protocol) application on Base using Base Minikit. This app will allow users to mint POAPs as proof of attending events/workshops. The POAP will be implemented as a Soulbound Token (SBT) with a limit of 1 per address, ensuring each attendee can only have one non-transferable token. The project needs to be completed within a 3-hour workshop timeframe, focusing on core functionality while leveraging Base Minikit's built-in features.

## POAP Details
### Visual Elements
- Circular blue badge design
- Text elements:
  - "BASE BATCHES 001" (top arc)
  - "HOMEBASE WORKSHOPS" (center)
  - "Workshop Attendee" (bottom arc)
- Base house logo in center
- Blue and white color scheme

### Metadata Structure (Stored On-chain)
```solidity
struct WorkshopMetadata {
    string workshopName;    // "BUILD ON BASE CHALLENGE"
    uint256 startDate;     // Workshop start timestamp
    uint256 endDate;       // Workshop end timestamp
    string badgeType;      // "Workshop Attendee"
    string series;         // "HOMEBASE WORKSHOPS"
}
```

## Key Challenges and Analysis
1. Time constraint (3 hours) - Need to focus on core functionality
2. Integration with Base network and Base Minikit
3. Smart contract development and deployment on Base
4. Implementation of SBT functionality (non-transferable tokens)
5. On-chain metadata storage optimization
6. User-friendly frontend interface with Base Minikit components
7. Proper setup of Base Minikit and environment configuration

## Technical Stack
1. Base Minikit for core functionality
2. Next.js for frontend framework
3. Tailwind CSS for styling
4. Solidity for smart contract (ERC721 with SBT modifications)
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
     - Metadata struct implementation
     - Access control for minting
   - Contract Requirements:
     - Override transfer functions to prevent transfers
     - Mapping to track minted addresses
     - Check for existing tokens before minting
     - Store workshop metadata on-chain
     - Emit events for minting and attempts
   - Metadata Storage:
     - Implement WorkshopMetadata struct
     - Store metadata at token minting
     - Getter functions for metadata retrieval

### Frontend Development (60 mins)
1. Create basic UI components using Base Minikit
   - Success Criteria:
     - Working connect wallet button using MiniKitProvider
     - Simple minting interface with workshop details display
     - Clear feedback for already-minted addresses
     - Visual representation of the POAP badge
   - Components needed:
     - MiniKitProvider setup
     - Wallet connection component
     - POAP minting button
     - Transaction status display
     - Already-minted status display
     - Workshop metadata display
     - POAP badge preview component
   - UI Elements:
     - Circular badge display matching provided design
     - Blue and white color scheme
     - Clear typography for workshop details

### Integration & Testing (45 mins)
1. Connect frontend with smart contract
   - Success Criteria:
     - Successful test mint on Base testnet
     - Error handling for already-minted addresses
     - Transaction feedback for users
     - Verification of non-transferability
     - Correct metadata display
   - Features:
     - Contract interaction through Base Minikit
     - Transaction status updates
     - Error message display
     - Minting status check
     - Metadata retrieval and display

## Project Status Board
- [ ] Project initialization with Base Minikit
- [ ] Smart contract development with SBT functionality
- [ ] Frontend setup with MiniKit components
- [ ] Contract deployment to Base testnet
- [ ] Frontend-contract integration
- [ ] Testing and verification of SBT constraints
- [ ] Metadata storage and retrieval implementation
- [ ] UI implementation with badge design

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
- SBT Implementation:
  - Override transfer functions in ERC721
  - Implement one-per-address restriction
  - Add clear error messages for transfer attempts
- Metadata Storage:
  - On-chain storage for workshop details
  - Structured data format for consistency
  - Getter functions for frontend access 