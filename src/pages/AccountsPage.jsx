import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import EditDocumentIcon from "@mui/icons-material/EditDocument";
import SearchIcon from "@mui/icons-material/Search";
import { BASE_URL } from "../constants/BaseUrl.jsx";

const AccountsPage = () => {
  const { token } = useAuth();

  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editPayment, setEditPayment] = useState(null);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState(""); // Separate state for input field

  const fetchPayments = async (pageNo = 1, search = "") => {
    try {
      const response = await axios.get(
        `${BASE_URL}api/projects/payments?page=${pageNo}&per_page=10&search=${search}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setProjects(response.data.data);
        setPage(response.data.meta.current_page);
        setLastPage(response.data.meta.last_page);
      }
    } catch (error) {
      console.error("Error fetching payment data:", error);
    }
  };

  // Handle search submission
  const handleSearch = () => {
    setPage(1); // Reset to first page when searching
    setSearchTerm(searchInput);
  };

  // Handle Enter key in search input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Clear search and reset to first page
  const handleClearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
    setPage(1);
  };

  useEffect(() => {
    fetchPayments(page, searchTerm);
  }, [page, searchTerm]);

  const formatCurrency = (amount) =>
    `Rs ${parseFloat(amount).toLocaleString("en-LK")}`;

  const handleSavePayment = async () => {
    try {
      const url = editPayment.id
        ? `${BASE_URL}api/payments/${editPayment.id}`
        : `${BASE_URL}api/projects/${editPayment.project_id}/payments`;

      const method = editPayment.id ? "put" : "post";

      await axios[method](
        url,
        {
          project_id: editPayment.project_id,
          total: editPayment.total,
          paid: editPayment.paid,
          due: editPayment.due,
          notes: editPayment.notes || "",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShowModal(false);
      fetchPayments(page, searchTerm); // refresh with current search term
    } catch (error) {
      console.error("Error saving payment:", error);
    }
  };

  // Remove client-side filtering since backend handles it
  const displayedProjects = projects;

  return (
    <>
    <div className="origin-top-left scale-[0.75] w-[133.33%] max-h-[70vh]">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Payments Dashboard</h1>
        
        {/* Search Input */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by project no, name, customer..."
              className="w-80 px-15 py-2 pl-10 text-gray-700 bg-gray-100 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
              <SearchIcon />
            </div>
          </div>
          
          {/* Search Button */}
          {/* <button
            onClick={handleSearch}
            className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"
          > */}
            {/* Search
          </button>
           */}
          {/* Clear Button (show only when there's a search term) */}
          {/* {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Clear
            </button>
          )} */}
        </div>
      </div>

      {/* Search Status */}
      {searchTerm && (
        <div className="mb-4 p-3 bg-teal-50 border border-teal-200 rounded-md">
          <p className="text-teal-700">
            Showing results for: "<strong>{searchTerm}</strong>"
            <button 
              onClick={handleClearSearch}
              className="ml-2 text-teal-600 hover:text-teal-800 underline"
            >
              Clear search
            </button>
          </p>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full border-collapse border border-gray-400">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-400 px-1 py-2 w-1/17">Project No</th>
              <th className="border border-gray-400 px-4 py-2 w-3/17">Project Name</th>
              <th className="border border-gray-400 px-4 py-2 w-3/17">Customer Name</th>
              <th className="border border-gray-400 px-2 py-2 w-2/17">Total Payment</th>
              <th className="border border-gray-400 px-2 py-2 w-2/17">Paid Amount</th>
              <th className="border border-gray-400 px-2 py-2 w-2/17">Due Amount</th>
              <th className="border border-gray-400 px-4 py-2 w-3/17">Notes</th>
              <th className="border border-gray-400 px-1 py-2 w-1/17">Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedProjects.map((proj, index) => (
              <tr key={index} className="text-center">
                <td className="border border-gray-400 px-1 py-2 w-1/17">{proj.project_no || "-"}</td>
                <td className="border border-gray-400 px-4 py-2 w-3/17">{proj.project_name}</td>
                <td className="border border-gray-400 px-4 py-2 w-3/17">{proj.customer_name}</td>
                <td className="border border-gray-400 px-2 py-2 w-2/17">{formatCurrency(proj.payment.total)}</td>
                <td className="border border-gray-400 px-2 py-2 w-2/17">{formatCurrency(proj.payment.paid)}</td>
                <td className="border border-gray-400 px-2 py-2 w-2/17">{formatCurrency(proj.payment.due)}</td>
                <td className="border border-gray-400 px-4 py-2 w-3/17">{proj.payment.notes || "-"}</td>
                <td className="border border-gray-400 px-1 py-2 w-1/17">
                  <button
                    className="text-teal-600 hover:text-teal-800"
                    onClick={() => {
                      setEditPayment({
                        id: proj.payment?.id || null,
                        project_id: proj.id,
                        total: proj.payment?.total || 0,
                        paid: proj.payment?.paid || 0,
                        due: proj.payment?.due || 0,
                        notes: proj.payment?.notes || "",
                      });
                      setShowModal(true);
                    }}
                  >
                    <EditDocumentIcon fontSize="small" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* No Results Message */}
      {displayedProjects.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {searchTerm ? "No projects found matching your search." : "No projects found."}
        </div>
      )}

      {/* Pagination */}
      {lastPage > 1 && (
        <div className="flex justify-end mt-10">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 mx-2 bg-teal-500 text-white rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-4 py-2">
            Page {page} of {lastPage}
          </span>
          <button
            disabled={page === lastPage}
            onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
            className="px-4 py-2 mx-2 bg-teal-500 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}


    </div>

         {/* Edit Modal */}

      {showModal && editPayment && (
        
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96" style={{transform: 'scale(0.75)',transformOrigin: 'center center', }}>
            <h2 className="text-lg font-bold mb-4">Edit Payment</h2>
            <label className="block mb-2">Total Payment</label>
            <input
              type="number"
              value={editPayment.total}
              onChange={(e) => {
                const total = parseFloat(e.target.value) || 0;
                const paid = parseFloat(editPayment.paid) || 0;
                setEditPayment({ 
                  ...editPayment, 
                  total: e.target.value,
                  due: (total - paid).toFixed(2)
                });
              }}
              className="border p-2 w-full mb-3"
            />

            <label className="block mb-2">Paid Amount</label>
            <input
              type="number"
              value={editPayment.paid}
              onChange={(e) => {
                const paid = parseFloat(e.target.value) || 0;
                const total = parseFloat(editPayment.total) || 0;
                setEditPayment({ 
                  ...editPayment, 
                  paid: e.target.value,
                  due: (total - paid).toFixed(2)
                });
              }}
              className="border p-2 w-full mb-3"
            />

            <label className="block mb-2">Due Amount</label>
            <input
              type="number"
              value={editPayment.due}
              className="border p-2 w-full mb-3 bg-gray-100"
              readOnly
            />

            <label className="block mb-2">Payment Notes</label>
            <textarea
              value={editPayment.notes || ""}
              onChange={(e) =>
                setEditPayment({ ...editPayment, notes: e.target.value })
              }
              className="border p-2 w-full mb-3"
              rows={3}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePayment}
                className="px-4 py-2 bg-teal-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
 </>
  );
};

export default AccountsPage;