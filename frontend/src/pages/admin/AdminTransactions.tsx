import { useState } from "react";

// Temporary transaction data
const tempTransactions = [
  {
    transactionId: "TXN123456",
    status: "success",
    username: "Vinod",
    email: "vinod@example.com",
    mobile: "9876543210",
    amount: 1000,
    date: "2025-09-14",
  },
  {
    transactionId: "TXN123457",
    status: "pending",
    username: "Poorvi",
    email: "poorvi@example.com",
    mobile: "9876501234",
    amount: 500,
    date: "2025-09-14",
  },
  {
    transactionId: "TXN123458",
    status: "failed",
    username: "Suyash",
    email: "suyash@example.com",
    mobile: "9876512345",
    amount: 1500,
    date: "2025-09-13",
  },
];

export default function AdminTransactions({ adminEmail = "admin@example.com" }) {
  const [selectedDate, setSelectedDate] = useState("");

  // Filter transactions by date
  const filteredTransactions = selectedDate
    ? tempTransactions.filter((t) => t.date === selectedDate)
    : tempTransactions;

  const handleRefund = (txnId) => {
    alert(`Refund triggered for ${txnId}`);
  };

  return (
    <div className="relative bg-gray-50 text-gray-900 font-sans rounded-xl">
      {/* Background watermark */}
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
    <div
        className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] flex flex-wrap justify-center items-center text-xl font-bold text-gray-300/60 rotate-[-20deg]"
    >
        {Array(100).fill(adminEmail).map((email, i) => (
        <span key={i} className="px-10 py-5">{email}</span>
        ))}
    </div>
    </div>

      <main className="relative z-10 container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Transactions</h1>

        {/* Date picker */}
        <div className="mb-6">
          <label className="mr-4 font-medium">Filter by Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1"
          />
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border-b text-left">Transaction ID</th>
                <th className="px-4 py-2 border-b text-left">Status</th>
                <th className="px-4 py-2 border-b text-left">Username</th>
                <th className="px-4 py-2 border-b text-left">Email</th>
                <th className="px-4 py-2 border-b text-left">Mobile</th>
                <th className="px-4 py-2 border-b text-left">Amount</th>
                <th className="px-4 py-2 border-b text-left">Refund</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((txn) => (
                  <tr key={txn.transactionId}>
                    <td className="px-4 py-2 border-b">{txn.transactionId}</td>
                    <td className="px-4 py-2 border-b capitalize">{txn.status}</td>
                    <td className="px-4 py-2 border-b">{txn.username}</td>
                    <td className="px-4 py-2 border-b">{txn.email}</td>
                    <td className="px-4 py-2 border-b">{txn.mobile}</td>
                    <td className="px-4 py-2 border-b">₹{txn.amount}</td>
                    <td className="px-4 py-2 border-b">
                      {txn.status === "success" ? (
                        <button
                          onClick={() => handleRefund(txn.transactionId)}
                          className="underline text-red-600"
                        >
                          Refund
                        </button>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}