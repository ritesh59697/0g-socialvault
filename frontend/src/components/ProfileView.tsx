import { useState, useMemo, useEffect } from 'react';
import MediaPreview from '@/components/MediaPreview';
import ProfileAvatar from '@/components/ProfileAvatar';
import PostCard from '@/components/PostCard';
import { formatEther } from 'viem';
import { 
  User, 
  MapPin, 
  Calendar, 
  FileText, 
  Coins, 
  Users, 
  Settings, 
  Info, 
  BarChart3, 
  History, 
  Sparkles,
  Camera,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const ZERO_G_LOGO = "https://pbs.twimg.com/profile_images/2038084529374867456/Oq74BA_I_400x400.jpg";

function timeAgo(timestamp: number | string | undefined): string {
  if (!timestamp || timestamp === 'just now') return 'Just now';
  
  const now = Date.now();
  let past: number;
  
  if (typeof timestamp === 'number') {
    past = timestamp;
  } else {
    const d = new Date(timestamp);
    if (isNaN(d.getTime())) return 'Just now';
    past = d.getTime();
  }

  const diffInSeconds = Math.floor((now - past) / 1000);
  if (diffInSeconds < 0) return 'Just now'; // Handle future clocks slightly

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return new Date(past).toLocaleDateString();
}

export default function ProfileView({
  address, isConnected, posts, onConnect, isOwnProfile = true, connectedAddress,
  onLike, onTip, isTipping, tipAmounts, setTipAmounts, likedPosts, isWrongNetwork
}: {
  address?: string;
  isConnected: boolean;
  posts: any[];
  onConnect: () => void;
  isOwnProfile?: boolean;
  connectedAddress?: string;
  onLike?: (id: bigint) => void;
  onTip?: (id: bigint) => void;
  isTipping?: boolean;
  tipAmounts?: Record<string, string>;
  setTipAmounts?: (a: Record<string, string>) => void;
  likedPosts?: Set<string>;
  isWrongNetwork?: boolean;
}) {
  const [activeSubTab, setActiveSubTab] = useState<'posts' | 'earnings' | 'info'>('posts');

  const [bio, setBio] = useState('');
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [tempBio, setTempBio] = useState('');
  const [tempUsername, setTempUsername] = useState('');
  const [tempAvatarUrl, setTempAvatarUrl] = useState('');
  const [followers, setFollowers] = useState<string[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [tips, setTips] = useState<any[]>([]);

  // 0G Persistence
  useEffect(() => {
    const loadProfile = async () => {
      if (!address) return;
      const addr = address.toLowerCase();

      // 1. Try localStorage first (fast cache)
      setBio(localStorage.getItem(`sv_bio_${addr}`) || '');
      setUsername(localStorage.getItem(`sv_name_${addr}`) || '');
      setAvatarUrl(localStorage.getItem(`sv_avatar_${addr}`) || '');

      // 2. Fetch from 0G for truth
      try {
        const { readContract } = await import('@wagmi/core');
        const { config } = await import('@/lib/wagmi');
        const { SOCIALVAULT_ABI, SOCIALVAULT_ADDRESS } = await import('@/lib/contract');
        const { downloadFromZeroG } = await import('@/lib/storage');

        const hash = await readContract(config, {
          address: SOCIALVAULT_ADDRESS,
          abi: SOCIALVAULT_ABI,
          functionName: 'profileHashes',
          args: [address as `0x${string}`],
        }) as string;

        if (hash && hash.length > 10) {
          const blob = await downloadFromZeroG(hash);
          const data = JSON.parse(await blob.text());
          if (data.username) {
            setUsername(data.username);
            localStorage.setItem(`sv_name_${addr}`, data.username);
          }
          if (data.bio) {
            setBio(data.bio);
            localStorage.setItem(`sv_bio_${addr}`, data.bio);
          }
          if (data.avatarUrl) {
            setAvatarUrl(data.avatarUrl);
            localStorage.setItem(`sv_avatar_${addr}`, data.avatarUrl);
          }
          window.dispatchEvent(new Event('sv_profile_updated'));
        }
      } catch (e) {
        console.warn('On-chain profile load failed:', e);
      }
    };

    loadProfile();

    if (address) {
      const addr = address.toLowerCase();
      const savedFollowers = localStorage.getItem(`sv_followers_${addr}`);
      if (savedFollowers) setFollowers(JSON.parse(savedFollowers));
      const savedTips = localStorage.getItem(`sv_tips_${addr}`);
      if (savedTips) {
        let parsed = JSON.parse(savedTips);
        const realTips = parsed.filter((t: any) => t.id !== 1 && t.id !== 2 && t.id !== 3);
        setTips(realTips);
      }
    }

    if (connectedAddress) {
      const savedFollowing = localStorage.getItem(`sv_following_${connectedAddress.toLowerCase()}`);
      if (savedFollowing) setFollowing(JSON.parse(savedFollowing));
    }
  }, [address, connectedAddress]);

  const saveProfile = async () => {
    if (!address || !isOwnProfile) return;
    setIsSaving(true);
    try {
      const { uploadToZeroG } = await import('@/lib/storage');
      const { writeContract, waitForTransactionReceipt } = await import('@wagmi/core');
      const { config } = await import('@/lib/wagmi');
      const { SOCIALVAULT_ABI, SOCIALVAULT_ADDRESS } = await import('@/lib/contract');
      const { getConnectorClient } = await import('@wagmi/core');

      // 1. Upload to 0G Storage
      const profileData = {
        username: tempUsername,
        bio: tempBio,
        avatarUrl: tempAvatarUrl,
        updatedAt: new Date().toISOString(),
      };

      const file = new File(
        [JSON.stringify(profileData)],
        `profile_${address.toLowerCase()}.json`,
        { type: 'application/json' }
      );

      const client = await getConnectorClient(config);
      const result = await uploadToZeroG(file, client.transport);

      // 2. Link to Contract
      const hash = await writeContract(config, {
        address: SOCIALVAULT_ADDRESS,
        abi: SOCIALVAULT_ABI,
        functionName: 'updateProfile',
        args: [result.rootHash],
      });

      await waitForTransactionReceipt(config, { hash });

      // 3. Update local state
      setBio(tempBio);
      setUsername(tempUsername);
      setAvatarUrl(tempAvatarUrl);
      
      const addr = address.toLowerCase();
      localStorage.setItem(`sv_bio_${addr}`, tempBio);
      localStorage.setItem(`sv_name_${addr}`, tempUsername);
      localStorage.setItem(`sv_avatar_${addr}`, tempAvatarUrl);
      
      setIsEditing(false);
      window.dispatchEvent(new Event('sv_profile_updated'));
    } catch (e) {
      console.error('Failed to save profile:', e);
      alert('Error saving profile to 0G. Check console for details.');
    } finally {
      setIsSaving(false);
    }
  };

  const startEditing = () => {
    setTempBio(bio);
    setTempUsername(username);
    setTempAvatarUrl(avatarUrl);
    setIsEditing(true);
    setActiveSubTab('info');
  };

  const short = (a: string) => `${a.slice(0, 6)}...${a.slice(-4)}`;
  const isFollowing = following.includes(address.toLowerCase());

  const stats = [
    { label: 'Total Posts', value: profilePosts.length.toString(), color: 'var(--accent)', icon: FileText },
    { label: 'Total Tips', value: `${formatEther(totalEarnings).slice(0, 6)} 0G`, color: 'var(--success)', icon: Coins },
    { label: 'Followers', value: followers.length.toString(), color: 'var(--accent2)', icon: Users },
  ];

  const OGLogo = ({ size = 16, glow = true }: { size?: number, glow?: boolean }) => (
    <div style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: size, height: size, borderRadius: '50%',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))',
      padding: size * 0.1,
      boxShadow: glow ? `0 0 ${size / 2}px rgba(167, 139, 250, 0.3)` : 'none',
      border: '1px solid rgba(255,255,255,0.25)',
      marginRight: 6, flexShrink: 0,
      position: 'relative', top: -1,
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 3s infinite linear',
        zIndex: 1
      }} />
      <img src={ZERO_G_LOGO} alt="0G" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', position: 'relative', zIndex: 0 }} />
    </div>
  );

  return (
    <div className="fade-up tab-panel">
      {/* Header Section */}
      <div className="glass-panel" style={{
        padding: 32, marginBottom: 24, position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: -50, right: -50, width: 200, height: 200,
          background: 'var(--accent-glow)', filter: 'blur(80px)', borderRadius: '50%', opacity: 0.3, zIndex: 0
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 32 }}>
            <div style={{ position: 'relative' }}>
              <ProfileAvatar address={address} size={84} />
              <div style={{
                position: 'absolute', bottom: 4, right: 4, width: 20, height: 20,
                background: 'var(--success)', borderRadius: '50%', border: '4px solid var(--bg-primary)'
              }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', margin: 0 }}>
                      {username || (isOwnProfile ? 'Your Profile' : short(address))}
                    </h2>
                    {isOwnProfile && (
                      <span style={{
                        fontSize: 11, padding: '4px 12px', borderRadius: 20,
                        background: 'var(--accent-glow)', color: 'var(--accent)', fontWeight: 800,
                        textTransform: 'uppercase', letterSpacing: 1.2
                      }}>Owner</span>
                    )}
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: 4, letterSpacing: 0.5, fontWeight: 500 }}>
                    {address}
                  </div>
                </div>

                {!isOwnProfile && isConnected && (
                  <button
                    onClick={isFollowing ? handleUnfollow : handleFollow}
                    className={isFollowing ? 'secondary-btn' : 'primary-btn'}
                    style={{ padding: '10px 28px', borderRadius: 24, fontSize: 14, fontWeight: 700 }}
                  >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </button>
                )}
                {isOwnProfile && (
                  <button
                    onClick={startEditing}
                    className="secondary-btn"
                    style={{ padding: '10px 20px', borderRadius: 24, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <Settings size={16} /> Edit Profile
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 14 }}>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
                  <MapPin size={14} style={{ color: 'var(--accent)' }} /> 0G Mainnet
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
                  <Calendar size={14} style={{ color: 'var(--accent2)' }} /> Joined May 2026
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontWeight: 800, color: 'var(--text)' }}>{followers.length}</span> <span style={{ fontWeight: 500 }}>Followers</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontWeight: 800, color: 'var(--text)' }}>{isOwnProfile ? following.length : '—'}</span> <span style={{ fontWeight: 500 }}>Following</span>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            {stats.map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="glass-panel" style={{
                  padding: '20px 24px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', boxShadow: 'none'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <Icon size={16} style={{ color: 'var(--text-faint)' }} />
                    <div style={{ fontSize: 11, color: 'var(--text-faint)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</div>
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: s.color, display: 'flex', alignItems: 'center' }}>
                    {s.label === 'Total Tips' && <OGLogo size={22} />}
                    {s.value}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs / Dashboard Navigation */}
      <div style={{
        display: 'flex', gap: 8, marginBottom: 28, padding: 6,
        background: 'var(--bg-secondary)', borderRadius: 16, border: '1px solid var(--border)',
        width: 'fit-content'
      }}>
        {[
          { key: 'posts', label: 'History', icon: History },
          { key: 'earnings', label: 'Dashboard', icon: BarChart3 },
          { key: 'info', label: 'Info', icon: Info },
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setActiveSubTab(t.key as any)}
              style={{
                padding: '10px 24px', borderRadius: 12, border: 'none',
                background: activeSubTab === t.key ? 'var(--bg-primary)' : 'transparent',
                color: activeSubTab === t.key ? 'var(--text)' : 'var(--text-muted)',
                fontSize: 14, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 10,
                boxShadow: activeSubTab === t.key ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              <Icon size={16} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      {activeSubTab === 'posts' && (
        <div className="fade-up">
          {profilePosts.length === 0 ? (
            <div className="glass-panel" style={{ padding: '80px 24px', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                <Sparkles size={48} style={{ color: 'var(--text-faint)' }} />
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: 16, fontWeight: 500 }}>No posts found for this user.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {profilePosts.map((post: any) => (
                <PostCard
                  key={post.id.toString()}
                  post={post}
                  isConnected={isConnected}
                  isWrongNetwork={!!isWrongNetwork}
                  liked={likedPosts?.has(post.id.toString()) || false}
                  tipAmount={tipAmounts?.[post.id.toString()] || '0.01'}
                  isTipping={!!isTipping}
                  onLike={() => onLike?.(post.id)}
                  onTip={() => onTip?.(post.id)}
                  isOwner={connectedAddress?.toLowerCase() === post.author.toLowerCase()}
                  onTipAmountChange={(v) => {
                    if (setTipAmounts && tipAmounts) {
                      setTipAmounts({ ...tipAmounts, [post.id.toString()]: v });
                    }
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'earnings' && (
        <div className="fade-up">
          <div className="glass-panel" style={{ padding: 32, border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 28, display: 'flex', alignItems: 'center', gap: 10 }}>
              <BarChart3 size={20} className="text-gradient" /> Revenue Overview
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 40 }}>
              <div style={{ padding: 28, borderRadius: 24, background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(6,182,212,0.1))', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Total Tips Received</div>
                <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <OGLogo size={36} /> {formatEther(totalEarnings).slice(0, 8)} <span style={{ fontSize: 16, opacity: 0.7, fontWeight: 700 }}>0G</span>
                </div>
                {totalEarnings > BigInt(0) && (
                  <div style={{ fontSize: 12, color: 'var(--success)', marginTop: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircle2 size={14} /> ↑ 100% since start
                  </div>
                )}
              </div>
              <div style={{ padding: 28, borderRadius: 24, background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Available for Withdrawal</div>
                <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <OGLogo size={36} /> {formatEther(totalEarnings).slice(0, 8)} <span style={{ fontSize: 16, opacity: 0.7, fontWeight: 700 }}>0G</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 12, fontWeight: 600 }}>Standard 0G Mainnet settlement</div>
              </div>
            </div>

            <h4 style={{ fontSize: 15, fontWeight: 800, marginBottom: 20, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <History size={16} /> Recent Tipping History
            </h4>
            <div style={{ border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', background: 'var(--bg-secondary)' }}>
              {tips.length === 0 ? (
                <div style={{ padding: 64, textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                    <Coins size={32} style={{ color: 'var(--text-faint)' }} />
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>No tips received yet.</p>
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: 'rgba(0,0,0,0.03)', borderBottom: '1px solid var(--border)' }}>
                      <th style={{ textAlign: 'left', padding: '16px 20px', fontWeight: 800, color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>Sender</th>
                      <th style={{ textAlign: 'left', padding: '16px 20px', fontWeight: 800, color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>Amount</th>
                      <th style={{ textAlign: 'left', padding: '16px 20px', fontWeight: 800, color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>Time</th>
                      <th style={{ textAlign: 'right', padding: '16px 20px', fontWeight: 800, color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tips.map(tip => (
                      <tr key={tip.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '16px 20px', fontWeight: 700, color: 'var(--accent)' }}>{tip.from}</td>
                        <td style={{ padding: '16px 20px', fontWeight: 800, color: 'var(--text)' }}>{tip.amount} 0G</td>
                        <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: 500 }}>{timeAgo(tip.timestamp || tip.time)}</td>
                        <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                          <span style={{ fontSize: 11, padding: '4px 12px', background: 'rgba(16,185,129,0.1)', color: 'var(--success)', borderRadius: 20, fontWeight: 800 }}>COMPLETED</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'info' && (
        <div className="fade-up">
          <div className="glass-panel" style={{ padding: 32, border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 28, display: 'flex', alignItems: 'center', gap: 10 }}>
              <User size={20} className="text-gradient" /> Profile Details
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {isEditing ? (
                <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 28, background: 'rgba(139,92,246,0.03)', borderRadius: 24, border: '1px solid var(--accent-glow)' }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--accent)', marginBottom: 4 }}>Identity Settings</div>

                  <div>
                    <label style={{ fontSize: 11, color: 'var(--text-faint)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 10, display: 'block', letterSpacing: 1 }}>Display Name</label>
                    <input
                      type="text"
                      value={tempUsername}
                      onChange={e => setTempUsername(e.target.value)}
                      placeholder="What should we call you?"
                      style={{
                        width: '100%', padding: '14px 20px', background: 'var(--surface)',
                        border: '1px solid var(--border)', borderRadius: 14, color: 'var(--text)',
                        fontSize: 14, outline: 'none', fontWeight: 600
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 11, color: 'var(--text-faint)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 10, display: 'block', letterSpacing: 1 }}>Profile Media</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                      <label className="secondary-btn" style={{ 
                        display: 'inline-flex', alignItems: 'center', gap: 10, padding: '12px 24px', borderRadius: 24, cursor: 'pointer',
                        fontSize: 13, fontWeight: 700, border: '1px dashed var(--border)', background: 'rgba(255,255,255,0.03)'
                      }}>
                        <Camera size={18} /> Choose Photo
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setTempAvatarUrl(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          style={{ display: 'none' }} 
                        />
                      </label>
                      {tempAvatarUrl && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <img src={tempAvatarUrl} alt="Preview" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent)' }} />
                          <button onClick={() => setTempAvatarUrl('')} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>Remove</button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: 11, color: 'var(--text-faint)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 10, display: 'block', letterSpacing: 1 }}>Personal Bio</label>
                    <textarea
                      value={tempBio}
                      onChange={e => setTempBio(e.target.value)}
                      placeholder="Share your story with the 0G community..."
                      style={{
                        width: '100%', minHeight: 140, padding: 20, background: 'var(--surface)',
                        border: '1px solid var(--border)', borderRadius: 14, color: 'var(--text)',
                        fontSize: 14, outline: 'none', resize: 'vertical', lineHeight: 1.6, fontWeight: 500
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                    <button 
                      onClick={saveProfile} 
                      disabled={isSaving}
                      className="primary-btn" 
                      style={{ padding: '12px 32px', borderRadius: 24, fontSize: 14, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                      {isSaving ? (
                        <>
                          <div className="pulse-dot" style={{ width: 8, height: 8, background: 'white', borderRadius: '50%' }} />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                    <button onClick={() => setIsEditing(false)} disabled={isSaving} className="secondary-btn" style={{ padding: '12px 32px', borderRadius: 24, fontSize: 14, fontWeight: 800 }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-faint)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 10, letterSpacing: 1 }}>Wallet Identity</div>
                    <div style={{
                      padding: '16px 20px', background: 'var(--bg-secondary)', borderRadius: 14,
                      fontFamily: 'monospace', fontSize: 14, color: 'var(--text)', border: '1px solid var(--border)',
                      wordBreak: 'break-all', fontWeight: 600
                    }}>
                      {address}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-faint)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 10, letterSpacing: 1 }}>About the Creator</div>
                    <div style={{
                      padding: '28px', background: 'var(--bg-secondary)', borderRadius: 14,
                      fontSize: 15, color: bio ? 'var(--text)' : 'var(--text-muted)', border: '1px solid var(--border)',
                      fontStyle: bio ? 'normal' : 'italic', lineHeight: 1.7, fontWeight: 500
                    }}>
                      {bio || "This creator is keeping it mysterious for now."}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <div className="glass-panel" style={{ padding: 20, background: 'var(--bg-secondary)', boxShadow: 'none' }}>
                      <div style={{ fontSize: 11, color: 'var(--text-faint)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 8, letterSpacing: 1 }}>Connected Network</div>
                      <div style={{ fontSize: 15, color: 'var(--text)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)' }} /> 0G Mainnet (16661)
                      </div>
                    </div>
                    <div className="glass-panel" style={{ padding: 20, background: 'var(--bg-secondary)', boxShadow: 'none' }}>
                      <div style={{ fontSize: 11, color: 'var(--text-faint)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 8, letterSpacing: 1 }}>Verification Status</div>
                      <div style={{ fontSize: 15, color: 'var(--success)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <CheckCircle2 size={16} /> Verified 0G Native
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
