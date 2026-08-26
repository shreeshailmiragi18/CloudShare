// import DashboardLayout from "../layout/DashboardLayout";
// import { useState, useEffect } from "react";
// import { useAuth } from "@clerk/clerk-react";
// import { AlertCircle, Loader2, Receipt } from "lucide-react";
// import axios from "axios";
// const Transactions = () => {
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const { getToken } = useAuth();

//   useEffect(() => {
//     const fetchTransactions = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const token = await getToken();

//         const response = await axios.get(
//           "http://localhost:8080/api/v1.0/transactions",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           },
//         );

//         console.log("Transactions response:", response.data);

//         setTransactions(response.data);
//       } catch (err) {
//         console.error(
//           "Error fetching transactions:",
//           err.response?.data || err.message,
//         );

//         setError(
//           err.response?.data?.message ||
//             "An error occurred while fetching transactions",
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTransactions();
//   }, [getToken]);

//   const formatDate = (dateString) => {
//     const options = {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   const formatAmount = (amount) => {
//     return `₹${(amount / 100).toFixed(2)}`;
//   };

//   return (
//     <DashboardLayout activeMenu="Transactions">
//       <div className="p-6">
//         <div className="flex items-center gap-2 mb-6">
//           <Receipt className="text-blue-600" />
//           <h1 className="text-2xl font-bold">Transaction History</h1>
//         </div>
//         {error && (
//           <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
//             <AlertCircle size={20} />
//             <span>{error}</span>
//           </div>
//         )}
//         {loading ? (
//           <div className="flex items-center justify-center h-64">
//             <Loader2 className="animate-spin mr-2" size={24} />
//             <span>Loading transactions...</span>
//           </div>
//         ) : transactions.length === 0 ? (
//           <div className="bg-gray-50 p-8 rounded-lg text-center">
//             <Receipt className="mx-auto mb-4 text-gray-400" size={48} />
//             <h3 className="text-lg font-medium text-gray-700 mb-2">
//               No transactions found
//             </h3>
//             <p className="text">
//               You haven't made any credit purchases yet. Start exploring our
//               products and make your first purchase today!
//             </p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full bg-white rounded-lg over">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Date
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Plan
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Amount
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Credits Added
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Payment ID
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {transactions.map((transaction) => (
//                   <tr key={transaction.id}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {formatDate(transaction.createdAt)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {transaction.plan}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {formatAmount(transaction.amount)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {transaction.creditsAdded}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {transaction.paymentId}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </DashboardLayout>
//   );
// };

// export default Transactions;

import DashboardLayout from "../layout/DashboardLayout";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { AlertCircle, Loader2, Receipt } from "lucide-react";
import axios from "axios";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { getToken } = useAuth();

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = await getToken();

        const response = await axios.get(
          "http://localhost:8080/api/v1.0/transactions",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        console.log("Transactions:", response.data);

        setTransactions(response.data);
      } catch (err) {
        console.error(
          "Error fetching transactions:",
          err.response?.data || err.message,
        );

        setError(
          err.response?.data?.message ||
            "An error occurred while fetching transactions",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [getToken]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";

    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };

    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatAmount = (amount) => {
    if (amount === null || amount === undefined) return "-";

    return `₹${(amount / 100).toFixed(2)}`;
  };

  return (
    <DashboardLayout activeMenu="Transactions">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-xl bg-purple-100">
            <Receipt className="text-purple-600" size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Transaction History
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              View all your credit purchase transactions.
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-center gap-3">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="animate-spin text-purple-600 mb-3" size={32} />

            <span className="text-gray-500">Loading transactions...</span>
          </div>
        ) : transactions.length === 0 ? (
          /* Empty State */
          <div className="bg-gray-50 border border-gray-100 p-10 rounded-2xl text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white flex items-center justify-center shadow-sm">
              <Receipt className="text-gray-400" size={32} />
            </div>

            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No transactions found
            </h3>

            <p className="text-gray-500 text-sm">
              You haven't made any credit purchases yet. Your transactions will
              appear here after your first successful purchase.
            </p>
          </div>
        ) : (
          /* Transactions Table */
          <div className="overflow-x-auto bg-white border border-gray-200 rounded-2xl shadow-sm">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Credits Added
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Payment ID
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id || transaction.orderId}
                    className="hover:bg-purple-50/40 transition-colors"
                  >
                    {/* Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatDate(transaction.transactionDate)}
                    </td>

                    {/* Plan */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold uppercase">
                        {transaction.planId || "-"}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatAmount(transaction.amount)}
                    </td>

                    {/* Credits */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="font-semibold text-green-600">
                        +{transaction.creditsAdded || 0}
                      </span>
                    </td>

                    {/* Payment ID */}
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {transaction.paymentId || "Pending"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Transactions;
