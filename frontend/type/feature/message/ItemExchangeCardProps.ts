import Users from "../auth/users";

interface ItemExchangeCardProps {
    allItems: { id: number; name: string ,img: string }[];
    usersConnected: Users|undefined
    itemUser:{ id: number; name: string , quantity: number; img: string }[];
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