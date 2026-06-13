export const ShareAccessType = {
    View: 1,
    Edit: 2
};

export const ShareAccessTypeLabels = {
    1: 'View Only',
    2: 'Edit Allowed'
};

export const ShareAccessTypeColors = {
    1: '#5cb85c', 
    2: '#f0ad4e'  
};

export const getShareAccessTypeLabel = (accessType) => {
    return ShareAccessTypeLabels[accessType] || 'Unknown';
};

export const getShareAccessTypeColor = (accessType) => {
    return ShareAccessTypeColors[accessType] || '#6c757d';
};