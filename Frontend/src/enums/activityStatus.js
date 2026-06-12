export const ActivityStatus = {
    Planned: 1,
    Reserved: 2,
    Completed: 3,
    Canceled: 4
};

export const ActivityStatusLabels = {
    1: 'Planned',
    2: 'Reserved',
    3: 'Completed',
    4: 'Canceled'
};

export const ActivityStatusColors = {
    1: '#f0ad4e', 
    2: '#0275d8', 
    3: '#5cb85c', 
    4: '#d9534f'  
};

export const getActivityStatusLabel = (status) => {
    return ActivityStatusLabels[status] || 'Unknown';
};

export const getActivityStatusColor = (status) => {
    return ActivityStatusColors[status] || '#6c757d';
};