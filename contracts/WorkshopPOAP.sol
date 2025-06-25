// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WorkshopPOAP is ERC721, Ownable {
    uint256 private _tokenIdCounter;
    
    struct WorkshopMetadata {
        string name;
        uint256 startDate;
        uint256 endDate;
    }
    
    WorkshopMetadata public workshopDetails;
    mapping(address => bool) public hasMinted;
    
    event POAPMinted(address indexed to, uint256 tokenId);
    event MintAttempted(address indexed attempter, bool success, string message);
    
    constructor() ERC721("BASE BATCHES 001", "POAP") Ownable(msg.sender) {
        workshopDetails = WorkshopMetadata({
            name: "BASE BATCHES 001 - HOMEBASE WORKSHOPS",
            startDate: 1718553600, // June 16, 2025
            endDate: 1719331200    // June 25, 2025
        });
    }
    
    function mint() external {
        require(!hasMinted[msg.sender], "You have already minted a POAP");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        hasMinted[msg.sender] = true;
        _safeMint(msg.sender, tokenId);
        
        emit POAPMinted(msg.sender, tokenId);
        emit MintAttempted(msg.sender, true, "Successfully minted POAP");
    }
    
    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);
        require(from == address(0) || to == address(0), "Token transfer is not allowed");
        return super._update(to, tokenId, auth);
    }
    
    function getWorkshopDetails() external view returns (WorkshopMetadata memory) {
        return workshopDetails;
    }
    
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "ERC721: URI query for nonexistent token");
        
        // Return a JSON metadata string
        return string(
            abi.encodePacked(
                'data:application/json;base64,',
                Base64.encode(
                    bytes(
                        string(
                            abi.encodePacked(
                                '{"name": "BASE BATCHES 001 - Workshop Attendee",',
                                '"description": "Proof of attendance for BASE BATCHES 001 HOMEBASE WORKSHOPS",',
                                '"image": "data:image/svg+xml;base64,',
                                Base64.encode(bytes(generateSVG())),
                                '",',
                                '"attributes": [',
                                '{"trait_type": "Event Name", "value": "',
                                workshopDetails.name,
                                '"},',
                                '{"trait_type": "Start Date", "value": "',
                                uint2str(workshopDetails.startDate),
                                '"},',
                                '{"trait_type": "End Date", "value": "',
                                uint2str(workshopDetails.endDate),
                                '"}',
                                ']}'
                            )
                        )
                    )
                )
            )
        );
    }
    
    function generateSVG() internal pure returns (string memory) {
        return string(
            abi.encodePacked(
                '<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">',
                '<circle cx="200" cy="200" r="190" fill="#0052FF"/>',
                '<text x="200" y="160" text-anchor="middle" fill="white" font-family="Arial" font-size="24">BASE BATCHES 001</text>',
                '<text x="200" y="200" text-anchor="middle" fill="white" font-family="Arial" font-size="20">HOMEBASE WORKSHOPS</text>',
                '<text x="200" y="240" text-anchor="middle" fill="white" font-family="Arial" font-size="16">Workshop Attendee</text>',
                '</svg>'
            )
        );
    }
    
    function uint2str(uint256 _i) internal pure returns (string memory str) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        j = _i;
        while (j != 0) {
            bstr[--k] = bytes1(uint8(48 + j % 10));
            j /= 10;
        }
        str = string(bstr);
    }
}

// Base64 encoding library
library Base64 {
    string internal constant TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    function encode(bytes memory data) internal pure returns (string memory) {
        if (data.length == 0) return "";

        // Load the table into memory
        string memory table = TABLE;

        // Encoding takes 3 bytes chunks of binary data from `bytes` data parameter
        // and split into 4 numbers of 6 bits.
        // The final Base64 length should be `bytes` data length multiplied by 4/3 rounded up
        // - `data.length + 2`  -> Round up
        // - `/ 3`              -> Number of 3-bytes chunks
        // - `4 *`              -> 4 characters for each chunk
        string memory result = new string(4 * ((data.length + 2) / 3));

        assembly {
            // Prepare the lookup table (skip the first "length" byte)
            let tablePtr := add(table, 1)

            // Prepare result pointer, jump over length
            let resultPtr := add(result, 32)

            // Run over the input, 3 bytes at a time
            for {
                let dataPtr := data
                let endPtr := add(data, mload(data))
            } lt(dataPtr, endPtr) {

            } {
                // Advance 3 bytes
                dataPtr := add(dataPtr, 3)
                let input := mload(dataPtr)

                mstore8(resultPtr, mload(add(tablePtr, and(shr(18, input), 0x3F))))
                resultPtr := add(resultPtr, 1)
                mstore8(resultPtr, mload(add(tablePtr, and(shr(12, input), 0x3F))))
                resultPtr := add(resultPtr, 1)
                mstore8(resultPtr, mload(add(tablePtr, and(shr(6, input), 0x3F))))
                resultPtr := add(resultPtr, 1)
                mstore8(resultPtr, mload(add(tablePtr, and(input, 0x3F))))
                resultPtr := add(resultPtr, 1)
            }

            // Handle padding
            switch mod(mload(data), 3)
            case 1 {
                mstore8(sub(resultPtr, 1), 0x3d)
                mstore8(sub(resultPtr, 2), 0x3d)
            }
            case 2 {
                mstore8(sub(resultPtr, 1), 0x3d)
            }
        }

        return result;
    }
} 