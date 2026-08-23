export const SOCIALVAULT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export const MOCKUSDC_ADDRESS =
  process.env.NEXT_PUBLIC_MOCKUSDC_ADDRESS as `0x${string}`;

export const AGENTNFT_ADDRESS =
  process.env.NEXT_PUBLIC_AGENTNFT_ADDRESS as `0x${string}`;

export const SOCIALVAULT_ABI = [
  {
    name: 'PostCreated', type: 'event', anonymous: false,
    inputs: [
      { name: 'id', type: 'uint256', indexed: true },
      { name: 'author', type: 'address', indexed: true },
      { name: 'storageRootHash', type: 'string', indexed: false },
      { name: 'mediaType', type: 'uint8', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false },
    ],
  },
  {
    name: 'createPost', type: 'function', stateMutability: 'nonpayable',
    inputs: [
      { name: 'storageRootHash', type: 'string' },
      { name: 'metadataRootHash', type: 'string' },
      { name: 'mediaType', type: 'uint8' },
      { name: 'royaltyBps', type: 'uint16' },
    ],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'likePost', type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: 'postId', type: 'uint256' }],
    outputs: [],
  },
  {
    name: 'tipPost', type: 'function', stateMutability: 'payable',
    inputs: [{ name: 'postId', type: 'uint256' }],
    outputs: [],
  },
  {
    name: 'tipPostUSDC', type: 'function', stateMutability: 'nonpayable',
    inputs: [
      { name: 'postId', type: 'uint256' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    name: 'getFeed', type: 'function', stateMutability: 'view',
    inputs: [
      { name: 'page', type: 'uint256' },
      { name: 'pageSize', type: 'uint256' },
    ],
    outputs: [
      { name: 'result', type: 'tuple[]', components: [
        { name: 'id', type: 'uint256' },
        { name: 'author', type: 'address' },
        { name: 'storageRootHash', type: 'string' },
        { name: 'metadataRootHash', type: 'string' },
        { name: 'mediaType', type: 'uint8' },
        { name: 'timestamp', type: 'uint256' },
        { name: 'likeCount', type: 'uint256' },
        { name: 'tipTotal', type: 'uint256' },
        { name: 'royaltyBps', type: 'uint16' },
        { name: 'tipUSDCTotal', type: 'uint256' },
      ]},
      { name: 'total', type: 'uint256' },
    ],
  },
  {
    name: 'postCount', type: 'function', stateMutability: 'view',
    inputs: [], outputs: [{ type: 'uint256' }],
  },
  {
    name: 'profileHashes', type: 'function', stateMutability: 'view',
    inputs: [{ name: '', type: 'address' }],
    outputs: [{ name: '', type: 'string' }],
  },
  {
    name: 'updateProfile', type: 'function', stateMutability: 'nonpayable',
    inputs: [{ name: 'profileHash', type: 'string' }],
    outputs: [],
  },
  {
    name: 'ProfileUpdated', type: 'event', anonymous: false,
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'profileHash', type: 'string', indexed: false },
    ],
  },
  {
    name: 'liked', type: 'function', stateMutability: 'view',
    inputs: [
      { name: '', type: 'uint256' },
      { name: '', type: 'address' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const;

export const MOCKUSDC_ABI = [
  {
    name: 'balanceOf', type: 'function', stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'approve', type: 'function', stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    name: 'allowance', type: 'function', stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'mint', type: 'function', stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [],
  },
] as const;

export const AGENTNFT_ABI = [
  {
    name: 'balanceOf', type: 'function', stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'ownerOf', type: 'function', stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ type: 'address' }],
  },
  {
    name: 'tokenURI', type: 'function', stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ type: 'string' }],
  },
  {
    name: 'mintIntelligentNFT', type: 'function', stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'tokenURI', type: 'string' },
      { name: 'dataDescription', type: 'string' },
      { name: 'dataHash', type: 'bytes32' },
    ],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'updateIntelligentData', type: 'function', stateMutability: 'nonpayable',
    inputs: [
      { name: 'tokenId', type: 'uint256' },
      { name: 'dataDescription', type: 'string' },
      { name: 'dataHash', type: 'bytes32' },
    ],
    outputs: [],
  },
  {
    name: 'intelligentDataOf', type: 'function', stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [
      { name: 'dataDescription', type: 'string' },
      { name: 'dataHash', type: 'bytes32' },
    ],
  },
  {
    name: 'userAgenticId', type: 'function', stateMutability: 'view',
    inputs: [{ name: '', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'hasAgenticId', type: 'function', stateMutability: 'view',
    inputs: [{ name: '', type: 'address' }],
    outputs: [{ type: 'bool' }],
  },
] as const;
