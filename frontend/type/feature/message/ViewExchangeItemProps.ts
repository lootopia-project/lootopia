import Users from "../auth/users";
import Item from "../shop/item";
import ItemUsers from "./itemUsers";
import Messages from "./message";

interface ViewExchangeItemProps {
    itemUser: ItemUsers[];
    allItems: { id: number; name: string , img: string }[];
    usersConnected: Users|undefined;
    usersTalked: string;
    i18n: { t: (key: string) => string };
    cleanEmail: (email: string) => string;
    setText: (text: string) => void;
    setErrorMessage: (message: string) => void;
    setErrorVisible: (visible: boolean) => void;
    setShowItemModal: (visible: boolean) => void;
    showItemModal: boolean;
    setMessages: (messages: Messages[]) => void;
  }

  export default ViewExchangeItemProps;