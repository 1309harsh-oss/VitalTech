import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
    const [userRole, setUserRole] = useState(() => {
        return localStorage.getItem('userRole') || '';
    });
    const [name, setName] = useState(() => {
        return localStorage.getItem('userName') || '';
    });
    const [email, setEmail] = useState(() => {
        return localStorage.getItem('userEmail') || '';
    });

    useEffect(() => {
        if (userRole) {
            localStorage.setItem('userRole', userRole);
        } else {
            localStorage.removeItem('userRole');
        }
    }, [userRole]);

    useEffect(() => {
        if (name) {
            localStorage.setItem('userName', name);
        } else {
            localStorage.removeItem('userName');
        }
    }, [name]);

    useEffect(() => {
        if (email) {
            localStorage.setItem('userEmail', email);
        } else {
            localStorage.removeItem('userEmail');
        }
    }, [email]);

    const logout = () => {
        setUserRole('');
        setName('');
        setEmail('');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
    };

    const value = {
        userRole,
        setUserRole,
        name,
        setName,
        email,
        setEmail,
        logout
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}