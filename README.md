<div align="center">

<img src="https://img.shields.io/badge/0G-Mainnet-7c3aed?style=for-the-badge&logo=ethereum&logoColor=white" />
<img src="https://img.shields.io/badge/Chain_ID-16661-0891b2?style=for-the-badge" />
<img src="https://img.shields.io/badge/Hackathon-0G_APAC_2026-ec4899?style=for-the-badge" />
<img src="https://img.shields.io/badge/Track-Web_4.0_Open_Innovation-22c55e?style=for-the-badge" />
<img src="https://img.shields.io/badge/License-MIT-f59e0b?style=for-the-badge" />

<br /><br />

```
███████╗ ██████╗  ██████╗██╗ █████╗ ██╗    ██╗   ██╗ █████╗ ██╗   ██╗██╗  ████████╗
██╔════╝██╔═══██╗██╔════╝██║██╔══██╗██║    ██║   ██║██╔══██╗██║   ██║██║  ╚══██╔══╝
███████╗██║   ██║██║     ██║███████║██║    ██║   ██║███████║██║   ██║██║     ██║
╚════██║██║   ██║██║     ██║██╔══██║██║    ╚██╗ ██╔╝██╔══██║██║   ██║██║     ██║
███████║╚██████╔╝╚██████╗██║██║  ██║███████╗╚████╔╝ ██║  ██║╚██████╔╝███████╗██║
╚══════╝ ╚═════╝  ╚═════╝╚═╝╚═╝  ╚═╝╚══════╝ ╚═══╝  ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝
```

### **The Decentralized SocialFi Platform Built on 0G Network**

*Own your content. Monetize your influence. Exist permanently on-chain.*

