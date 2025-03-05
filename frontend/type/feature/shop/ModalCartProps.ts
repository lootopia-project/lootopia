import Item from "./item";

interface ModalCartProps {

    cartVisible: boolean;
    setCartVisible: (value: boolean) => void;
    cart:Item[];
    removeFromCart: (itemId: number) => void;
    openConfirmModal: () => void;
}

export default ModalCartProps;