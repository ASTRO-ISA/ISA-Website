import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet-async";

interface Refund {
  _id: string;
  status: "pending_approval" | "initiated" | "success" | "failed" | "rejected";
  amount: number;
  approvedBy?: string;
  reason?: string;
  refundId: string;
}

interface Transaction {
  _id: string;
  orderId: string;
  status: string;
  user_id: string;
  amount: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  method: string;
  refunds: Refund[];
}

export default function AdminTransactions({ adminEmail = "admin@example.com" }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { toast } = useToast();

  const fetchTransactions = async () => {
    try {
      const res = await api.get("/phonepe/transactions");
      setTransactions(res.data.transactions || []);
    } catch (err) {
      console.error("Error fetching transactions", err);
      setTransactions([]);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Filter by date: YYYY-MM-DD
  const filteredTransactions = selectedDate
    ? transactions.filter(
        (t) => new Date(t.createdAt).toISOString().slice(0, 10) === selectedDate
      )
    : transactions;

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return "text-green-600 font-semibold";
      case "pending":
        return "text-yellow-600 font-semibold";
      case "failed":
        return "text-red-600 font-semibold";
      default:
        return "text-gray-600";
    }
  };

  // Request refund
  const handleRequestRefund = async (txnId: string, amount: number) => {
    try {
      await api.post(`/phonepe/request-refund/${txnId}`, { amount });
      alert("Refund requested successfully!");
      fetchTransactions(); // refresh data from backend
    } catch (err) {
      console.error(err);
      toast({
        title: "Something went wrong",
        description: err.response.data.message
      })
    }
  };

  // Approve refund
  const handleApproveRefund = async (txnId: string, refundId: string) => {
    try {
      await api.post(`/phonepe/approve-refund/${txnId}/${refundId}`, { approve: true });
      alert("Refund approved successfully!");
      fetchTransactions(); // refresh data from backend
    } catch (err) {
      console.error(err);
      toast({
        title: "Something went wrong.",
        description: err.response.data.message
      })
    }
  };

  const renderRefundButton = (txn: Transaction) => {
    if (!txn.refunds || txn.refunds.length === 0) {
      // No refund yet
      if (txn.status.toLowerCase() === "success") {
        return (
          <button
            onClick={() => handleRequestRefund(txn.orderId, txn.amount)}
            className="underline text-yellow-600"
          >
            Request Refund
          </button>
        );
      }
    } else {
      // Refund exists
      const refund = txn.refunds[0]; // single refund per txn
      switch (refund.status) {
        case "pending_approval":
          return (
            <button
              onClick={() => handleApproveRefund(txn.orderId, refund.refundId)}
              className="underline text-blue-600"
            >
              Approve Refund
            </button>
          );
        case "initiated":
          return <span className="text-yellow-600 font-semibold">Initiated</span>;
        case "success":
          return <span className="text-green-600 font-semibold">Refunded</span>;
        case "failed":
        case "rejected":
          return <span className="text-red-600 font-semibold">Failed</span>;
        default:
          return "-";
      }
    }

    return "-";
  };

  return (
    <div className="relative bg-gray-50 text-gray-900 font-sans rounded-xl">
      <Helmet>
        <title>Admin: Transactions | ISA-India</title>
        <meta name="description" content="Admin page for managing transactions." />
      </Helmet>
      {/* Background watermark */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] flex flex-wrap justify-center items-center text-xl font-bold text-gray-300/60 rotate-[-20deg]">
          {Array(100)
            .fill(adminEmail)
            .map((email, i) => (
              <span key={i} className="px-10 py-5">
                {email}
              </span>
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

        {/* Transactions Table - Desktop */}
        {filteredTransactions.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            No transactions found for selected date.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto hidden md:block">
              <table className="min-w-full border border-gray-300 rounded">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border-b text-left">Order ID</th>
                    <th className="px-4 py-2 border-b text-left">Status</th>
                    <th className="px-4 py-2 border-b text-left">User ID</th>
                    <th className="px-4 py-2 border-b text-left">Amount</th>
                    <th className="px-4 py-2 border-b text-left">Currency</th>
                    <th className="px-4 py-2 border-b text-left">Refund</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((txn) => (
                    <tr key={txn._id}>
                      <td className="px-4 py-2 border-b">{txn.orderId}</td>
                      <td className={`px-4 py-2 border-b ${getStatusClass(txn.status)}`}>
                        {txn.status}
                      </td>
                      <td className="px-4 py-2 border-b">{txn.user_id}</td>
                      <td className="px-4 py-2 border-b">₹{txn.amount}</td>
                      <td className="px-4 py-2 border-b">{txn.currency}</td>
                      <td className="px-4 py-2 border-b">{renderRefundButton(txn)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-4">
              {filteredTransactions.map((txn) => (
                <div
                  key={txn._id}
                  className="bg-white shadow rounded p-4 border border-gray-200"
                >
                  <p>
                    <span className="font-semibold">Order ID:</span> {txn.orderId}
                  </p>
                  <p className={getStatusClass(txn.status)}>
                    <span className="font-semibold">Status:</span> {txn.status}
                  </p>
                  <p>
                    <span className="font-semibold">User ID:</span> {txn.user_id}
                  </p>
                  <p>
                    <span className="font-semibold">Amount:</span> ₹{txn.amount}{" "}
                    {txn.currency}
                  </p>
                  <p>
                    <span className="font-semibold">Refund:</span>{" "}
                    {renderRefundButton(txn)}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}