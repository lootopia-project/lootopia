import RETURN from "@/type/request/return"
import LOGIN from "@/type/feature/auth/login"
interface auth_context {
    isAuthenticated: boolean
    login: (userData: LOGIN) => Promise<RETURN>
    logout: () => Promise<RETURN>
    checkDoubleAuth: () => Promise<RETURN>
}

export default auth_context