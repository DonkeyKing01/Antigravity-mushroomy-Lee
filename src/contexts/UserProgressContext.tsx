import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

interface UserProgressContextType {
    mycelium: number;
    unlockedSpecies: string[];
    addMycelium: (amount: number, reason?: string) => void;
    spendMycelium: (amount: number) => boolean;
    unlockSpecies: (speciesId: string) => void;
}

const UserProgressContext = createContext<UserProgressContextType | undefined>(undefined);

export const UserProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mycelium, setMycelium] = useState<number>(() => {
        const saved = localStorage.getItem("mycelium");
        return saved ? parseInt(saved, 10) : 1250; // Initial mock value
    });

    const [unlockedSpecies, setUnlockedSpecies] = useState<string[]>(() => {
        const saved = localStorage.getItem("unlockedSpecies");
        return saved ? JSON.parse(saved) : ["psilocybe-cubensis", "amanita-muscaria"];
    });

    useEffect(() => {
        localStorage.setItem("mycelium", mycelium.toString());
    }, [mycelium]);

    useEffect(() => {
        localStorage.setItem("unlockedSpecies", JSON.stringify(unlockedSpecies));
    }, [unlockedSpecies]);

    const addMycelium = (amount: number, reason?: string) => {
        setMycelium((prev) => prev + amount);
        if (reason) {
            toast.success(`+${amount} Mycelium`, {
                description: reason,
                className: "border-green-500/20 bg-green-950/20 text-green-400",
            });
        }
    };

    const spendMycelium = (amount: number) => {
        if (mycelium >= amount) {
            setMycelium((prev) => prev - amount);
            return true;
        }
        toast.error("Insufficient Mycelium");
        return false;
    };

    const unlockSpecies = (speciesId: string) => {
        if (!unlockedSpecies.includes(speciesId)) {
            setUnlockedSpecies((prev) => [...prev, speciesId]);
            toast.info("New Species Unlocked!");
        }
    };

    return (
        <UserProgressContext.Provider
            value={{ mycelium, unlockedSpecies, addMycelium, spendMycelium, unlockSpecies }}
        >
            {children}
        </UserProgressContext.Provider>
    );
};

export const useUserProgress = () => {
    const context = useContext(UserProgressContext);
    if (context === undefined) {
        throw new Error("useUserProgress must be used within a UserProgressProvider");
    }
    return context;
};
