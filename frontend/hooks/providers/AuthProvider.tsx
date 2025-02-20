import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import  { loginUser, logoutUser, checkIsLogin } from "@/services/AuthService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LOGIN from "@/type/feature/auth/login";
import RETURN from "@/type/request/return";
import AUTH_CONTEXT_TYPE from "@/type/feature/auth/auth_context_type";
import { useRouter, usePathname } from "expo-router";
import { useLanguage } from "@/hooks/providers/LanguageProvider";
import { CheckDoubleAuth, CheckRecoveryCode } from "@/services/DoubleAuth";

interface AUTH_CONTEXT_TYPE {
    isAuthenticated: boolean;
    login: (userData: LOGIN) => Promise<RETURN>;
    logout: () => Promise<RETURN>;
    checkDoubleAuth: (otpCode: string) => Promise<RETURN>;
    checkRecoveryCode: (recoveryCode: string) => Promise<RETURN>;
}

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
    checkDoubleAuth: async (): Promise<RETURN> => {
        await Promise.resolve();
        return { message: "" };
    },

    checkRecoveryCode: async (): Promise<RETURN> => {
        await Promise.resolve();
        return { message: "" };
    }

};

const publicRoutes = ["/+not-found", "/login", "/register", "/2fa", "/user/recoveryCode","/"];
const AUTH_CONTEXT = createContext(defaultContextValue);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const pathName = usePathname();
    const router = useRouter();
    const { changeLanguage } = useLanguage();
    useEffect(() => {
        const initializeAuthState = async () => {
            try {
                const data = await checkIsLogin();
                if (data.message === true) {
                    setIsAuthenticated(true);
                    await AsyncStorage.setItem("lang", data.lang);
                    await AsyncStorage.setItem("img", data.img);
                    changeLanguage(data.lang);
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

        if(data.message!=="2FA"){
         await AsyncStorage.setItem("token", data.headers.authorization);
        }else{
            await AsyncStorage.setItem("email", userData.email);
        }
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

    const checkDoubleAuth = async (otpCode: string): Promise<RETURN> => {
        const email = await AsyncStorage.getItem("email");
        const result = await CheckDoubleAuth(otpCode, email!);
        console.log(result.message.headers.authorization);
        if (result.message) {
            console.log("2FA activated successfully "+result.message.headers.authorization);
            await AsyncStorage.setItem("token", result.message.headers.authorization);
            AsyncStorage.removeItem("email");
            setIsAuthenticated(true);
        }
        return result;
    }

    const checkRecoveryCode = async (recoveryCode: string): Promise<RETURN> => {
        const email = await AsyncStorage.getItem("email");
        const result = await CheckRecoveryCode(recoveryCode, email);
        if (result.message) {
            await AsyncStorage.setItem("token", result.message.headers.authorization);
            AsyncStorage.removeItem("email");
            setIsAuthenticated(true);
        }
        return result;
    }

    return (
        <AUTH_CONTEXT.Provider
            value={{
                isAuthenticated,
                login,
                logout,
                checkDoubleAuth,
                checkRecoveryCode
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
