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

        const id =
            decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
            decoded.sub ||
            decoded.nameid ||
            decoded.id ||
            null;

        const name =
            decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
            decoded.name ||
            decoded.given_name ||
            decoded.unique_name ||
            '';

        const email =
            decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ||
            decoded.email ||
            decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn"] ||
            '';

        const role =
            decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
            decoded.role ||
            fallbackRole;

        return {
            id,
            name,
            email,
            role
        };

    } catch (error) {
        console.error("Failed to decode JWT token:", error);
        return null;
    }
};