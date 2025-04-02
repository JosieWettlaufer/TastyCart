import React, { useCallback, useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

const CheckoutForm = () => {
  // Define stripePromise
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    // Initialize Stripe promise with public test API key
    const promise = loadStripe(
      "pk_test_51R6n86KbzkDbosBfXKt2jyXnkUKkmcyvhavNOU2Wg831RUy9I5FWRBxo38iJqu0yk2RtH9s3ZyLAa5KLHcTVzyzq00xp9ZwXsp"
    );
    setStripePromise(promise);
  }, []);

  const fetchClientSecret = useCallback(() => {
    const token = localStorage.getItem("token");

    // Create a Checkout Session
    return fetch("http://localhost:5690/create-checkout-session", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to create checkout session");
        }
        return res.json();
      })
      .then((data) => data.clientSecret)
      .catch((error) => {
        console.error("Error creating checkout session:", error);
        alert("Error creating checkout session. Please try again.");
        // Redirect back to cart if there's an error
        window.location.href = "/cart";
      });
  }, []);

  //stores stripe embedded form configuration from api call
  const options = { fetchClientSecret };

  // Show loading state until Stripe is initialized
  if (!stripePromise) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading payment system...</span>
        </div>
        <p className="mt-2">Initializing payment system...</p>
      </div>
    );
  }

  return (
    //Renders Checkout form and provider with promise and configurations
    <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
};

export default CheckoutForm;
