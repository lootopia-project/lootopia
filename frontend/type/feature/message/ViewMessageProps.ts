import Users from "@/type/feature/auth/users";
import Messages from "@/type/feature/message/message";

interface ViewMessageProps {
    messages: Messages[];
    user: Users|undefined
    usersConnected: Users|undefined;
    usersTalked: string;
    respondToExchange: (discussionKey: string, status: "accepted" | "rejected", messageId?: string) => void;
    cleanEmail: (email: string) => string;
}

export default ViewMessageProps;