interface ReturnWithMessage {
    message: string;
}

interface ReturnWithErrors {
    errors: string;
}

interface ReturnWithToken {
    token: string;
}

interface returnWIthBooleanAndMessage {
    message: string;
    success: boolean;
}
type Return = ReturnWithToken | ReturnWithMessage | ReturnWithErrors| returnWIthBooleanAndMessage;

export default Return;
