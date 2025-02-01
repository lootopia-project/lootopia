export const validatePassword = (info: { password: string, R_PASSWORD: string }) => ({
    length: info.password.length >= 10 || info.R_PASSWORD.length >= 10,
    maj: /[A-Z]/u.test(info.password) || /[A-Z]/u.test(info.R_PASSWORD),
    min: /[a-z]/u.test(info.password) || /[a-z]/u.test(info.R_PASSWORD),
    special: /[!@#$%^&*(),.?":{}|<>]/u.test(info.password) || /[!@#$%^&*(),.?":{}|<>]/u.test(info.R_PASSWORD),
    same: info.password === info.R_PASSWORD
})

export default validatePassword