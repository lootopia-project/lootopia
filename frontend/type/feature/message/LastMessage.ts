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
}

export default LastMessage;
