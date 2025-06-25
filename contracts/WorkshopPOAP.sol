// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract WorkshopPOAP is ERC721, Ownable {
    using Strings for uint256;

    uint256 private _tokenIdCounter;
    
    struct WorkshopMetadata {
        string workshopName;    // "BUILD ON BASE CHALLENGE"
        uint256 startDate;     // Workshop start timestamp
        uint256 endDate;       // Workshop end timestamp
        string badgeType;      // "Workshop Attendee"
        string series;         // "BORDERLESS WORKSHOPS"
    }

    // Workshop metadata
    WorkshopMetadata public workshopMetadata;
    
    // Mapping from address to boolean to track if they've minted
    mapping(address => bool) public hasMinted;

    event POAPMinted(address indexed to, uint256 indexed tokenId);
    event MintAttempted(address indexed attempter, bool success, string message);

    constructor(
        string memory name,
        string memory symbol,
        string memory _workshopName,
        uint256 _startDate,
        uint256 _endDate
    ) ERC721(name, symbol) Ownable(msg.sender) {
        workshopMetadata = WorkshopMetadata({
            workshopName: _workshopName,
            startDate: _startDate,
            endDate: _endDate,
            badgeType: "Workshop Attendee",
            series: "BORDERLESS WORKSHOPS"
        });
    }

    function mint() external {
        require(!hasMinted[msg.sender], "You have already minted a POAP");
        require(block.timestamp >= workshopMetadata.startDate, "Workshop has not started yet");
        require(block.timestamp <= workshopMetadata.endDate, "Workshop has ended");

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        _safeMint(msg.sender, tokenId);
        hasMinted[msg.sender] = true;

        emit POAPMinted(msg.sender, tokenId);
        emit MintAttempted(msg.sender, true, "Successfully minted POAP");
    }

    // Override transfer functions to make it soulbound
    function _transfer(address from, address to, uint256 tokenId) internal virtual override {
        revert("POAP tokens are soulbound and cannot be transferred");
    }

    function getWorkshopMetadata() external view returns (WorkshopMetadata memory) {
        return workshopMetadata;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireOwned(tokenId);

        // Return a JSON metadata string
        string memory json = string(abi.encodePacked(
            '{"name": "', workshopMetadata.workshopName, '",',
            '"description": "', workshopMetadata.series, ' - ', workshopMetadata.badgeType, '",',
            '"attributes": [',
            '{"trait_type": "Workshop Name", "value": "', workshopMetadata.workshopName, '"},',
            '{"trait_type": "Badge Type", "value": "', workshopMetadata.badgeType, '"},',
            '{"trait_type": "Series", "value": "', workshopMetadata.series, '"},',
            '{"trait_type": "Start Date", "value": "', uint256(workshopMetadata.startDate).toString(), '"},',
            '{"trait_type": "End Date", "value": "', uint256(workshopMetadata.endDate).toString(), '"}',
            ']}'
        ));

        return string(abi.encodePacked("data:application/json;base64,", Base64Encode(bytes(json))));
    }

    // Simple Base64 encoding function
    function Base64Encode(bytes memory data) internal pure returns (string memory) {
        string memory table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        uint256 length = data.length;
        if (length == 0) return "";

        string memory result = new string(4 * ((length + 2) / 3));
        bytes memory resultBytes = bytes(result);

        uint256 i;
        uint256 j;
        uint256 n = length / 3 * 3;

        // Encode 3 bytes at a time
        for (i = 0; i < n; i += 3) {
            uint256 val = uint256(uint8(data[i])) << 16 | uint256(uint8(data[i + 1])) << 8 | uint256(uint8(data[i + 2]));
            resultBytes[j] = bytes1(bytes(table)[val >> 18]);
            resultBytes[j + 1] = bytes1(bytes(table)[(val >> 12) & 0x3F]);
            resultBytes[j + 2] = bytes1(bytes(table)[(val >> 6) & 0x3F]);
            resultBytes[j + 3] = bytes1(bytes(table)[val & 0x3F]);
            j += 4;
        }

        // Handle remaining bytes
        if (i < length) {
            uint256 val = uint256(uint8(data[i])) << 16;
            if (i + 1 < length) val |= uint256(uint8(data[i + 1])) << 8;
            
            resultBytes[j] = bytes1(bytes(table)[val >> 18]);
            resultBytes[j + 1] = bytes1(bytes(table)[(val >> 12) & 0x3F]);
            
            if (i + 1 < length) {
                resultBytes[j + 2] = bytes1(bytes(table)[(val >> 6) & 0x3F]);
            } else {
                resultBytes[j + 2] = '=';
            }
            resultBytes[j + 3] = '=';
        }

        return result;
    }
} 