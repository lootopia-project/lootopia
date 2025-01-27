import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import  { loginUser, logoutUser, checkIsLogin } from "@/app/service/AuthService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LOGIN from "@/type/feature/auth/login";
import RETURN from "@/type/request/return";
import AUTH_CONTEXT_TYPE from "@/type/feature/auth/auth_context_type";
import { useRouter, usePathname } from "expo-router";
const defaultContextValue: AUTH_CONTEXT_TYPE = {
    isAuthenticated: false,
    login: async (): Promise<RETURN> => {
        await Promise.resolve();
        return { message: "" };
    },
    logout: async (): Promise<RETURN> => {
        await Promise.resolve();
        return { message: "" };
    },

};

const publicRoutes = ["/+not-found", "/login", "/register"];
const AUTH_CONTEXT = createContext(defaultContextValue);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const pathName = usePathname();
    const router = useRouter();

    useEffect(() => {
        const initializeAuthState = async () => {            
            try {
                const data = await checkIsLogin();
                
                if (data.message === true) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                    await AsyncStorage.removeItem("token");
                    if (!publicRoutes.includes(pathName)) {
                        router.push("/+not-found");
                    }
                }                
            } catch (error) {
                setIsAuthenticated(false);
                await AsyncStorage.removeItem("token");
                if (!publicRoutes.includes(pathName)) {
                    router.push("/+not-found");
                }
            }
        };

        initializeAuthState();
    }, [pathName]);

    const login = async (userData: LOGIN): Promise<RETURN> => {
        
        const data = await loginUser(userData);
                
        await AsyncStorage.setItem("token", data.headers.authorization);
        setIsAuthenticated(true);
        return data;
    };

    const logout = async (): Promise<RETURN> => {
        const result = await logoutUser();
        if (result.message) {
            await AsyncStorage.removeItem("token");
            setIsAuthenticated(false);
        }
        return result;
    };
    return (
        <AUTH_CONTEXT.Provider
            value={{
                isAuthenticated,
                login,
                logout
            }}
        >
            {children}
        </AUTH_CONTEXT.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AUTH_CONTEXT);
    if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
  };
  