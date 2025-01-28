interface AXIOS_ERROR {
    message: string
    name : string
    status: number
    frames : NonNullable<unknown>[]
}
export default AXIOS_ERROR