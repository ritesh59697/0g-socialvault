// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

struct IntelligentData {
    string dataDescription;
    bytes32 dataHash;
}

contract AgentNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    // Mapping from token ID to IntelligentData
    mapping(uint256 => IntelligentData) private _intelligentData;

    // Address mappings to track dynamic profile integration
    mapping(address => uint256) public userAgenticId;
    mapping(address => bool) public hasAgenticId;

    event IntelligentDataUpdated(uint256 indexed tokenId, string dataDescription, bytes32 dataHash);
    event IntelligentTransfer(address indexed from, address indexed to, uint256 indexed tokenId, bytes32 dataHash);

    constructor() ERC721("0G Agentic ID", "0GAID") Ownable(msg.sender) {}

    function mintIntelligentNFT(
        address to,
        string memory tokenURI,
        string memory dataDescription,
        bytes32 dataHash
    ) external returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        _intelligentData[tokenId] = IntelligentData(dataDescription, dataHash);
        
        // Track the user profile mapping
        userAgenticId[to] = tokenId;
        hasAgenticId[to] = true;

        emit IntelligentDataUpdated(tokenId, dataDescription, dataHash);
        
        return tokenId;
    }

    function updateIntelligentData(
        uint256 tokenId,
        string memory dataDescription,
        bytes32 dataHash
    ) external {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        _intelligentData[tokenId] = IntelligentData(dataDescription, dataHash);
        emit IntelligentDataUpdated(tokenId, dataDescription, dataHash);
    }

    function intelligentDataOf(uint256 tokenId) external view returns (IntelligentData memory) {
        _requireOwned(tokenId);
        return _intelligentData[tokenId];
    }

    // Mock-compliant iTransferFrom to satisfy ERC-7857 concept
    function iTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes calldata /* sealedKey */,
        bytes calldata /* proof */
    ) external {
        require(ownerOf(tokenId) == msg.sender || getApproved(tokenId) == msg.sender || isApprovedForAll(ownerOf(tokenId), msg.sender), "Not authorized");
        
        safeTransferFrom(from, to, tokenId);
        
        // Update user profile mappings
        hasAgenticId[from] = false;
        userAgenticId[to] = tokenId;
        hasAgenticId[to] = true;

        // Emit event showing transfer occurred with secure payload
        emit IntelligentTransfer(from, to, tokenId, _intelligentData[tokenId].dataHash);
    }
}
