// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract SocialVault is ReentrancyGuard {
    using SafeERC20 for IERC20;

    enum MediaType { TEXT, IMAGE, VIDEO }

    struct Post {
        uint256 id;
        address author;
        string  storageRootHash;
        string  metadataRootHash;
        MediaType mediaType;
        uint256 timestamp;
        uint256 likeCount;
        uint256 tipTotal;
        uint16  royaltyBps;
        uint256 tipUSDCTotal;
    }

    uint256 public postCount;
    address public treasury;
    address public usdcToken;
    uint256 public constant PLATFORM_FEE_BPS = 200;

    mapping(uint256 => Post) public posts;
    mapping(uint256 => mapping(address => bool)) public liked;
    mapping(address => uint256[]) public userPostIds;
    mapping(address => string) public profileHashes;

    event PostCreated(uint256 indexed id, address indexed author,
        string storageRootHash, uint8 mediaType, uint256 timestamp);
    event PostLiked(uint256 indexed postId, address indexed liker);
    event TipSent(uint256 indexed postId, address indexed tipper,
        address indexed creator, uint256 amount);
    event TipUSDCSent(uint256 indexed postId, address indexed tipper,
        address indexed creator, uint256 amount);
    event ProfileUpdated(address indexed user, string profileHash);

    constructor(address _usdcToken) {
        treasury = msg.sender;
        usdcToken = _usdcToken;
    }

    function createPost(
        string calldata storageRootHash,
        string calldata metadataRootHash,
        MediaType mediaType,
        uint16 royaltyBps
    ) external returns (uint256) {
        require(bytes(storageRootHash).length > 0, "Empty root hash");
        require(royaltyBps <= 5000, "Max 50% royalty");

        uint256 id = ++postCount;
        posts[id] = Post(id, msg.sender, storageRootHash,
            metadataRootHash, mediaType, block.timestamp, 0, 0, royaltyBps, 0);
        userPostIds[msg.sender].push(id);

        emit PostCreated(id, msg.sender, storageRootHash,
            uint8(mediaType), block.timestamp);
        return id;
    }

    function likePost(uint256 postId) external {
        require(posts[postId].id != 0, "Post not found");
        require(!liked[postId][msg.sender], "Already liked");
        liked[postId][msg.sender] = true;
        posts[postId].likeCount++;
        emit PostLiked(postId, msg.sender);
    }

    function tipPost(uint256 postId) external payable nonReentrant {
        Post storage p = posts[postId];
        require(p.id != 0, "Post not found");
        require(msg.value > 0, "Send 0G tokens");
        require(msg.sender != p.author, "Can't tip yourself");

        uint256 fee = (msg.value * PLATFORM_FEE_BPS) / 10000;
        uint256 creatorAmount = msg.value - fee;

        p.tipTotal += msg.value;
        (bool ok,) = p.author.call{value: creatorAmount}("");
        require(ok, "Transfer failed");
        if (fee > 0) {
            (bool ok2,) = treasury.call{value: fee}("");
            require(ok2, "Fee failed");
        }
        emit TipSent(postId, msg.sender, p.author, msg.value);
    }

    function tipPostUSDC(uint256 postId, uint256 amount) external nonReentrant {
        Post storage p = posts[postId];
        require(p.id != 0, "Post not found");
        require(amount > 0, "Send USDC tokens");
        require(msg.sender != p.author, "Can't tip yourself");
        require(usdcToken != address(0), "USDC token not set");

        uint256 fee = (amount * PLATFORM_FEE_BPS) / 10000;
        uint256 creatorAmount = amount - fee;

        p.tipUSDCTotal += amount;
        
        IERC20(usdcToken).safeTransferFrom(msg.sender, p.author, creatorAmount);
        if (fee > 0) {
            IERC20(usdcToken).safeTransferFrom(msg.sender, treasury, fee);
        }

        emit TipUSDCSent(postId, msg.sender, p.author, amount);
    }

    function getFeed(uint256 page, uint256 pageSize)
        external view returns (Post[] memory result, uint256 total)
    {
        total = postCount;
        uint256 from = total > page * pageSize ? total - page * pageSize : 0;
        uint256 to   = from > pageSize ? from - pageSize : 0;
        uint256 len  = from - to;
        result = new Post[](len);
        for (uint256 i = 0; i < len; i++) result[i] = posts[from - i];
    }

    function getPostsByUser(address user)
        external view returns (uint256[] memory)
    {
        return userPostIds[user];
    }

    function updateProfile(string calldata profileHash) external {
        profileHashes[msg.sender] = profileHash;
        emit ProfileUpdated(msg.sender, profileHash);
    }
}