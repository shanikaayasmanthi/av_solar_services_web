import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { BASE_URL } from "../constants/BaseUrl.jsx";

const PaymentStatusCard = ({ projectId }) => {
  const { token } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPayments = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}api/projects/${projectId}/payments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setPayments(response.data.data);
      } else {
        // Handle case where no payments are found but API returns success: false
        setPayments([]);
        setError("No payments found for this project.");
      }
    } catch (err) {
      console.error("Error fetching payments:", err);
      // Check if it's a 404 error (no payments found)
      if (err.response && err.response.status === 404) {
        setPayments([]);
        setError("No payments found for this project.");
      } else {
        setError("Failed to fetch payment status.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [projectId]);

  // Format currency values as Sri Lankan Rupees (LKR)
  const formatCurrency = (value) => {
    if (value === null || value === undefined || value === "N/A") return "N/A";
    
    // Convert to number if it's a string
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    
    // Format with commas for thousands and two decimal places
    return `Rs ${numericValue.toLocaleString('en-LK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-300 p-5 flex-1 w-full">
      <h3 className="text-lg font-semibold mb-3">Payment Status</h3>

      {loading ? (
        <p>Loading payment data...</p>
      ) : error ? (
        <p className="text-gray-500">{error}</p>
      ) : payments.length > 0 ? (
    <div className="overflow-x-auto">
  <table className="min-w-full border-collapse border border-gray-300 rounded-lg">
    <thead>
      <tr className="bg-gray-100">
        <th className="border border-gray-300 p-2 text-left text-sm font-semibold text-gray-700 w-1/8">Total Payment</th>
        <th className="border border-gray-300 p-2 text-left text-sm font-semibold text-gray-700 w-1/8">Paid Amount</th>
        <th className="border border-gray-300 p-2 text-left text-sm font-semibold text-gray-700 w-1/8">Due Payment</th>
        <th className="border border-gray-300 p-2 text-left text-sm font-semibold text-gray-700 w-1/2">Notes</th>
      </tr>
    </thead>
    <tbody>
      {payments.map((payment) => (
        <tr key={payment.id} className="hover:bg-gray-50 transition-colors duration-200">
          <td className="border border-gray-300 p-2 text-gray-600 font-semibold">{formatCurrency(payment.total_payment)}</td>
          <td className="border border-gray-300 p-2 text-green-600 font-semibold">{formatCurrency(payment.paid_amount)}</td>
          <td className="border border-gray-300 p-2 text-red-600 font-semibold">{formatCurrency(payment.due_payment)}</td>
          <td className="border border-gray-300 p-2 text-gray-600 font-semibold">{payment.payment_notes || '—'}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
      ) : (
        <p>No payments recorded for this project.</p>
      )}
    </div>
  );
};

export default PaymentStatusCard;