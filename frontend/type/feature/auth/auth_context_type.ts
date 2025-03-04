import RETURN from "@/type/request/return"
import LOGIN from "@/type/feature/auth/login"
import UsersGoogle from "./user_google"
interface auth_context {
    isAuthenticated: boolean
    login: (userData: LOGIN) => Promise<RETURN>
    logout: () => Promise<RETURN>
    checkDoubleAuth: (otpCode: string) => Promise<RETURN>;
    checkRecoveryCode: (recoveryCode: string) => Promise<RETURN>;
    loginOrRegisterGoogle(users:UsersGoogle): Promise<RETURN>
    updateCrowns: ()=>Promise<number>
}

export default auth_context