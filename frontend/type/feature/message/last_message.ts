interface LastMessage {
    id: number;
    role: string;
    lastMessage: {
        sender: string;
        text: string;
        date: string;
    };
}

export default LastMessage;
