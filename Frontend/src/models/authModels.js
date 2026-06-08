import { decodeToken } from '../helpers/jwtHelper';

// UserLoginDTO 
export const createLoginRequestModel = (email, password) => ({
    Email: email || '',
    Password: password || ''
});

// UserRegisterDTO 
export const createRegisterRequestModel = (name, email, password) => ({
    Name: name || '',
    Email: email || '',
    Password: password || ''
});

export const createUserModel = (role, token) => {
    return decodeToken(token, role);
};