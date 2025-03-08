interface Item {
    id: number;
    name: string;
    price: number;
    img: string;
    description: string;
  }
  
  interface OrderItem {
    item: Item;
    price: number;
  }
  
  interface OrderDetail {
    id: number;
    status: string;
    createdAt: string;
    ordersItem: OrderItem[];
  }

  export default OrderDetail;