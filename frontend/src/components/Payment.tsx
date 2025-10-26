import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Leaf, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Message({ content, type }) {
  return (
    <div
      className={`flex items-center p-4 rounded-lg text-white ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {type === "success" ? (
        <CheckCircle className="w-5 h-5 mr-2" />
      ) : (
        <XCircle className="w-5 h-5 mr-2" />
      )}
      <p>{content}</p>
    </div>
  );
}

function Payment({ amountInfo }) {
  const initialOptions = {
    "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
    "enable-funding": "venmo",
    "buyer-country": "US",
    currency: "USD",
    components: "buttons",
  };

  const server = import.meta.env.VITE_BACKEND_URL;
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  let userPaymentId = null;
  const navigate = useNavigate();

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-xl border border-green-300">
      <div className="flex items-center mb-4">
        <Leaf className="w-8 h-8 text-green-600 mr-2" />
        <h2 className="text-xl font-bold text-green-700">Secure Payment</h2>
      </div>
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          style={{
            shape: "rect",
            layout: "vertical",
            color: "gold",
            label: "paypal",
          }}
          createOrder={async () => {
            try {
              const response = await fetch(`${server}/payment/rechargeAccountCreate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: amountInfo ? JSON.stringify(amountInfo) : null,
              });
              const orderData = await response.json();
              userPaymentId = orderData.userPaymentId;
              if (orderData.id) return orderData.id;
              throw new Error(
                orderData.details?.[0]?.description || JSON.stringify(orderData)
              );
            } catch (error) {
              // console.error(error);
              setMessage(
                `Could not initiate PayPal Checkout: ${error.message}`
              );
              setMessageType("error");
            }
          }}
          onApprove={async (data, actions) => {
            try {
              const response = await fetch(`${server}/payment/rechargeAccountComplete`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                  userPaymentId: userPaymentId,
                  paypalOrderId: data.orderID,
                }),
              });
              const orderData = await response.json();
              if (orderData.details?.[0]?.issue === "INSTRUMENT_DECLINED")
                return actions.restart();
              if (orderData.details?.[0])
                throw new Error(orderData.details[0].description);

              // navigate("/order-success");
              
              setMessageType("success");
            } catch (error) {
              // console.error(error);
              setMessage(`Transaction failed: ${error.message}`);
              setMessageType("error");
            }
          }}
        />
      </PayPalScriptProvider>
      {message && <Message content={message} type={messageType} />}
    </div>
  );
}

export default Payment;