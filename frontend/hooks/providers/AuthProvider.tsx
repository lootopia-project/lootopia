import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { loginUser, logoutUser, checkIsLogin, loginOrRegisterWithGoogle } from "@/services/AuthService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LOGIN from "@/type/feature/auth/login";
import RETURN from "@/type/request/return";
import AUTH_CONTEXT_TYPE from "@/type/feature/auth/auth_context_type";
import { useRouter, usePathname } from "expo-router";
import { useLanguage } from "@/hooks/providers/LanguageProvider";
import { CheckDoubleAuth, CheckRecoveryCode } from "@/services/DoubleAuth";

const defaultContextValue: AUTH_CONTEXT_TYPE = {
    isAuthenticated: false,
    errorGoogle: "",
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
    },
    LoginOrRegisterWithGoogle: async (mode: 'login' | 'register') => {
        void 0;
    },
};

const publicRoutes = ["/+not-found", "/login", "/register", "/2fa", "/user/recoveryCode", "/", "/user/checkMail", "/login-success"];
const AUTH_CONTEXT = createContext(defaultContextValue);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errorGoogle, setErrorGoogle] = useState("");
    const pathName = usePathname();
    const router = useRouter();
    const { changeLanguage } = useLanguage();

    useEffect(() => {
        const initializeAuthState = async () => {
            try {
                await AsyncStorage.getItem("token")
                const data = await checkIsLogin();
                if (data.message === true) {
                    setErrorGoogle("");
                    setIsAuthenticated(true);
                    await AsyncStorage.setItem("lang", data.lang);
                    await AsyncStorage.setItem("img", data.img);
                    changeLanguage(data.lang);
                } else {
                    setIsAuthenticated(false);
                    await AsyncStorage.removeItem("token");
                    const isPublic = publicRoutes.some((route) => {
                        return pathName === route || pathName.startsWith("/user/checkMail/");
                      })
                    if (!isPublic) {
                        router.push("/+not-found");
                    }
                }
            } catch (error) {
                setIsAuthenticated(false);
                await AsyncStorage.removeItem("token");
                const isPublic = publicRoutes.some((route) => {
                    return pathName === route || pathName.startsWith("/user/checkMail/");
                })                
                 if (!isPublic) {
                    router.push("/+not-found");
                }
            }
        };

        initializeAuthState();
    }, [pathName,changeLanguage, router]);

    const login = async (userData: LOGIN): Promise<RETURN> => {
        const data = await loginUser(userData);
        if (data.message !== "2FA") {
            await AsyncStorage.setItem("token", data.headers.authorization);
        }else {
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
        if (result.message) {
            await AsyncStorage.setItem("token", result.message.headers.authorization);
            AsyncStorage.removeItem("email");
            setIsAuthenticated(true);
        }
        return result;
    }

    const checkRecoveryCode = async (recoveryCode: string): Promise<RETURN> => {
        const email = await AsyncStorage.getItem("email");
        const result = await CheckRecoveryCode(recoveryCode, email as string);
        if (result.message) {
            await AsyncStorage.setItem("token", result.message.headers.authorization);
            AsyncStorage.removeItem("email");
            setIsAuthenticated(true);
        }
        return result;
    };



    

    const LoginOrRegisterWithGoogle = async (mode: 'login' | 'register') => {
        loginOrRegisterWithGoogle(mode);
    };
    

    const fetchGoogleToken = async (token: string) => {
            if (token) {
                await AsyncStorage.setItem("token", token);
                setIsAuthenticated(true);
      
        }
    };
    

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");
        const error = urlParams.get("error");
        if (token&&pathName==="/"){
            fetchGoogleToken(token);
        }
        else if (error) {
            if (error === "already_registered_google") {
                setErrorGoogle("You have already an Google account. Please login with Google");
                
            } else if (error === "registered_with_email") {
                setErrorGoogle("You have already an account with this email. Please login with your email and password");
            }
        }
    }, [pathName]);

    return (
        <AUTH_CONTEXT.Provider
            value={{
                isAuthenticated,
                errorGoogle,
                login,
                logout,
                checkDoubleAuth,
                checkRecoveryCode,
                LoginOrRegisterWithGoogle,
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
