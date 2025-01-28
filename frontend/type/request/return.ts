interface ReturnWithMessage {
    message: string;
}

interface ReturnWithErrors {
    errors: string;
}

interface ReturnWithToken {  
    token: string;
}
type Return = ReturnWithToken | ReturnWithMessage | ReturnWithErrors;

export default Return;