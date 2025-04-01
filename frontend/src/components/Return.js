//Stripe imports
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";


const Return = () => {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState('');
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');
    
    console.log("Return component mounted, session ID:", sessionId);
    
    // Fetch session status
    if (sessionId) {
      fetch(`http://localhost:5690/session-status?session_id=${sessionId}`)
        .then(res => {
          console.log("Response status:", res.status);
          return res.json();
        })
        .then(data => {
          console.log("Session data:", data);
          setStatus(data.status);
          setCustomerEmail(data.customer_email);
          setOrder(data.order);
        })
        .catch(err => {
          console.error("Error fetching session:", err);
        });
    } else {
      console.warn("No session ID found in URL");
    }
}, []);

if (status === 'open') {
  return (
    <Navigate to="/checkout" />
  )
}

if (status === 'complete') {
  return (
    <section id="success">
      <p>
            We appreciate your business! A confirmation email will be sent to {customerEmail}.
            {order && (
              <div className="mt-3">
                <h4>Order Details:</h4>
                <p>Order Items:</p> 
                <ul>
                  {order.orderItems.products.map((item, index) => (
                    <li key={index}>
                      {item.productName || "product" - item.price?.toFixed(2) || "0.00"}
                      {item.quantity > 1 ? `(Qty: ${item.quantity})` : ""}
                    </li>
                  ))}
                </ul>
                <p>shipping Address: {order.shippingAddress || ""}</p>
                <p>payment Method: {order.paymentMethod || ""}</p>
                <p>Total: ${order.totalPrice?.toFixed(2) || "0.00"}</p>
                <p>Paid at: {order.paidAt || ""}</p>
              </div>
            )}
            If you have any questions, please email <a href="mailto:orders@example.com">orders@example.com</a>.
          </p>
    </section>
  )
}

return null;
}

export default Return;