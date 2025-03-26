interface LastMessage{
    message: any;
    id: number;
    role: string;
    lastMessage: {
        sender: string;
        text: string;
        date: string;
    };
    type: string;
    receiver: string;
}

export default LastMessage;
