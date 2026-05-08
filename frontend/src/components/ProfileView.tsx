import { useState, useMemo, useEffect } from 'react';
import MediaPreview from '@/components/MediaPreview';
import ProfileAvatar from '@/components/ProfileAvatar';
import PostCard from '@/components/PostCard';
import { formatEther } from 'viem';

const ZERO_G_LOGO = "https://pbs.twimg.com/profile_images/2038084529374867456/Oq74BA_I_400x400.jpg";

const OGLogo = ({ size = 20 }: { size?: number }) => (
  <img src={ZERO_G_LOGO} alt="0G" style={{ width: size, height: size, borderRadius: '50%' }} />
);

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
  const [tempBio, setTempBio] = useState('');
  const [tempUsername, setTempUsername] = useState('');
  const [tempAvatarUrl, setTempAvatarUrl] = useState('');
  const [followers, setFollowers] = useState<string[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [tips, setTips] = useState<any[]>([]);

  // Load profile data from localStorage
  useEffect(() => {
    if (address) {
      const addr = address.toLowerCase();
      setBio(localStorage.getItem(`sv_bio_${addr}`) || '');
      setUsername(localStorage.getItem(`sv_name_${addr}`) || '');
      setAvatarUrl(localStorage.getItem(`sv_avatar_${addr}`) || '');

      const savedFollowers = localStorage.getItem(`sv_followers_${addr}`);
      if (savedFollowers) setFollowers(JSON.parse(savedFollowers));

      // Simulated tipping history for demo
      const savedTips = localStorage.getItem(`sv_tips_${addr}`);
      if (savedTips) {
        const parsed = JSON.parse(savedTips);
        // Filter out the legacy mock data (IDs 1, 2, 3)
        const realTips = parsed.filter((t: any) => t.id !== 1 && t.id !== 2 && t.id !== 3);
        setTips(realTips);
        
        // If we found and removed mock data, update storage to keep it clean
        if (realTips.length !== parsed.length) {
          localStorage.setItem(`sv_tips_${addr}`, JSON.stringify(realTips));
        }
      }
    }

    if (connectedAddress) {
      const savedFollowing = localStorage.getItem(`sv_following_${connectedAddress.toLowerCase()}`);
      if (savedFollowing) setFollowing(JSON.parse(savedFollowing));
    }
  }, [address, connectedAddress, isOwnProfile]);

  // Filter posts for this specific profile
  const profilePosts = useMemo(() =>
    address ? posts.filter((p: any) => p.author.toLowerCase() === address.toLowerCase()) : [],
    [posts, address]
  );

  // Calculate total earnings from tips
  const totalEarnings = useMemo(() => {
    return profilePosts.reduce((acc, post) => acc + BigInt(post.tipTotal || 0), BigInt(0));
  }, [profilePosts]);

  if (!isConnected || !address) {
    return (
      <div className="glass-panel fade-up profile-empty" style={{
        padding: '64px 24px', textAlign: 'center',
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>👤</div>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: 16 }}>
          {isOwnProfile ? 'Connect your wallet to view your 0G profile' : 'Connect your wallet to view this 0G profile'}
        </p>
        <button onClick={onConnect} className="primary-btn" style={{
          padding: '12px 28px', borderRadius: 24, fontSize: 15,
        }}>Connect Wallet</button>
      </div>
    );
  }

  const handleFollow = () => {
    if (!connectedAddress || !address) return;
    const newFollowing = [...following, address.toLowerCase()];
    const newFollowers = [...followers, connectedAddress.toLowerCase()];
    setFollowing(newFollowing);
    setFollowers(newFollowers);
    localStorage.setItem(`sv_following_${connectedAddress.toLowerCase()}`, JSON.stringify(newFollowing));
    localStorage.setItem(`sv_followers_${address.toLowerCase()}`, JSON.stringify(newFollowers));
  };

  const handleUnfollow = () => {
    if (!connectedAddress || !address) return;
    const newFollowing = following.filter(a => a !== address.toLowerCase());
    const newFollowers = followers.filter(a => a !== connectedAddress.toLowerCase());
    setFollowing(newFollowing);
    setFollowers(newFollowers);
    localStorage.setItem(`sv_following_${connectedAddress.toLowerCase()}`, JSON.stringify(newFollowing));
    localStorage.setItem(`sv_followers_${address.toLowerCase()}`, JSON.stringify(newFollowers));
  };

  const saveProfile = () => {
    setBio(tempBio);
    setUsername(tempUsername);
    setAvatarUrl(tempAvatarUrl);
    setIsEditing(false);
    const addr = address.toLowerCase();
    localStorage.setItem(`sv_bio_${addr}`, tempBio);
    localStorage.setItem(`sv_name_${addr}`, tempUsername);
    localStorage.setItem(`sv_avatar_${addr}`, tempAvatarUrl);
    window.dispatchEvent(new Event('sv_profile_updated'));
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
    { label: 'Total Posts', value: profilePosts.length.toString(), color: 'var(--accent)', icon: '📝' },
    { label: 'Total Tips', value: `${formatEther(totalEarnings).slice(0, 6)} 0G`, color: 'var(--success)', icon: '💰' },
    { label: 'Followers', value: followers.length.toString(), color: 'var(--accent2)', icon: '👥' },
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
                position: 'absolute', bottom: 4, right: 4, width: 18, height: 18,
                background: 'var(--success)', borderRadius: '50%', border: '3px solid var(--bg-primary)'
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
                        fontSize: 11, padding: '4px 10px', borderRadius: 20,
                        background: 'var(--accent-glow)', color: 'var(--accent)', fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: 1
                      }}>Owner</span>
                    )}
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: 4, letterSpacing: 0.5 }}>
                    {address}
                  </div>
                </div>

                {!isOwnProfile && isConnected && (
                  <button
                    onClick={isFollowing ? handleUnfollow : handleFollow}
                    className={isFollowing ? 'secondary-btn' : 'primary-btn'}
                    style={{ padding: '10px 24px', borderRadius: 24, fontSize: 14 }}
                  >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </button>
                )}
                {isOwnProfile && (
                  <button
                    onClick={startEditing}
                    className="secondary-btn"
                    style={{ padding: '8px 16px', borderRadius: 24, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <span>⚙️</span> Edit Profile
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12 }}>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ opacity: 0.7 }}>📍</span> 0G Mainnet
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ opacity: 0.7 }}>📅</span> Joined May 2026
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontWeight: 700, color: 'var(--text)' }}>{followers.length}</span> Followers
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontWeight: 700, color: 'var(--text)' }}>{isOwnProfile ? following.length : '—'}</span> Following
                </div>
              </div>
            </div>
          </div>

          <div className="profile-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            {stats.map(s => (
              <div key={s.label} className="glass-panel" style={{
                padding: '20px 24px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', boxShadow: 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 16 }}>{s.icon}</span>
                  <div style={{ fontSize: 11, color: 'var(--text-faint)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>{s.label}</div>
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: s.color, display: 'flex', alignItems: 'center' }}>
                  {s.label === 'Total Tips' && <OGLogo size={22} />}
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs / Dashboard Navigation */}
      <div style={{
        display: 'flex', gap: 8, marginBottom: 24, padding: 6,
        background: 'var(--bg-secondary)', borderRadius: 16, border: '1px solid var(--border)',
        width: 'fit-content'
      }}>
        {[
          { key: 'posts', label: 'Post History', icon: '📝' },
          { key: 'earnings', label: 'Creator Dashboard', icon: '📊' },
          { key: 'info', label: 'Profile Info', icon: 'ℹ️' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setActiveSubTab(t.key as any)}
            style={{
              padding: '10px 20px', borderRadius: 12, border: 'none',
              background: activeSubTab === t.key ? 'var(--bg-primary)' : 'transparent',
              color: activeSubTab === t.key ? 'var(--text)' : 'var(--text-muted)',
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              boxShadow: activeSubTab === t.key ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      {activeSubTab === 'posts' && (
        <div className="fade-up">
          {profilePosts.length === 0 ? (
            <div className="glass-panel" style={{ padding: '64px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>✨</div>
              <p style={{ color: 'var(--text-muted)', fontSize: 16 }}>No posts found for this user.</p>
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
                  isTipping={isTipping}
                  onLike={() => onLike?.(post.id)}
                  onTip={() => onTip?.(post.id)}
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
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
              <OGLogo size={20} /> Revenue Overview
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 32 }}>
              <div style={{ padding: 24, borderRadius: 20, background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(6,182,212,0.1))', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>Total Tips Received</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <OGLogo size={32} /> {formatEther(totalEarnings).slice(0, 8)} <span style={{ fontSize: 16, opacity: 0.7 }}>0G</span>
                </div>
                {totalEarnings > BigInt(0) && (
                  <div style={{ fontSize: 12, color: 'var(--success)', marginTop: 8, fontWeight: 600 }}>↑ 100% since start</div>
                )}
              </div>
              <div style={{ padding: 24, borderRadius: 20, background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>Estimated Payout</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <OGLogo size={32} /> {formatEther(totalEarnings).slice(0, 8)} <span style={{ fontSize: 16, opacity: 0.7 }}>0G</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 8 }}>Standard 0G Mainnet processing</div>
              </div>
            </div>

            <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: 'var(--text)' }}>Recent Tipping History</h4>
            <div style={{ border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', background: 'var(--bg-secondary)' }}>
              {tips.length === 0 ? (
                <div style={{ padding: 48, textAlign: 'center' }}>
                  <div style={{ fontSize: 24, marginBottom: 12 }}>🍃</div>
                  <p style={{ color: 'var(--text-muted)' }}>No tips received yet.</p>
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: 'rgba(0,0,0,0.03)', borderBottom: '1px solid var(--border)' }}>
                      <th style={{ textAlign: 'left', padding: '16px 20px', fontWeight: 700, color: 'var(--text-muted)' }}>Sender</th>
                      <th style={{ textAlign: 'left', padding: '16px 20px', fontWeight: 700, color: 'var(--text-muted)' }}>Amount</th>
                      <th style={{ textAlign: 'left', padding: '16px 20px', fontWeight: 700, color: 'var(--text-muted)' }}>Time</th>
                      <th style={{ textAlign: 'right', padding: '16px 20px', fontWeight: 700, color: 'var(--text-muted)' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tips.map(tip => (
                      <tr key={tip.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--accent)' }}>{tip.from}</td>
                        <td style={{ padding: '16px 20px', fontWeight: 700, color: 'var(--text)' }}>{tip.amount} 0G</td>
                        <td style={{ padding: '16px 20px', color: 'var(--text-muted)' }}>{tip.time}</td>
                        <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                          <span style={{ fontSize: 11, padding: '4px 10px', background: 'rgba(16,185,129,0.1)', color: 'var(--success)', borderRadius: 20, fontWeight: 700 }}>RECEIVED</span>
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
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>👤 Profile Details</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {isEditing ? (
                <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 24, background: 'rgba(139,92,246,0.03)', borderRadius: 20, border: '1px solid var(--accent-glow)' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--accent)', marginBottom: 4 }}>Edit Profile Settings</div>

                  <div>
                    <label style={{ fontSize: 12, color: 'var(--text-faint)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>Display Name</label>
                    <input
                      type="text"
                      value={tempUsername}
                      onChange={e => setTempUsername(e.target.value)}
                      placeholder="Enter username..."
                      style={{
                        width: '100%', padding: '12px 16px', background: 'var(--surface)',
                        border: '1px solid var(--border)', borderRadius: 12, color: 'var(--text)',
                        fontSize: 14, outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 12, color: 'var(--text-faint)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>Profile Picture</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <label className="secondary-btn" style={{ 
                        display: 'inline-flex', padding: '10px 20px', borderRadius: 20, cursor: 'pointer',
                        fontSize: 13, fontWeight: 600, border: '1px dashed var(--border)', background: 'rgba(255,255,255,0.03)'
                      }}>
                        <span>📸 Upload Photo</span>
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <img src={tempAvatarUrl} alt="Preview" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)' }} />
                          <button onClick={() => setTempAvatarUrl('')} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', fontSize: 12 }}>Remove</button>
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>Upload a square image for best results.</div>
                  </div>

                  <div>
                    <label style={{ fontSize: 12, color: 'var(--text-faint)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>Bio</label>
                    <textarea
                      value={tempBio}
                      onChange={e => setTempBio(e.target.value)}
                      placeholder="Tell the world about yourself..."
                      style={{
                        width: '100%', minHeight: 120, padding: 16, background: 'var(--surface)',
                        border: '1px solid var(--border)', borderRadius: 12, color: 'var(--text)',
                        fontSize: 14, outline: 'none', resize: 'vertical'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                    <button onClick={saveProfile} className="primary-btn" style={{ padding: '10px 24px', borderRadius: 24, fontSize: 14 }}>Save Changes</button>
                    <button onClick={() => setIsEditing(false)} className="secondary-btn" style={{ padding: '10px 24px', borderRadius: 24, fontSize: 14 }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--text-faint)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>Wallet Address</div>
                    <div style={{
                      padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: 12,
                      fontFamily: 'monospace', fontSize: 14, color: 'var(--text)', border: '1px solid var(--border)',
                      wordBreak: 'break-all'
                    }}>
                      {address}
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div style={{ fontSize: 12, color: 'var(--text-faint)', fontWeight: 700, textTransform: 'uppercase' }}>Bio</div>
                    </div>
                    <div style={{
                      padding: '24px', background: 'var(--bg-secondary)', borderRadius: 12,
                      fontSize: 14, color: bio ? 'var(--text)' : 'var(--text-muted)', border: '1px solid var(--border)',
                      fontStyle: bio ? 'normal' : 'italic', lineHeight: 1.6
                    }}>
                      {bio || "This user hasn't set a bio yet."}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--text-faint)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>Network</div>
                      <div style={{ fontSize: 14, color: 'var(--text)', fontWeight: 600 }}>0G Mainnet (16661)</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--text-faint)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>Status</div>
                      <div style={{ fontSize: 14, color: 'var(--success)', fontWeight: 700 }}>✓ Verified Creator</div>
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
