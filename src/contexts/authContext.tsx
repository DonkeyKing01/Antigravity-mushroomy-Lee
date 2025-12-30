import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getAssetPath } from "@/utils/assetPath";

interface User {
    id: string;
    username: string;
    email: string;
    avatar: string;
    joinDate: string;
    contributions: number;
    discoveries: number;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => boolean;
    register: (username: string, email: string, password: string) => boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    // Load user from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem("myco_user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = (email: string, password: string): boolean => {
        // Mock login - always succeed
        const safeEmail = email || "researcher@myco.network";
        const avatars = [
            getAssetPath("/images/avatars/mushroom.png"),
            getAssetPath("/images/avatars/beaker.png")
        ];
        const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

        const mockUser: User = {
            id: "usr_" + Math.random().toString(36).substr(2, 9),
            username: safeEmail.split("@")[0] || "Researcher",
            email: safeEmail,
            avatar: randomAvatar,
            joinDate: new Date().toISOString(),
            contributions: Math.floor(Math.random() * 50) + 10,
            discoveries: Math.floor(Math.random() * 20) + 5,
        };
        setUser(mockUser);
        localStorage.setItem("myco_user", JSON.stringify(mockUser));
        return true;
    };

    const register = (username: string, email: string, password: string): boolean => {
        // Mock registration - always succeed
        const safeUsername = username || "New Researcher";
        const safeEmail = email || "researcher@myco.network";

        const avatars = [
            getAssetPath("/images/avatars/mushroom.png"),
            getAssetPath("/images/avatars/beaker.png")
        ];
        const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

        const mockUser: User = {
            id: "usr_" + Math.random().toString(36).substr(2, 9),
            username: safeUsername,
            email: safeEmail,
            avatar: randomAvatar,
            joinDate: new Date().toISOString(),
            contributions: 0,
            discoveries: 0,
        };
        setUser(mockUser);
        localStorage.setItem("myco_user", JSON.stringify(mockUser));
        return true;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("myco_user");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
