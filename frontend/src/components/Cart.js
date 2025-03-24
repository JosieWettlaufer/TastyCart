import { useParams } from "react-router-dom";

function Cart() {
  const { cartId } = useParams();

  return <h1>Cart ID: {cartId}</h1>;
}

export default Cart;
