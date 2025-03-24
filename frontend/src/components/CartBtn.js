import { useNavigate } from "react-router-dom";

function CartBtn() {
  const navigate = useNavigate();
  const cartId = "67de7c326f247b305478d9a2"; // Example cart ID

  return (
    <button className="btn btn-success" onClick={() => navigate(`/cart/${cartId}`)}>Go to Cart</button>
  );
}

export default CartBtn;