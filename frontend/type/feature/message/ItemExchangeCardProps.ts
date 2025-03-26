import Users from "../auth/users";

interface ItemExchangeCardProps {
    item: { id: number; name: string; quantity: number; img: string };
    allItems: { id: number; name: string }[];
    usersConnected: Users;
    usersTalked: string;
    i18n: { t: (key: string) => string };
    cleanEmail: (email: string) => string;
    setText: (text: string) => void;
    setErrorMessage: (message: string) => void;
    setErrorVisible: (visible: boolean) => void;
    setShowItemModal: (visible: boolean) => void;
    setMessages: (messages: any) => void;
}
export default ItemExchangeCardProps;  