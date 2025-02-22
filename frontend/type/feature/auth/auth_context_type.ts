import RETURN from "@/type/request/return"
import LOGIN from "@/type/feature/auth/login"
interface auth_context {
    isAuthenticated: boolean
    errorGoogle: string
    login: (userData: LOGIN) => Promise<RETURN>
    logout: () => Promise<RETURN>
    checkDoubleAuth: (otpCode: string) => Promise<RETURN>;
    checkRecoveryCode: (recoveryCode: string) => Promise<RETURN>;
    LoginOrRegisterWithGoogle: (mode: 'login' | 'register') => void;
}

export default auth_context