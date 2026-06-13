import React, { useState, useEffect } from 'react';
import { tripShareService} from '../../../services/Trip/TripShare/tripShareService'; 
import { travelTheme } from '../../../theme/Theme';
import { toast } from 'react-toastify';

const ShareView = ({ tripId }) => {
    const [accessType, setAccessType] = useState(1); 
    const [expiresInDays, setExpiresInDays] = useState(7);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    
    const [activeShares, setActiveShares] = useState([]);
    const [sharesLoading, setSharesLoading] = useState(false);
    
    const [latestShare, setLatestShare] = useState(null);

    const loadActiveShares = async () => {
        try {
            setSharesLoading(true);
            const response = await tripShareService.getSharesByTripId(tripId);
            if (response && response.success) {
                setActiveShares(response.data || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSharesLoading(false);
        }
    };

    useEffect(() => {
        if (tripId) loadActiveShares();
    }, [tripId]);

    const handleCreateShare = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            if(!email.trim()) {
                toast.error('Please provide email address.');
                return;
            }
            const response = await tripShareService.createShare(tripId, {
                accessType: parseInt(accessType),
                expiresInDays: parseInt(expiresInDays),
                email: email
            });

            if (response && response.success) {
                toast.success('Share link generated successfully!');
                setLatestShare(response.data); 
                setEmail('');
                loadActiveShares(); 
            }
        } catch (error) {
            toast.error(error.message || 'Failed to create share link.');
        } finally {
            setLoading(false);
        }
    };

    const handleRevokeShare = async (shareId) => {
        try {
            const response = await tripShareService.revokeShare(shareId);
            if (response && response.success) {
                toast.success('Share access revoked.');
                if (latestShare && latestShare.id === shareId) {
                    setLatestShare(null);
                }
                loadActiveShares();
            }
        } catch (error) {
            toast.error(error.message || 'Failed to revoke share.');
        }
    };

    const copyToClipboard = (token) => {
        const shareUrl = `http://localhost:5173/trips/${tripId}?token=${token}`;
        navigator.clipboard.writeText(shareUrl);
        toast.info('Link copied to clipboard!');
    };

    return (
        <div style={{ color: travelTheme.colors.text }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Share This Trip</h3>
            
            <form onSubmit={handleCreateShare} style={{ display: 'grid', gap: '15px', maxWidth: '500px', marginBottom: '30px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '600' }}>Access Type:</label>
                    <select 
                        value={accessType} 
                        onChange={(e) => setAccessType(e.target.value)}
                        style={{ padding: '10px', borderRadius: travelTheme.radius.regular, border: `1px solid ${travelTheme.colors.border}` }}
                    >
                        <option value={1}>View Only</option>
                        <option value={2}>Edit Allowed</option>
                    </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '600' }}>Expires In (Days):</label>
                    <input 
                        type="number" 
                        min="1"
                        value={expiresInDays} 
                        onChange={(e) => setExpiresInDays(e.target.value)}
                        style={{ padding: '10px', borderRadius: travelTheme.radius.regular, border: `1px solid ${travelTheme.colors.border}` }}
                        required
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '600' }}>Invitee Email:</label>
                    <input 
                        type="email" 
                        value={email} 
                        placeholder="e.g. friend@travel.com"
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ padding: '10px', borderRadius: travelTheme.radius.regular, border: `1px solid ${travelTheme.colors.border}` }}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    style={{
                        padding: '12px',
                        backgroundColor: travelTheme.colors.primary,
                        color: 'white',
                        border: 'none',
                        borderRadius: travelTheme.radius.regular,
                        cursor: 'pointer',
                        fontWeight: '600',
                        marginTop: '10px'
                    }}
                >
                    {loading ? 'Generating...' : 'Generate Share Link'}
                </button>
            </form>

            {latestShare && (
                <div style={{ 
                    backgroundColor: 'rgba(92, 184, 92, 0.1)', 
                    border: '1px solid #5cb85c', 
                    borderRadius: travelTheme.radius.regular, 
                    padding: '20px',
                    marginBottom: '30px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px'
                }}>
                    <h4 style={{ margin: 0, color: '#5cb85c' }}>Successfully Created Share Link!</h4>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input 
                            type="text" 
                            readOnly 
                            value={`http://localhost:5173/trips/${tripId}?token=${latestShare.token}`}
                            style={{ flex: 1, padding: '10px', borderRadius: travelTheme.radius.regular, border: `1px solid ${travelTheme.colors.border}`, backgroundColor: '#f9f9f9' }}
                        />
                        <button 
                            onClick={() => copyToClipboard(latestShare.token)}
                            style={{ padding: '10px 15px', backgroundColor: '#5cb85c', color: 'white', border: 'none', borderRadius: travelTheme.radius.regular, cursor: 'pointer' }}
                        >
                            Copy
                        </button>
                    </div>
                    {latestShare.qrCodeBase64 && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px' }}>
                            <p style={{ margin: '0 0 5px 0', fontSize: '13px', fontWeight: '600' }}>Or Scan QR Code:</p>
                            <img 
                                src={`data:image/png;base64,${latestShare.qrCodeBase64}`} 
                                alt="Trip Share QR Code" 
                                style={{ width: '150px', height: '150px', border: `1px solid ${travelTheme.colors.border}`, borderRadius: travelTheme.radius.regular, padding: '5px', backgroundColor: 'white' }}
                            />
                        </div>
                    )}
                </div>
            )}

            <h4>Active Access History</h4>
            {sharesLoading ? (
                <p>Loading share history...</p>
            ) : activeShares.length === 0 ? (
                <p style={{ color: travelTheme.colors.muted, fontSize: '14px' }}>This trip hasn't been shared with anyone yet.</p>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead>
                            <tr style={{ borderBottom: `2px solid ${travelTheme.colors.border}`, textAlign: 'left' }}>
                                <th style={{ padding: '10px' }}>Type</th>
                                <th style={{ padding: '10px' }}>Expires At</th>
                                <th style={{ padding: '10px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activeShares.map((share) => (
                                <tr key={share.id || share.Id} style={{ borderBottom: `1px solid ${travelTheme.colors.border}` }}>
                                    <td style={{ padding: '10px', fontWeight: '600' }}>
                                        {(share.accessType === 2 || share.AccessType === 2) ? (
                                            <span style={{ color: '#f0ad4e' }}>Edit Allowed</span>
                                        ) : (
                                            <span style={{ color: '#5cb85c' }}>View Only</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '10px' }}>
                                        {new Date(share.expiresAt || share.ExpiresAt).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '10px' }}>
                                        <button 
                                            onClick={() => copyToClipboard(share.token || share.Token)}
                                            style={{ background: 'none', border: 'none', color: travelTheme.colors.primary, cursor: 'pointer', marginRight: '15px', fontWeight: '600' }}
                                        >
                                            Link
                                        </button>
                                        <button 
                                            onClick={() => handleRevokeShare(share.id || share.Id)}
                                            style={{ background: 'none', border: 'none', color: '#d9534f', cursor: 'pointer', fontWeight: '600' }}
                                        >
                                            Revoke
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ShareView;