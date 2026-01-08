import React, { useState, useEffect, useRef } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../constants/BaseUrl';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import html2pdf from 'html2pdf.js';


const AddInvoice = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  

  // --- State Management ---
  const [invoiceData, setInvoiceData] = useState({
    selectedProjectId: null,
    invoiceNumber: '',
    specialNote: '',
    discount: 0,
    expenses: [{ description: '', amount: 0 }]
  });

  const [searchTerm, setSearchTerm] = useState();
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProjectError, setSelectedProjectError] = useState(null);
  const [invoiceIDError, setInvoiceIDError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [descriptionError, setDescriptionError] = useState(null);
  const [generateError, setGenerateError] = useState(null);
  const printRef = useRef();

  // --- Calculations ---
  const subtotal = invoiceData.expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const total = subtotal - (Number(invoiceData.discount) || 0);

  // --- Handlers ---
  const addExpenseRow = () => {
    setInvoiceData({
      ...invoiceData,
      expenses: [...invoiceData.expenses, { description: '', amount: 0 }]
    });
  };

  const updateExpense = (index, field, value) => {
    const newExpenses = [...invoiceData.expenses];
    newExpenses[index][field] = value;
    setInvoiceData({ ...invoiceData, expenses: newExpenses });
  };

  const removeExpense = (index) => {
    const newExpenses = invoiceData.expenses.filter((_, i) => i !== index);
    setInvoiceData({ ...invoiceData, expenses: newExpenses });
  };

  useEffect(()=>{
    //api call to fetch projects based on search term
    const fetchProjects = async () => {
        if(!searchTerm || searchTerm.length < 2){
            setSearchResults([]);
            return;
        }
        try{
            const response = await axios.get(`${BASE_URL}api/projects/search`, {
                params: { query: searchTerm },
                 headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
            });
            setSearchResults(response.data.data.projects);
            // console.log("Project Search Results:", response.data);
        } catch (error){
            console.error("Error fetching projects:", error);
        }
    };
    fetchProjects();
    
  },[searchTerm]);

  const handleSelectProject = (project) => {
    setSelectedProjectError(null);
  // Update invoiceData with the ID for the backend
  setInvoiceData({
    ...invoiceData,
    selectedProjectId: project.id
  });

  // Store the full project details to show in the UI
  setSelectedProject(project);

  // Update the search input to show the selected name
  setSearchTerm(null);

  // Clear suggestions
  setSearchResults([]);
};

const handleOnGenerateInvoice = async () => {
  setIsGenerating(true);
    //reset previous errors
    setSelectedProjectError(null);
    setInvoiceIDError(null);
    setDescriptionError(null);
    setGenerateError(null);
    //check if a project is selected
    if(!invoiceData.selectedProjectId){
      setSelectedProjectError("Please select a project to generate invoice.");
    }
    //check if invoice number is provided
    if(!invoiceData.invoiceNumber || invoiceData.invoiceNumber.trim() === ''){
      setInvoiceIDError("Invoice number is required.");
    }
    //check if at least one expense has description
    const hasValidDescription = invoiceData.expenses.some(expense => expense.description && expense.description.trim() !== '');
    if(!hasValidDescription){
      setDescriptionError("Please provide description for at least one expense item.");
    }

    //check all description fields are filled
    for(let expense of invoiceData.expenses){
      if(!expense.description || expense.description.trim() === ''){
        setDescriptionError("Please fill all description fields or remove empty items.");
      }
     }
     if(selectedProjectError || invoiceIDError || descriptionError){
      setIsGenerating(false);
      return;
     }
    //proceed to generate invoice
    if(isGenerating)return;
    
    try{
      const response = await axios.post(`${BASE_URL}api/invoices/create`, {
        project_id: invoiceData.selectedProjectId,
        customer_id : selectedProject.customer_id,
        invoice_number: invoiceData.invoiceNumber,
        special_note: invoiceData.specialNote,
        discount: invoiceData.discount,
        expenses: invoiceData.expenses.filter(expense => expense.description && expense.description.trim() !== ''),
        total_amount: total
      }, {
        headers: {
          Accept: "application/json", 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      // console.log("Invoice Generation Response:", response.data);

      // --- PDF GENERATION LOGIC ---
      const element = printRef.current;
      const opt = {
        margin: 10,
        filename: `${invoiceData.invoiceNumber} ${selectedProject.customer_name || 'Invoice'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // Generate and download
      await html2pdf().set(opt).from(element).save();

        setInvoiceData({
          selectedProjectId: null,
          invoiceNumber: '',
          specialNote: '',
          discount: 0,
          expenses: [{ description: '', amount: 0 }]
        });
        setSelectedProject(null);
    }catch(error){
      setGenerateError("An error occurred while generating the invoice.");
      console.error("Invoice Generation Error:", error);
    }finally{
    setIsGenerating(false);
    }
  }

  return (
    <div className="">
      <div className="origin-top-left scale-[0.85] w-[117%] " >
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div
              className="p-2 transition-colors duration-200 bg-gray-100 rounded-md cursor-pointer hover:bg-teal-100 no-print"
              onClick={() => navigate(-1)}
            >
              <ArrowBackIcon fontSize="medium" />
            </div>
            <h1 className="text-3xl font-bold">Create New Invoice</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 mx-3 md:grid-cols-2">
          {/* Section 1: Project Search & Details */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-black-700">Project Selection</h2>
            <input
              type="text"
              placeholder="Search Project Name or ID..."
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
              value={searchTerm}
              onChange={(e) => {setSearchTerm(e.target.value);
                // setShowSuggestions(true);
              }}
            //   onFocus={() => searchTerm.length > 1 && setShowSuggestions(true)}
            />
            {/* Suggestions Dropdown */}
              {searchResults.length > 0 && (
  <div className="absolute z-50 mt-1 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-xl md:w-[40%] w-[90%] max-h-60">
    {searchResults.map((project) => (
      <div
        key={project.id}
        className="p-3 border-b cursor-pointer last:border-0 hover:bg-teal-50"
        onClick={() => handleSelectProject(project)}
      >
        <div className="flex justify-between">
          <span className="font-bold text-black-800">{project.project_name} ({project.type})</span>
          <span className="px-1 font-mono text-xs text-gray-500 bg-gray-100 rounded">
            {project.project_no}({project.external_internal === 'Internal' ? 'Internal' : 'External'})
          </span>
        </div>
        <p className="text-xs text-gray-600">Customer: {project.customer_name}</p>
      </div>
    ))}
  </div>
)}
            
            {/* Mock Project Display (This would typically show after selecting from search results) */}
            {selectedProject && (
                <div className="p-4 space-y-2 rounded-md bg-gray-50">
              <p><span className="font-medium text-gray-500">Project No:</span> {selectedProject.project_no}</p>
              <p><span className="font-medium text-gray-500">Project Name:</span> {selectedProject.project_name}</p>
              <p><span className="font-medium text-gray-500">Customer:</span> {selectedProject.customer_name}</p>
              <p><span className="font-medium text-gray-500">Address:</span> {selectedProject.project_address}</p>
            </div>)}
            {!selectedProject && selectedProjectError===null &&(<div className="p-4 space-y-2 rounded-md bg-gray-50">
            <span className="text-gray-400">Select a project to view details</span>
          </div>
          )}
          {!selectedProject && selectedProjectError!=null && (
            <div className="mt-2 text-sm text-red-600">{selectedProjectError}</div>
          )}
          </div>
          

          {/* Section 2: General Info */}
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-black-700">Invoice Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="e.g. INV-001"
                  value={invoiceData.invoiceNumber}
                  onChange={(event) => {
                    setInvoiceIDError(null);
                    setInvoiceData({...invoiceData, invoiceNumber: event.target.value});
                  }}
                />
                {invoiceIDError && (
                  <div className="mt-1 text-sm text-red-600">{invoiceIDError}</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Special Note</label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows="2"
                  placeholder="Terms, conditions, or notes..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Expenses Table */}
        <div className="mx-3 mt-8 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 font-semibold text-gray-700">Description</th>
                <th className="p-4 font-semibold text-gray-700">Amount (RS.)</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.expenses.map((expense, index) => (
                <tr key={index} className="border-t">
                  <td className="p-3">
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 "
                      placeholder="Service or item name"
                      value={expense.description}
                      onChange={(e) => updateExpense(index, 'description', e.target.value)}
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 "
                      placeholder="0.00"
                      value={expense.amount}
                      onChange={(e) => updateExpense(index, 'amount', e.target.value)}
                    />
                  </td>
                  <td className="p-3 text-right">
                    <button 
                      onClick={() => removeExpense(index)}
                      className="text-red-400 hover:text-red-600">
                      <DeleteOutlineIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {descriptionError && (
            <div className="mx-4 mt-2 text-sm text-red-600">{descriptionError}</div>
          )}
          <button 
            onClick={addExpenseRow}
            className="flex items-center gap-2 p-4 text-teal-600 transition-colors hover:bg-teal-50">
            <AddIcon fontSize="small" /> Add Item
          </button>
        </div>

        {/* Section 4: Totals */}
        <div className="flex justify-end mx-3 mt-8">
          <div className="w-full max-w-xs space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>RS.{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-600">Discount:</span>
              <input
                type="number"
                className="w-24 p-1 text-right border border-gray-300 rounded-md"
                value={invoiceData.discount}
                onChange={(e) => setInvoiceData({...invoiceData, discount: e.target.value})}
              />
            </div>
            <hr />
            <div className="flex justify-between text-xl font-bold text-teal-800">
              <span>Total:</span>
              <span>RS.{total.toFixed(2)}</span>
            </div>
            {isGenerating ? (
              <button
                disabled
                className="w-full p-2 mt-4 text-white bg-teal-600 rounded-md hover:bg-teal-700 disabled:bg-gray-400"
              >
                Generating Invoice...
              </button>
            ) : (
              <button
                onClick={handleOnGenerateInvoice}
                className="w-full p-2 mt-4 text-white bg-teal-600 rounded-md hover:bg-teal-700"
              >
                Generate Invoice
              </button>
            )}
          </div>
        </div>
        {generateError && (
            <div className="mx-3 mt-4 text-sm text-center text-red-600">{generateError}</div>
          )}
      </div>
      {/* --- PDF TEMPLATE (Hidden from UI) --- */}
      <div style={{ display: 'none' }}>
        <div ref={printRef} className="p-10 bg-white text-black w-[700px]"> 
          {/* 794px is roughly A4 width at 96 DPI */}
          
          {/* PDF DESIGN */}
          <div className="flex justify-between pb-5 border-b-2 border-teal-600">
            <div>
              <h1 className="text-4xl font-bold text-teal-600">INVOICE</h1>
              <p className="text-gray-500">{new Date().toLocaleString()}</p>
            </div>
            <div className="text-right">
              <h2 className="font-bold">Alta Vision Solar</h2>
              <p className="text-sm text-gray-600">Address Line 1<br/>City, Country</p>
            </div>
          </div>

          <div className='flex gap-2 mt-3'>
          <h3 className="font-bold text-gray-400 uppercase">Invoice No:</h3>
          <p className="text-gray-500">{invoiceData.invoiceNumber}</p>

          </div>
          
          <div className="grid grid-cols-2 mt-3 mb-10">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase">Bill To:</h3>
              <p className="font-bold">{selectedProject?.customer_name}</p>
              <p className="text-sm">{selectedProject?.project_address}</p>
            </div>
            <div className="text-right">
              <h3 className="text-xs font-bold text-gray-400 uppercase">Project:</h3>
              <p>{selectedProject?.project_name}({selectedProject?.project_no})</p>
            </div>
          </div>

          <table className="w-full mt-10">
            <thead>
              <tr className="text-white bg-teal-600">
                <th className="p-2 text-left">Description</th>
                <th className="p-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.expenses.map((item, i) => (
                <tr key={i} className="border-b">
                  <td className="p-2">{item.description}</td>
                  <td className="p-2 text-right">RS.{Number(item.amount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="w-1/3 mt-10 ml-auto">
            <div className="flex justify-between py-1">
              <span>Subtotal:</span>
              <span>RS.{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1 text-red-600">
              <span>Discount:</span>
              <span>-RS.{Number(invoiceData.discount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 text-lg font-bold border-t-2 border-teal-600">
              <span>Total:</span>
              <span>RS.{total.toFixed(2)}</span>
            </div>
          </div>

          {invoiceData.specialNote && (
            <div className="pt-4 mt-20 text-sm border-t">
              <p className="font-bold text-gray-500">Notes:</p>
              <p className="text-gray-400">{invoiceData.specialNote}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddInvoice;