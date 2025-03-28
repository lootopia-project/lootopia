import Users from "@/type/feature/auth/users";
import Messages from "@/type/feature/message/message";
import Return from "@/type/request/return";

interface ViewMessageProps {
    messages: Messages[];
    user: Users|undefined
    usersConnected: Users|undefined;
    usersTalked: string;
    respondToExchange: (discussionKey: string, status: "accepted" | "rejected", messageId?: string) => Promise<{ success: boolean; message?: any } | undefined>;
    cleanEmail: (email: string) => string;
}

export default ViewMessageProps;