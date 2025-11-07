import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Wallet, CheckCircle, XCircle, Lock, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

function Message({ content, type }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`flex items-center p-4 rounded-lg text-white font-semibold ${
        type === "success"
          ? "bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/50"
          : "bg-gradient-to-r from-red-500 to-rose-600 shadow-lg shadow-red-500/50"
      }`}
    >
      {type === "success" ? (
        <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0" />
      ) : (
        <XCircle className="w-6 h-6 mr-3 flex-shrink-0" />
      )}
      <p>{content}</p>
    </motion.div>
  );
}

function Payment({ amountInfo }) {
  const initialOptions = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
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
    <div className="w-full max-w-md mx-auto">
      {/* Main Payment Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="relative overflow-hidden bg-gradient-to-br from-background via-background/95 to-background/90 border border-primary/20 shadow-2xl">
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-secondary/20 rounded-full blur-3xl" />
          </div>

          {/* Content */}
          <div className="relative p-8 space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Wallet Recharge
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Secure payment via PayPal
                  </p>
                </div>
              </div>
            </div>

            {/* Amount Display */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-6 text-center space-y-2"
            >
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Recharge Amount
              </p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  ₹{amountInfo?.amount || 0}
                </span>
              </div>
              <p className="text-xs text-muted-foreground pt-2">
                This amount will be added to your wallet balance
              </p>
            </motion.div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border/50">
                <Lock className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-xs font-medium">Secure Payment</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border/50">
                <Zap className="w-4 h-4 text-secondary flex-shrink-0" />
                <span className="text-xs font-medium">Instant Credit</span>
              </div>
            </div>

            {/* PayPal Button Container */}
            <div className="space-y-4">
              <div className="relative">
                <PayPalScriptProvider options={initialOptions}>
                  <PayPalButtons
                    style={{
                      shape: "rect",
                      layout: "vertical",
                      color: "gold",
                      label: "paypal",
                      height: 45,
                    }}
                    createOrder={async () => {
                      try {
                        const response = await fetch(
                          `${server}/payment/rechargeAccountCreate`,
                          {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            credentials: "include",
                            body: amountInfo
                              ? JSON.stringify(amountInfo)
                              : null,
                          }
                        );
                        const orderData = await response.json();
                        userPaymentId = orderData.userPaymentId;
                        if (orderData.id) return orderData.id;
                        throw new Error(
                          orderData.details?.[0]?.description ||
                            JSON.stringify(orderData)
                        );
                      } catch (error) {
                        setMessage(
                          `Could not initiate PayPal Checkout: ${
                            (error as Error).message
                          }`
                        );
                        setMessageType("error");
                      }
                    }}
                    onApprove={async (data, actions) => {
                      try {
                        const response = await fetch(
                          `${server}/payment/rechargeAccountComplete`,
                          {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            credentials: "include",
                            body: JSON.stringify({
                              userPaymentId: userPaymentId,
                              paypalOrderId: data.orderID,
                            }),
                          }
                        );
                        const orderData = await response.json();
                        if (
                          orderData.details?.[0]?.issue ===
                          "INSTRUMENT_DECLINED"
                        )
                          return actions.restart?.();
                        if (orderData.details?.[0])
                          throw new Error(orderData.details[0].description);

                        setMessageType("success");
                      } catch (error) {
                        setMessage(
                          `Transaction failed: ${(error as Error).message}`
                        );
                        setMessageType("error");
                      }
                    }}
                  />
                </PayPalScriptProvider>
              </div>

              {/* Info Text */}
              <p className="text-xs text-center text-muted-foreground">
                By proceeding, you agree to our payment terms. Your transaction
                is encrypted and secure.
              </p>
            </div>

            {/* Message Display */}
            {message && <Message content={message} type={messageType} />}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

export default Payment;
