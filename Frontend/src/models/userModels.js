// UserUpdateDTO
export const createUpdateUserRequestModel = (name, email, currentPassword, newPassword) => ({
    Name: name || '',
    Email: email || '',
    CurrentPassword: currentPassword || null, 
    NewPassword: newPassword || null
});