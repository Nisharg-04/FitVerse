import React from "react";

const Transactions: React.FC = () => {
  // Placeholder: Replace with real data fetching
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
      <ul className="space-y-2">
        <li>TXN123 - ₹2000 - 2025-08-22</li>
        <li>TXN124 - ₹1500 - 2025-08-21</li>
        <li>TXN125 - ₹3500 - 2025-08-20</li>
      </ul>
    </div>
  );
};

export default Transactions;
