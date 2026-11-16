import { createContext, useContext, useState } from 'react';
import * as authApi from '../api/auth';

const AuthContext = createContext(null);

const USER_KEY = 'jobtrail_user';
const TOKEN_KEY = 'jobtrail_token';

const getSavedUser = () => {
try {
const savedUser = localStorage.getItem(USER_KEY);
return savedUser ? JSON.parse(savedUser) : null;
} catch {
localStorage.removeItem(USER_KEY);
return null;
}
};

const AuthProvider = ({ children }) => {
const [user, setUser] = useState(getSavedUser);
const [token, setToken] = useState(
() => localStorage.getItem(TOKEN_KEY) || null,
);

const saveSession = (data) => {
if (!data?.user || !data?.token) {
throw new Error('The server returned an invalid login response.');
}


localStorage.setItem(USER_KEY, JSON.stringify(data.user));
localStorage.setItem(TOKEN_KEY, data.token);

setUser(data.user);
setToken(data.token);

return data.user;


};

const login = async (email, password) => {
const data = await authApi.loginUser(email, password);
return saveSession(data);
};

const register = async ({ name, email, password }) => {
const data = await authApi.registerUser({ name, email, password });
return saveSession(data);
};

const logout = () => {
localStorage.removeItem(USER_KEY);
localStorage.removeItem(TOKEN_KEY);


setUser(null);
setToken(null);


};

return (
<AuthContext.Provider
value={{ user, token, login, register, logout }}
>
{children}
</AuthContext.Provider>
);
};

export { AuthProvider };

export const useAuth = () => {
const context = useContext(AuthContext);

if (!context) {
throw new Error('useAuth must be used inside an AuthProvider.');
}

return context;
};
