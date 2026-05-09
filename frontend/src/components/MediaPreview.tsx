import { useEffect, useMemo, useState, useRef } from 'react';
import { downloadFromZeroG, downloadPostMetadata, type PostMetadata } from '@/lib/storage';
import { Loader2, AlertCircle, FileDigit } from 'lucide-react';

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
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isRenderable = mediaType === IMAGE || mediaType === VIDEO;
  const shortHash = useMemo(() => `${mediaRootHash.slice(0, 18)}...${mediaRootHash.slice(-8)}`, [mediaRootHash]);

  // Lazy loading implementation
  useEffect(() => {
    if (!containerRef.current || !isRenderable) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' } // Start loading 300px before entering viewport
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isRenderable]);

  useEffect(() => {
    let cancelled = false;
    let objectUrl = '';

    async function loadMedia() {
      if (!isRenderable || !isInView) return;

      setStatus('loading');
      setError('');

      try {
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
  }, [isRenderable, isInView, mediaRootHash, mediaType, metadataRootHash]);

  if (!isRenderable) return null;

  return (
    <div ref={containerRef} style={{ marginTop: compact ? 12 : 16, minHeight: 100 }}>
      {metadata?.caption && (
        <p style={{ fontSize: compact ? 14 : 15, lineHeight: 1.6, color: 'var(--text)', marginBottom: 12 }}>
          {metadata.caption}
        </p>
      )}

      {!isInView && (
        <div className="glass-panel" style={{ padding: compact ? 24 : 48, textAlign: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border)', opacity: 0.5 }}>
          <div style={{ color: 'var(--text-faint)', fontSize: 12 }}>Scrolling to load...</div>
        </div>
      )}

      {isInView && status === 'loading' && (
        <div className="glass-panel" style={{ padding: compact ? 24 : 48, textAlign: 'center', boxShadow: 'none', background: 'var(--bg-secondary)', border: '1px dashed var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <Loader2 size={32} className="animate-spin" style={{ color: 'var(--accent)' }} />
          </div>
          <div style={{ color: 'var(--text)', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Buffering from 0G Storage...</div>
          <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Retrieving decentralized blocks</div>
        </div>
      )}

      {isInView && status === 'error' && (
        <div style={{ padding: '16px', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-md)', background: 'rgba(239,68,68,0.08)', display: 'flex', gap: 12 }}>
          <AlertCircle size={20} style={{ color: 'var(--error)', flexShrink: 0 }} />
          <div>
            <div style={{ color: 'var(--error)', fontSize: 13, fontWeight: 700, marginBottom: 2 }}>Media could not be loaded</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 12, lineHeight: 1.4 }}>{error}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-faint)', fontSize: 11, fontFamily: 'monospace', marginTop: 8 }}>
              <FileDigit size={12} /> {shortHash}
            </div>
          </div>
        </div>
      )}

      {isInView && status === 'ready' && mediaType === IMAGE && (
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

      {isInView && status === 'ready' && mediaType === VIDEO && (
        <video src={mediaUrl} controls preload="metadata" playsInline style={{
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
