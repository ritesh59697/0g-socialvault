import { useState, useRef } from 'react';
import { formatFileSize } from '@/lib/storage';
import ProfileAvatar from '@/components/ProfileAvatar';
import { 
  ShieldCheck, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  CloudUpload, 
  X, 
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';

export default function CreatePost({
  address, uploading, status, statusType, storageProof,
  onPost, onFileSelect, onRemoveFile, file, preview,
  caption, setCaption, isWrongNetwork,
  aiGuardian, setAiGuardian, aiStatus
}: {
  address: string; uploading: boolean; status: string;
  statusType: 'info' | 'success' | 'error';
  storageProof: { rootHash: string; scanUrl: string } | null;
  onPost: () => void; onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: () => void; file: File | null; preview: string;
  caption: string; setCaption: (v: string) => void; isWrongNetwork: boolean;
  aiGuardian: boolean; setAiGuardian: (v: boolean) => void;
  aiStatus: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const StatusIcon = () => {
    if (statusType === 'success') return <CheckCircle2 size={16} />;
    if (statusType === 'error') return <AlertCircle size={16} />;
    return <Loader2 size={16} className="animate-spin" />;
  };

  return (
    <div className="glass-panel fade-up create-post-card" style={{ padding: 24, marginBottom: 28 }}>
      <div className="create-post-layout" style={{ display: 'flex', gap: 16 }}>
        <ProfileAvatar address={address} size={44} />

        <div style={{ flex: 1 }}>
          <textarea value={caption} onChange={e => setCaption(e.target.value)}
            placeholder="Share your thoughts on the 0G network..."
            disabled={uploading}
            style={{
              width: '100%', minHeight: 80, background: 'var(--bg-secondary)',
              border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
              padding: '12px 16px', color: 'var(--text)', fontSize: 15,
              lineHeight: 1.6, resize: 'none', outline: 'none',
              transition: 'all 0.2s', opacity: uploading ? 0.6 : 1,
            }}
            onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 2px var(--border-focus)'; }}
            onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
          />

          {preview && file && (
            <div style={{ marginTop: 12, position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
              {file.type.startsWith('video/')
                ? <video src={preview} controls style={{ width: '100%', maxHeight: 300, display: 'block', background: '#000' }} />
                : <img src={preview} alt="preview" style={{ width: '100%', maxHeight: 300, objectFit: 'contain', display: 'block', background: 'var(--bg-secondary)' }} />
              }
              <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 8 }}>
                <span className="glass-panel" style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                  {formatFileSize(file.size)}
                </span>
                <button onClick={onRemoveFile} className="glass-panel" style={{
                  width: 28, height: 28, borderRadius: '50%', color: 'var(--error)',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <X size={14} />
                </button>
              </div>
            </div>
          )}

          {storageProof && (
            <div style={{ marginTop: 12, padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', fontSize: 13, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={16} style={{ color: 'var(--success)' }} />
                <div>
                  <span style={{ color: 'var(--success)', fontWeight: 700 }}>Stored on 0G Storage</span>
                  <div style={{ color: 'var(--text-faint)', fontSize: 11, fontFamily: 'monospace', marginTop: 1 }}>
                    Root: {storageProof.rootHash.slice(0, 16)}...
                  </div>
                </div>
              </div>
              <a href={storageProof.scanUrl} target="_blank" rel="noreferrer" style={{ 
                color: 'var(--accent2)', fontWeight: 700, fontSize: 12,
                padding: '4px 10px', borderRadius: 8, background: 'rgba(219,39,119,0.05)'
              }}>View Proof</a>
            </div>
          )}

          {/* AI Guardian Widget */}
          <div style={{
            marginTop: 16, padding: '14px 16px', borderRadius: 'var(--radius-md)',
            background: aiGuardian ? 'rgba(139,92,246,0.05)' : 'var(--bg-secondary)',
            border: `1px solid ${aiGuardian ? 'rgba(139,92,246,0.2)' : 'var(--border)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            transition: 'all 0.3s'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ 
                width: 36, height: 36, borderRadius: 10, 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: aiGuardian ? 'rgba(139,92,246,0.1)' : 'var(--border)',
                color: aiGuardian ? 'var(--accent)' : 'var(--text-faint)'
              }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>AI Content Guardian</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{aiStatus || 'Safety scanning & smart tagging'}</div>
              </div>
            </div>
            <button
              onClick={() => setAiGuardian(!aiGuardian)}
              disabled={uploading}
              style={{
                width: 40, height: 20, borderRadius: 20,
                background: aiGuardian ? 'var(--accent)' : 'var(--text-faint)',
                border: 'none', cursor: 'pointer', position: 'relative',
                transition: 'all 0.2s', padding: 0
              }}
            >
              <div style={{
                width: 14, height: 14, borderRadius: '50%', background: '#fff',
                position: 'absolute', top: 3, left: aiGuardian ? 23 : 3,
                transition: 'all 0.2s'
              }} />
            </button>
          </div>

          <div className="composer-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
            <div className="composer-tools" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <label className="secondary-btn" style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px',
                borderRadius: 24, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                color: file ? 'var(--accent)' : 'var(--text)',
                borderColor: file ? 'var(--accent)' : 'var(--border)'
              }}>
                {file && file.type.startsWith('video/') ? <VideoIcon size={16} /> : <ImageIcon size={16} />}
                {file ? 'Media Attached' : 'Attach Media'}
                <input ref={fileRef} type="file" accept="image/*,video/*" onChange={onFileSelect} style={{ display: 'none' }} disabled={uploading} />
              </label>
              <span style={{ fontSize: 12, color: 'var(--text-faint)', fontWeight: 500 }}>Max 50MB</span>
            </div>

            <button onClick={onPost} disabled={uploading || (!caption && !file)} className="primary-btn" style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 28px', borderRadius: 24, fontSize: 14,
              opacity: (!caption && !file) || uploading ? 0.5 : 1,
              cursor: (!caption && !file) || uploading ? 'not-allowed' : 'pointer'
            }}>
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <CloudUpload size={16} />}
              {uploading ? 'Analyzing...' : 'Post to 0G'}
            </button>
          </div>

          {status && (
            <div style={{
              marginTop: 16, padding: '12px 16px', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 10,
              background: statusType === 'success' ? 'rgba(16,185,129,0.08)' : statusType === 'error' ? 'rgba(239,68,68,0.08)' : 'var(--accent-glow)',
              border: `1px solid ${statusType === 'success' ? 'rgba(16,185,129,0.2)' : statusType === 'error' ? 'rgba(239,68,68,0.2)' : 'var(--border-focus)'}`,
              color: statusType === 'success' ? 'var(--success)' : statusType === 'error' ? 'var(--error)' : 'var(--accent)',
            }}>
              <StatusIcon />
              {status}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
