export const decodeToken = (token, fallbackRole = 'User') => {
    if (!token) return null;

    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        const decoded = JSON.parse(jsonPayload);

        return {
            id: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || '',
            name: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || '',
            email: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || '',
            role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || fallbackRole
        };
    } catch (error) {
        console.error("Failed to decode JWT token:", error);
        return null;
    }
};