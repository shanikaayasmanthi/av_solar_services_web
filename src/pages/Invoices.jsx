import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { BASE_URL } from "../constants/BaseUrl";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { Visibility } from "@mui/icons-material";
import FileDownloadSharpIcon from "@mui/icons-material/FileDownloadSharp";

export const Invoices = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [searchQuery,setSearchQuery] = useState(null);

  useEffect(() => {
    fetchInvoices(1); // Call with initial page
  }, [token, itemsPerPage,searchQuery]);

  const fetchInvoices = async (page = 1) => {
    setLoading(true);
    try {
        const params = {
      page,
      per_page: itemsPerPage,
    };

    // Only add the query param if searchQuery actually has text
    if (searchQuery && searchQuery.trim() !== "") {
      params.query = searchQuery;
    }
      const response = await axios.get(
        `${BASE_URL}api/invoices`,
        {
            params,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      /* Laravel Paginate Structure:
       response.data -> standard wrapper
       response.data.data -> The Paginator Object
       response.data.data.data -> The actual Array of Invoices
    */
      const paginator = response.data.data;

      setInvoices(paginator.data || []); // Ensure it's an array to avoid .length error
      setMeta({
        current_page: paginator.current_page,
        last_page: paginator.last_page,
        total: paginator.total,
      });
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setInvoices([]); // Fallback to empty array
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <div className="origin-top-left scale-[0.85] w-[117%]">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Invoices</h1>
          <div className="flex gap-3">
            <div className="relative">
                <input
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text"
                  placeholder="Search"
                  className="w-64 px-4 py-2 pl-10 text-gray-700 bg-gray-100 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <svg
                  className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              <button
            onClick={() => navigate("/addinvoice")}
            className="flex items-center gap-2 px-4 py-2 text-sm text-white transition-all bg-teal-600 rounded-md shadow-md hover:bg-teal-700"
          >
            <AddIcon /> New Invoice
          </button>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="mx-5 origin-top-left ">
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead>
              <tr className="text-xs tracking-wider text-left text-gray-500 uppercase">
                <th className="p-4 font-semibold text-gray-700">Invoice No</th>
                <th className="p-4 font-semibold text-gray-700">Customer</th>
                <th className="p-4 font-semibold text-gray-700">Project No</th>
                <th className="p-4 font-semibold text-gray-700">Date</th>
                <th className="p-4 font-semibold text-gray-700">Amount</th>
                <th className="p-4 font-semibold text-gray-700">Discount</th>
                <th className="p-4 font-semibold text-gray-700">Total</th>
                <th className="p-4 font-semibold text-gray-700">Issued By</th>
                <th className="p-4 font-semibold text-center text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-gray-500">
                    Loading invoices...
                  </td>
                </tr>
              ) : invoices.length > 0 ? (
                invoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer  gap-2"
                  >
                    <td className="p-4 font-medium text-teal-700">
                      {inv.invoice_no}
                    </td>
                    <td className="p-4 text-gray-700">{inv.customer}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 font-mono text-xs text-gray-600 bg-gray-100 rounded">
                        {inv.project_no}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">{inv.date}</td>
                    <td className="p-4 text-gray-600">Rs {inv.amount}</td>
                    <td className="p-4 text-gray-600">Rs {inv.discount}</td>
                    <td className="p-4 text-gray-600">Rs {inv.total}</td>
                    <td className="p-4 text-gray-600">{inv.issued_by}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center gap-4">
                        <div className="relative inline-block group">
                          <button
                            onClick={() => navigate(`/invoices/view/${inv.id}`)}
                            className="font-medium text-teal-600 transition-colors hover:text-teal-800"
                          >
                            <Visibility />
                          </button>
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-[9999]">
                            <span className="bg-gray-800 text-white text-[11px] px-2 py-1 rounded shadow-xl whitespace-nowrap">
                              View Invoice
                            </span>
                            <div className="w-2 h-2 -mt-1 rotate-45 bg-gray-800"></div>
                          </div>
                        </div>

                        <div className="relative inline-block group">
                          <button
                            onClick={() => navigate(`/invoices/view/${inv.id}`)}
                            className="font-medium text-teal-600 transition-colors hover:text-teal-800"
                          >
                            <FileDownloadSharpIcon />
                          </button>
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-[9999]">
                            <span className="bg-gray-800 text-white text-[11px] px-2 py-1 rounded shadow-xl whitespace-nowrap">
                              Download PDF
                            </span>
                            <div className="w-2 h-2 -mt-1 rotate-45 bg-gray-800"></div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="pt-10 text-xs text-center text-gray-500"
                  >
                    No invoices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Add this after your </table> </div> */}
        <div className="flex items-center justify-end px-5 mt-4">
          <div className="flex gap-2">
            {/* Items Per Page Selector */}
            <div className="flex items-center content-center justify-end gap-4 right-20">
              <span className="text-sm text-gray-600">Items per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  handlePageChange(1); // Reset to first page on items per page change
                }}
                className="p-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                {[8, 10, 15, 20, 25].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <button
              disabled={meta.current_page === 1}
              onClick={() => fetchInvoices(meta.current_page - 1)}
              className="px-4 py-2 mx-2 text-white transition-colors bg-teal-500 rounded disabled:opacity-50 hover:bg-teal-600"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              {meta.current_page} / {meta.last_page}
            </span>
            <button
              disabled={meta.current_page === meta.last_page}
              onClick={() => fetchInvoices(meta.current_page + 1)}
              className="px-4 py-2 mx-2 text-white transition-colors bg-teal-500 rounded disabled:opacity-50 hover:bg-teal-600"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
