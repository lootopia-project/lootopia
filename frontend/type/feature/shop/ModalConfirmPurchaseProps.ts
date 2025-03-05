import Item from "./item";

interface ModalConfirmPurchaseProps {
    confirmModalVisible: boolean;
      setConfirmModalVisible: (value: boolean) => void;
      cart: Item[];
      confirmPurchase: () => void;
  }

  export default ModalConfirmPurchaseProps;