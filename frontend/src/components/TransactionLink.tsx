'use client';
import { useEffect, useState } from 'react';
import { usePublicClient } from 'wagmi';
import { SOCIALVAULT_ABI, SOCIALVAULT_ADDRESS } from '@/lib/contract';
import { ExternalLink } from 'lucide-react';

const shortHash = (hash: string) => `${hash.slice(0, 10)}...${hash.slice(-8)}`;

export default function TransactionLink({
  postId,
  author,
}: {
  postId: bigint;
  author: `0x${string}`;
}) {
  const publicClient = usePublicClient();
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadTxHash() {
      if (!publicClient) return;

      setLoading(true);
      try {
        const logs = await publicClient.getContractEvents({
          address: SOCIALVAULT_ADDRESS,
          abi: SOCIALVAULT_ABI,
          eventName: 'PostCreated',
          args: { id: postId, author },
          fromBlock: BigInt(0),
          toBlock: 'latest',
        });

        if (!cancelled) {
          setTxHash(logs[0]?.transactionHash ?? null);
        }
      } catch {
        if (!cancelled) setTxHash(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadTxHash();

    return () => {
      cancelled = true;
    };
  }, [author, postId, publicClient]);

  if (loading) {
    return (
      <span style={{
        color: 'var(--text-faint)',
        fontSize: 12,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <span className="mini-spinner" />
        Finding transaction...
      </span>
    );
  }

  if (!txHash) {
    return (
      <span style={{ color: 'var(--text-faint)', fontSize: 12 }}>
        Transaction unavailable
      </span>
    );
  }

  return (
    <a
      href={`https://chainscan.0g.ai/tx/${txHash}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: 'var(--text)',
        fontSize: 12,
        fontWeight: 600,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '7px 12px',
        borderRadius: 999,
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
      }}
    >
      <span style={{ color: 'var(--text-faint)', fontWeight: 500 }}>Tx</span>
      <span style={{ fontFamily: 'monospace', fontSize: 11.5 }}>{shortHash(txHash)}</span>
      <ExternalLink size={12} style={{ color: 'var(--accent2)' }} />
    </a>
  );
}
