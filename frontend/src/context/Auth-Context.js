import React, {createContext, useState, useEffect} from 'react';

export const AuthContext = createContext();

export function AuthProvider({children}){
    const [user, setUser] = useState(null);

    useEffect(() =>{
        const stored = localStorage.getItem('user');
        if(stored) setUser(JSON.parse(stored));

    }, []);
    const login = (userObj)=>{
        localStorage.setItem('user', JSON.stringify(userObj));
        setUser(userObj);
    };
    const logout = ()=>{
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value = {{user,login,logout}}>
            {children}
        </AuthContext.Provider>
    );
}
