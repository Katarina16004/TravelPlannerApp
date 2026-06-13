import React, { useState, useEffect } from 'react';
import { tripShareService } from '../../../services/Trip/TripShare/tripShareService';
import { toast } from 'react-toastify';
import ConfirmModal from '../../Common/ConfirmModal';
import { travelTheme } from '../../../theme/Theme';

import {
    getShareAccessTypeLabel,
    getShareAccessTypeColor
} from '../../../enums/shareAccessType';
import { ShareAccessType } from '../../../enums/shareAccessType';

const TripShareView = ({ tripId, token }) => {
    const [shares, setShares] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [confirmRevoke, setConfirmRevoke] = useState(null);

    const [accessType, setAccessType] = useState(ShareAccessType.View);
    const [expiresInDays, setExpiresInDays] = useState(7);
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (tripId) {
            loadShares();
        }
    }, [tripId]);

    const loadShares = async () => {
        try {
            setLoading(true);
            const res = await tripShareService.getSharesByTripId(tripId, token);
            setShares(res.data || res.Data || []);
        } catch (e) {
            toast.error(e.message || 'Failed to load share links.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateShare = async (e) => {
        e.preventDefault();
        try {
            setSubmitLoading(true);

            await tripShareService.createShare(
                tripId,
                { accessType, expiresInDays, email },
                token
            );

            toast.success('Share link generated successfully!');
            setEmail('');
            setAccessType(ShareAccessType.View);
            setExpiresInDays(7);

            loadShares();
        } catch (e) {
            toast.error(e.message);
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleRevokeShare = async () => {
        if (!confirmRevoke) return;
        try {
            const id = confirmRevoke.id || confirmRevoke.Id;
            await tripShareService.revokeShare(id, token);

            toast.success('Access revoked successfully.');
            setConfirmRevoke(null);
            loadShares();
        } catch (e) {
            toast.error(e.message);
        }
    };

    // Zajednički stilovi za input elemente i selekte
    const inputStyle = {
        padding: '10px 12px',
        borderRadius: travelTheme.radius.regular,
        border: `1px solid ${travelTheme.colors.border}`,
        backgroundColor: '#fff',
        fontFamily: travelTheme.font,
        fontSize: '14px',
        color: travelTheme.colors.text,
        outline: 'none',
        flex: 1,
        minWidth: '150px'
    };

    return (
        <div style={{
            backgroundColor: travelTheme.colors.surface,
            borderRadius: travelTheme.radius.large,
            border: `1px solid ${travelTheme.colors.border}`,
            boxShadow: travelTheme.shadow,
            padding: '30px'
        }}>
            <h2 style={{ margin: '0 0 25px 0', color: travelTheme.colors.text }}>
                Share Trip
            </h2>

            {/* FORM ZA KREIRANJE LINKA */}
            <form onSubmit={handleCreateShare} style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
                alignItems: 'center',
                marginBottom: '35px',
                paddingBottom: '25px',
                borderBottom: `1px solid ${travelTheme.colors.border}`
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1, minWidth: '140px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: travelTheme.colors.muted }}>Access Type</label>
                    <select 
                        value={accessType} 
                        onChange={(e) => setAccessType(Number(e.target.value))}
                        style={inputStyle}
                    >
                        <option value={ShareAccessType.View}>View Allowed</option>
                        <option value={ShareAccessType.Edit}>Edit Allowed</option>
                    </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1, minWidth: '140px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: travelTheme.colors.muted }}>Expires In</label>
                    <select 
                        value={expiresInDays} 
                        onChange={(e) => setExpiresInDays(Number(e.target.value))}
                        style={inputStyle}
                    >
                        <option value={1}>1 Day</option>
                        <option value={7}>7 Days</option>
                        <option value={30}>30 Days</option>
                    </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 2, minWidth: '200px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: travelTheme.colors.muted }}>Invitee Email (Optional)</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. friend@travel.com"
                        style={inputStyle}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', paddingTop: '22px' }}>
                    <button 
                        disabled={submitLoading}
                        style={{
                            padding: '11px 24px',
                            backgroundColor: travelTheme.colors.primary,
                            color: 'white',
                            border: 'none',
                            borderRadius: travelTheme.radius.regular,
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '14px',
                            transition: 'opacity 0.2s',
                            opacity: submitLoading ? 0.7 : 1
                        }}
                    >
                        {submitLoading ? 'Generating...' : '+ Generate Link'}
                    </button>
                </div>
            </form>

            {/* LISTA POSTOJEĆIH LINKOVA */}
            <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', color: travelTheme.colors.text }}>
                Active Share Links
            </h3>

            {loading ? (
                <div style={{ textAlign: 'center', color: travelTheme.colors.muted, padding: '20px 0' }}>
                    Loading shared access records...
                </div>
            ) : shares.length === 0 ? (
                <div style={{ color: travelTheme.colors.muted, fontStyle: 'italic', padding: '10px 0' }}>
                    This trip hasn't been shared with anyone yet.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {shares.map((share) => {
                        const id = share.id || share.Id;
                        const tokenStr = share.token || share.Token;
                        const url = `${window.location.origin}/trip/${tripId}?token=${tokenStr}`;

                        return (
                            <div 
                                key={id} 
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '12px',
                                    padding: '12px',
                                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                                    borderRadius: travelTheme.radius.regular,
                                    border: `1px solid ${travelTheme.colors.border}`,
                                    flexWrap: 'wrap'
                                }}
                            >
                                <div style={{ flex: 1, position: 'relative', minWidth: '250px' }}>
                                    <input
                                        readOnly
                                        value={url}
                                        title="Click to copy link"
                                        onClick={() => {
                                            navigator.clipboard.writeText(url);
                                            toast.info('Link copied to clipboard!');
                                        }}
                                        style={{
                                            ...inputStyle,
                                            width: '100%',
                                            backgroundColor: '#f9f9f9',
                                            cursor: 'pointer',
                                            textOverflow: 'ellipsis',
                                            paddingRight: '60px',
                                            fontWeight: '500'
                                        }}
                                    />
                                    <span style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        color: travelTheme.colors.primary,
                                        pointerEvents: 'none'
                                    }}>
                                        COPY
                                    </span>
                                </div>

                                <span style={{
                                    fontSize: '13px',
                                    fontWeight: '700',
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    backgroundColor: 'rgba(255,255,255,0.8)',
                                    border: `1px solid ${travelTheme.colors.border}`,
                                    color: getShareAccessTypeColor ? getShareAccessTypeColor(share.accessType) : '#555',
                                    minWidth: '80px',
                                    textAlign: 'center'
                                }}>
                                    {getShareAccessTypeLabel ? getShareAccessTypeLabel(share.accessType) : 'Shared'}
                                </span>

                                <button 
                                    onClick={() => setConfirmRevoke(share)}
                                    style={{
                                        padding: '10px 16px',
                                        backgroundColor: '#d9534f', // Danger boja u tonu aplikacije
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: travelTheme.radius.regular,
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        fontSize: '13px'
                                    }}
                                >
                                    Revoke
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* MODAL ZA POTVRDU UKIDANJA PRISTUPA */}
            <ConfirmModal
                open={!!confirmRevoke}
                title="Revoke Shared Access"
                message="Are you sure you want to disable this share link? Anyone using it will immediately lose access to this trip."
                confirmText="Revoke Access"
                cancelText="Cancel"
                type="danger"
                onCancel={() => setConfirmRevoke(null)}
                onConfirm={handleRevokeShare}
            />
        </div>
    );
};

export default TripShareView;