[**Live Demo**](https://0g-socialvault.vercel.app/) · [**Contract on ChainScan**](https://chainscan.0g.ai/address/0x368ab585E1BF87A734a44044E3F48Dd3a7Ed24eB) · [**Video Demo**](#)

</div>

---

## The Problem

Every social platform you use today owns your content. They can delete it, censor it, sell it, or shut down overnight - taking your digital identity with them. Web2 social media is built on a broken promise of ownership.

**SocialVault changes that.**

---

## What is SocialVault?

SocialVault is a sovereign SocialFi platform where your posts, media, and social graph live permanently on decentralized infrastructure. Built exclusively on the **0G modular stack**, it demonstrates how high-throughput social applications can be built without sacrificing decentralization or user experience.

> *"Not just uploaded — anchored."* Every piece of content you post is cryptographically committed to the 0G network, creating an immutable, permanent record that no single entity controls.

---

## 0G Integration — The Core of Everything

SocialVault is not a generic dApp that happens to use a blockchain. It is purpose-built around the 0G modular stack, using two of its core components in a deeply integrated way.

### 0G Storage — Permanent Media Layer

All heavy media (images, videos, post metadata JSON) is stored on **0G Storage Turbo nodes** — not on IPFS, not on S3, not on any centralized server.

| Detail | Value |
|---|---|
| **Indexer Endpoint** | `https://indexer-storage-turbo.0g.ai` |
| **Upload Method** | `ZgBlob` via `@0gfoundation/0g-ts-sdk` |
| **Retrieval** | `StorageNode.downloadSegmentByTxSeq()` — browser-safe, Merkle-verified |
| **Proof** | Every uploaded file has a verifiable root hash on [storagescan.0g.ai](https://storagescan.0g.ai) |

When a user posts an image, the flow is:
1. File → `ZgBlob` → `Indexer.upload()` → 0G Storage nodes
2. Metadata JSON → second `ZgBlob` → `Indexer.upload()` → 0G Storage nodes
3. Both root hashes → `SocialVault.createPost()` → **0G Chain**

### 0G Chain — Social Graph & Monetization Layer

The **SocialVault smart contract** handles all on-chain social logic — post pointers, engagement tracking, and the creator economy.

| Detail | Value |
|---|---|
| **Network** | 0G Mainnet |
| **Chain ID** | `16661` |
| **RPC** | `https://evmrpc.0g.ai` |
| **Contract Address** | [`0x368ab585E1BF87A734a44044E3F48Dd3a7Ed24eB`](https://chainscan.0g.ai/address/0x368ab585E1BF87A734a44044E3F48Dd3a7Ed24eB) |
| **Explorer** | [chainscan.0g.ai](https://chainscan.0g.ai/address/0x368ab585E1BF87A734a44044E3F48Dd3a7Ed24eB) |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Browser                             │
│                                                             │
│   Next.js 14 Frontend  ──────  wagmi v2 / viem             │
│        │                              │                     │
│        │ file upload                  │ wallet ops          │
│        ▼                              ▼                     │
│   0G Storage SDK               MetaMask / Rabby             │
└────────┬──────────────────────────────┬────────────────────┘
         │                              │
         ▼                              ▼
┌─────────────────┐          ┌──────────────────────┐
│  0G Storage     │          │   0G Chain           │
│  Turbo Nodes    │          │   (ChainID: 16661)   │
│                 │          │                      │
│  Media Files    │◄─────────│  SocialVault.sol     │
│  Metadata JSON  │ rootHash │  - createPost()      │
│                 │          │  - likePost()        │
│  storagescan    │          │  - tipPost()         │
│  .0g.ai         │          │  - getFeed()         │
└─────────────────┘          └──────────────────────┘
```

---

## Features

| Feature | Status | Description |
|---|---|---|
| Wallet Connect | ✅ Live | MetaMask + Rabby, auto-switches to 0G Mainnet |
| Text Posts | ✅ Live | Written to 0G Chain directly |
| Media Upload | ✅ Live | Images/video stored on 0G Storage |
| On-chain Likes | ✅ Live | Permanent like count on 0G Chain |
| Micro-tipping | ✅ Live | Send 0G tokens directly to creators |
| Creator Royalties | ✅ Live | 5% royalty on every tip (configurable) |
| Storage Proof | ✅ Live | Every post links to StorageScan verification |
| Live Feed | ✅ Live | Reads directly from 0G Chain contract |
| Network Guard | ✅ Live | Auto-detects wrong network, prompts switch |
| Profile Page | ✅ Live | Creator dashboard with earnings + post history |

---

## Smart Contract

The `SocialVault.sol` contract is deployed on **0G Mainnet** and handles the complete social graph.

```solidity
// Core functions
function createPost(
    string calldata storageRootHash,  // 0G Storage root hash
    string calldata metadataRootHash, // Metadata JSON root hash
    MediaType mediaType,              // TEXT=0, IMAGE=1, VIDEO=2
    uint16 royaltyBps                 // Basis points (500 = 5%)
) external returns (uint256 postId)

function likePost(uint256 postId) external
function tipPost(uint256 postId) external payable  // Splits royalty auto
function getFeed(uint256 page, uint256 pageSize) external view returns (Post[] memory, uint256 total)
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16, TypeScript, Tailwind CSS |
| **Web3 Client** | wagmi v2, viem |
| **0G Storage** | `@0gfoundation/0g-ts-sdk` |
| **Smart Contract** | Solidity 0.8.24, Hardhat 2.22, OpenZeppelin |
| **Wallet Support** | MetaMask, Rabby, WalletConnect |
| **Deployment** | Vercel (frontend) + 0G Mainnet (contract) |

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/ritesh59697/0g-socialvault.git
cd 0g-socialvault/frontend

# 2. Install
npm install

# 3. Configure environment
cp .env.example .env.local
# Fill in your values (see below)

# 4. Run
npm run dev
```

**`.env.local` variables:**
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x368ab585E1BF87A734a44044E3F48Dd3a7Ed24eB
NEXT_PUBLIC_CHAIN_ID=16661
NEXT_PUBLIC_RPC_URL=https://evmrpc.0g.ai
NEXT_PUBLIC_STORAGE_INDEXER=https://indexer-storage-turbo.0g.ai
```

**Add 0G Mainnet to MetaMask:**
```
Network Name : 0G Mainnet
RPC URL      : https://evmrpc.0g.ai
Chain ID     : 16661
Symbol       : 0G
Explorer     : https://chainscan.0g.ai
```

---

## Contract Deployment

```bash
cd contracts
npm install
npx hardhat compile

# Deploy to 0G Mainnet
./node_modules/.bin/hardhat run scripts/deploy.ts --network zeroGMainnet
```

---

## Roadmap

SocialVault is designed to grow with the 0G ecosystem. Future milestones target the **0G Agentic Economy**:

- **v1.1** — Profile pages with on-chain earnings dashboard
- **v1.2** — AI Content Guardian via 0G Compute Network (real-time moderation)
- **v1.3** — Agentic Social: AI agents with SocialVault profiles, posting autonomously
- **v1.4** — Creator NFT Passes (ERC-1155) with secondary royalties via ERC-2981
- **v2.0** — Smart Memory: 0G persistent storage gives AI agents long-term user context

---

## Proof of 0G Integration

Every claim in this submission is verifiable on-chain:

| Proof | Link |
|---|---|
| Smart Contract | [chainscan.0g.ai/address/0x368ab5...](https://chainscan.0g.ai/address/0x368ab585E1BF87A734a44044E3F48Dd3a7Ed24eB) |
| Live Transactions | [chainscan.0g.ai — PostCreated events](https://chainscan.0g.ai/address/0x368ab585E1BF87A734a44044E3F48Dd3a7Ed24eB#events) |
| Storage Files | [storagescan.0g.ai](https://storagescan.0g.ai) |
| Live App | [socialvault.vercel.app](https://0g-socialvault.vercel.app/) |

---

<div align="center">

Built with ❤️ for the **0G APAC Hackathon 2026** · Track 4: Web 4.0 Open Innovation

</div>