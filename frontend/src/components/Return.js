//Stripe imports
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

//Returns order confirmation and sends email
const Return = () => {
  const [info, setInfo] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');
    
    // Fetch session status, customer email, and current order
    if (sessionId) {
      fetch(`http://localhost:5690/session-status?session_id=${sessionId}`)
        .then(res => {
          console.log("Response status:", res.status);
          return res.json();
        })
        .then(data => {
          console.log("Session data:", data);
          setStatus(data.status);
          setInfo({
            status: data.status,
            customerEmail: data.customer_email,
            orderData: data.order
          })
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
    <section id="success" className="container mt-5">
    <div className="card shadow">
      <div className="card-header bg-success text-white">
        <h2 className="mb-0">Order Successful!</h2>
      </div>
      
      <div className="card-body">
        <div className="alert alert-success" role="alert">
          Thank you for your purchase! A confirmation email will be sent to {info.customerEmail}.
        </div>

        {info.orderData && (
          <div className="mt-3">
            <h4 className="card-title border-bottom pb-2">Order Details</h4>
            
            <div className="row mt-4">
              <div className="col-md-6">
                <h5>Order Items:</h5> 
                <ul className="list-group mb-3">
                  {info.orderData.orderItems.products.map((item, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      <span>
                        {item.productName || "Product"}
                        {item.quantity > 1 && <span className="badge bg-secondary ms-2">Qty: {item.quantity}</span>}
                      </span>
                      <span className="fw-bold">${item.price?.toFixed(2) || "0.00"}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="col-md-6">
                <div className="card bg-light">
                  <div className="card-body">
                    <h5 className="card-title">Order Summary</h5>
                    <p className="card-text"><strong>Shipping Address:</strong> {info.orderData.shippingAddress || "Not provided"}</p>
                    <p className="card-text"><strong>Payment Method:</strong> {info.orderData.paymentMethod || "Credit Card"}</p>
                    <p className="card-text"><strong>Order Date:</strong> {new Date(info.orderData.paidAt).toLocaleDateString() || ""}</p>
                    <h5 className="card-text text-end mt-4">Total: <span className="text-success">${info.orderData.totalPrice?.toFixed(2) || "0.00"}</span></h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-4 text-center">
          <p>If you have any questions, please email <a href="mailto:orders@example.com" className="text-decoration-none">orders@example.com</a>.</p>
          <a href="/productspage" className="btn btn-primary mt-2">Continue Shopping</a>
        </div>
      </div>
    </div>
  </section>
  )
}

return null;
}

export default Return;