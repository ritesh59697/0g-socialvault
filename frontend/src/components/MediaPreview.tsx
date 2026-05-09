'use client';
import { useEffect, useMemo, useState } from 'react';
import { downloadFromZeroG, downloadPostMetadata, type PostMetadata } from '@/lib/storage';

const IMAGE = 1;
const VIDEO = 2;

function mimeFor(mediaType: number, metadata: PostMetadata | null) {
  if (metadata?.fileType) return metadata.fileType;
  if (mediaType === IMAGE) return 'image/*';
  if (mediaType === VIDEO) return 'video/*';
  return 'application/octet-stream';
}

export default function MediaPreview({
  mediaRootHash,
  metadataRootHash,
  mediaType,
  compact = false,
}: {
  mediaRootHash: string;
  metadataRootHash?: string;
  mediaType: number;
  compact?: boolean;
}) {
  const [metadata, setMetadata] = useState<PostMetadata | null>(null);
  const [mediaUrl, setMediaUrl] = useState('');
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState('');

  const isRenderable = mediaType === IMAGE || mediaType === VIDEO;
  const shortHash = useMemo(() => `${mediaRootHash.slice(0, 18)}...${mediaRootHash.slice(-8)}`, [mediaRootHash]);

  useEffect(() => {
    let cancelled = false;
    let objectUrl = '';

    async function loadMedia() {
      if (!isRenderable) return;

      setStatus('loading');
      setError('');

      try {
        // Fetch metadata and media in parallel to cut latency in half
        const [nextMetadata, rawBlob] = await Promise.all([
          metadataRootHash 
            ? downloadPostMetadata(metadataRootHash).catch(() => null) 
            : Promise.resolve(null),
          downloadFromZeroG(mediaRootHash)
        ]);

        if (cancelled) return;
        setMetadata(nextMetadata);

        const typedBlob = rawBlob.type
          ? rawBlob
          : new Blob([rawBlob], { type: mimeFor(mediaType, nextMetadata) });
        
        objectUrl = URL.createObjectURL(typedBlob);
        setMediaUrl(objectUrl);
        setStatus('ready');
      } catch (e) {
        if (cancelled) return;
        setStatus('error');
        setError(e instanceof Error ? e.message : 'Could not load media from 0G Storage.');
      }
    }

    loadMedia();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [isRenderable, mediaRootHash, mediaType, metadataRootHash]);

  if (!isRenderable) return null;

  return (
    <div style={{ marginTop: compact ? 12 : 16 }}>
      {metadata?.caption && (
        <p style={{ fontSize: compact ? 14 : 15, lineHeight: 1.6, color: 'var(--text)', marginBottom: 12 }}>
          {metadata.caption}
        </p>
      )}

      {status === 'loading' && (
        <div className="glass-panel" style={{ padding: compact ? 24 : 48, textAlign: 'center', boxShadow: 'none', background: 'var(--bg-secondary)', border: '1px dashed var(--border)' }}>
          <div className="main-spinner" style={{ marginBottom: 20 }} />
          <div style={{ color: 'var(--text)', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Buffering from 0G Storage...</div>
          <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Retrieving decentralized blocks</div>
        </div>
      )}

      {status === 'error' && (
        <div style={{ padding: '12px 14px', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-md)', background: 'rgba(239,68,68,0.08)' }}>
          <div style={{ color: 'var(--error)', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Media could not be loaded</div>
          <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{error}</div>
          <div style={{ color: 'var(--text-faint)', fontSize: 12, fontFamily: 'monospace', marginTop: 8 }}>{shortHash}</div>
        </div>
      )}

      {status === 'ready' && mediaType === IMAGE && (
        <img src={mediaUrl} alt={metadata?.caption || metadata?.fileName || '0G stored media'} style={{
          maxWidth: '100%',
          width: 'auto',
          height: 'auto',
          maxHeight: compact ? 400 : 600,
          display: 'block',
          margin: '0 auto',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
        }} />
      )}

      {status === 'ready' && mediaType === VIDEO && (
        <video src={mediaUrl} controls style={{
          maxWidth: '100%',
          width: 'auto',
          height: 'auto',
          maxHeight: compact ? 400 : 600,
          display: 'block',
          margin: '0 auto',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          background: '#000',
        }} />
      )}
    </div>
  );
}
