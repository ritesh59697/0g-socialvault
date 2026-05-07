export const SOCIALVAULT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

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
      ]},
      { name: 'total', type: 'uint256' },
    ],
  },
  {
    name: 'postCount', type: 'function', stateMutability: 'view',
    inputs: [], outputs: [{ type: 'uint256' }],
  },
] as const;
