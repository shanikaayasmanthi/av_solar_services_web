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
    fetchPayments(page); // refresh table
  } catch (error) {
    console.error("Error saving payment:", error);
  }
};




  // Filtered projects based on search
  const filteredProjects = projects.map((proj) => {
    const match = searchTerm
      ? proj.project_no?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        proj.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proj.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
      : false;

    return { ...proj, isHighlighted: match };
  });



  return (
    <div className="origin-top-left scale-[0.75] w-[133.33%]">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Payments Dashboard</h1>
              {/* Search Input */}
        <div className="md:min-w-[200px] relative">
          <input
            type="text"
            placeholder="Search by project no, name, customer..."
            className="w-80 px-15 py-2 pl-10 text-gray-700 bg-gray-100 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
            <SearchIcon />
          </div>
        </div>
      </div>

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
            {filteredProjects.map((proj, index) => (
              <tr
                key={index}
                className={`text-center ${
                searchTerm && proj.isHighlighted ? "bg-teal-100 " : ""
                }`}
              >
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

      {/* Pagination */}
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

      {/* Edit Modal */}
      {showModal && editPayment && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Edit Payment</h2>

            <label className="block mb-2">Total Payment</label>
            <input
              type="number"
              value={editPayment.total}
              onChange={(e) =>
                setEditPayment({ ...editPayment, total: e.target.value })
              }
              className="border p-2 w-full mb-3"
            />

            <label className="block mb-2">Paid Amount</label>
            <input
              type="number"
              value={editPayment.paid}
              onChange={(e) =>
                setEditPayment({ ...editPayment, paid: e.target.value })
              }
              className="border p-2 w-full mb-3"
            />

            <label className="block mb-2">Due Amount</label>
            <input
              type="number"
              value={editPayment.due}
              onChange={(e) =>
                setEditPayment({ ...editPayment, due: e.target.value })
              }
              className="border p-2 w-full mb-3"
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
    </div>
  );
};

export default AccountsPage;
