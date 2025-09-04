import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { AlignHorizontalCenter } from '@mui/icons-material';
import FileDownloadSharpIcon from '@mui/icons-material/FileDownloadSharp';
import LocalPrintshopSharpIcon from '@mui/icons-material/LocalPrintshopSharp';

const ServiceSummary = () => {
  const { token } = useAuth();
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);

  useEffect(() => {
    fetchServiceSummary(selectedYear, selectedMonth);
  }, [selectedYear, selectedMonth]);

  const fetchServiceSummary = async (year, month) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://127.0.0.1:8000/api/service-summary?year=${year}&month=${month}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      });
      setSummaryData(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch service summary');
      setLoading(false);
      console.error("Error fetching service summary:", err);
    }
  };

   // Generate years (last 10 years)
  const years = Array.from({ length: 11 }, (_, i) => now.getFullYear() - i);
  const months = [
    { value: 1, label: "January" }, { value: 2, label: "February" },
    { value: 3, label: "March" },   { value: 4, label: "April" },
    { value: 5, label: "May" },     { value: 6, label: "June" },
    { value: 7, label: "July" },    { value: 8, label: "August" },
    { value: 9, label: "September" },{ value: 10, label: "October" },
    { value: 11, label: "November" },{ value: 12, label: "December" },
  ];

  if (loading) return <div style={styles.loading}>Loading service summary...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  // Process data to match the table structure
  const processServiceData = () => {
    if (!summaryData) return { onGrid: [], offGrid: [] };
    
    // Create arrays for on-grid and off-grid services
    const onGridServices = summaryData.summary.on_grid || [];
    const offGridServices = summaryData.summary.off_grid || [];
    
      // Sort services: free services first (ascending order), then paid services
    const sortServices = (services) => {
      const freeServices = services
        .filter(service => !service.service_round.includes('Paid') && !service.service_round.includes('Out Side Paid'))
        .sort((a, b) => {
          // Extract numeric part for sorting
          const aNum = parseInt(a.service_round.replace(/\D/g, '')) || 0;
          const bNum = parseInt(b.service_round.replace(/\D/g, '')) || 0;
          return aNum - bNum;
        });
      
      const paidServices = services
        .filter(service => service.service_round.includes('Paid Service') || service.service_round.includes('Out Side Paid'))
        .sort((a, b) => {
          // Extract numeric part for sorting
          const aNum = parseInt(a.service_round.replace(/\D/g, '')) || 0;
          const bNum = parseInt(b.service_round.replace(/\D/g, '')) || 0;
          return aNum - bNum;
        });
      
      return [...freeServices, ...paidServices];
    };
    
    const sortedOnGridServices = sortServices(onGridServices);
    const sortedOffGridServices = sortServices(offGridServices);
    

    // Calculate totals
    const totalOnGridSites = sortedOnGridServices.reduce((sum, service) => sum + service.no_of_sites, 0);
    const totalOnGridCapacity = sortedOnGridServices.reduce((sum, service) => sum + service.capacity, 0);

    const totalOffGridSites = sortedOffGridServices.reduce((sum, service) => sum + service.no_of_sites, 0);
    const totalOffGridCapacity = sortedOffGridServices.reduce((sum, service) => sum + service.capacity, 0);

    const onGridPaidServices = sortedOnGridServices
      .filter(service => service.service_round.includes('Paid Service') || service.service_round.includes('Out Side Paid'))
      .reduce((sum, service) => sum + service.no_of_sites, 0);

    const offGridPaidServices = sortedOffGridServices
      .filter(service => service.service_round.includes('Paid Service') || service.service_round.includes('Out Side Paid'))
      .reduce((sum, service) => sum + service.no_of_sites, 0);
    
    const totalPaidServices = onGridPaidServices + offGridPaidServices;

    return {
      onGrid: sortedOnGridServices,
      offGrid: sortedOffGridServices,
      totalOnGridSites,
      totalOnGridCapacity,
      totalOffGridSites,
      totalOffGridCapacity,
      totalSites: totalOnGridSites + totalOffGridSites,
      totalCapacity: totalOnGridCapacity + totalOffGridCapacity,
      totalPaidServices
    };
  };

  const {
    onGrid,
    offGrid,
    totalOnGridSites,
    totalOnGridCapacity,
    totalOffGridSites,
    totalOffGridCapacity,
    totalSites,
    totalCapacity,
    totalPaidServices
  } = processServiceData();

  // Format service round names to match the example
  const formatServiceRound = (round) => {
    if (round.includes('Paid Service')) {
      return round.replace('Paid Service', 'Paid Service');
    }
    return round.replace('Service', 'Service');
  };

  // Get month name
  const getMonthName = () => {
    if (!summaryData) return '';
    const date = new Date(summaryData.year, summaryData.month - 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  // Function to export data as CSV
const exportToCSV = () => {
  const {
    onGrid,
    offGrid,
    totalOnGridSites,
    totalOnGridCapacity,
    totalOffGridSites,
    totalOffGridCapacity,
    totalSites,
    totalCapacity,
    totalPaidServices
  } = processServiceData();

  let csvContent = "data:text/csv;charset=utf-8,";

  // Header
  csvContent += "Type,Service Round,Number of Sites,Capacity (kW)\n";

  // On-grid data
  onGrid.forEach(service => {
    csvContent += `On-grid,${formatServiceRound(service.service_round)},${service.no_of_sites},${service.capacity}\n`;
  });
  csvContent += `On-grid,Total On-grid,${totalOnGridSites},${totalOnGridCapacity}\n`;

  // Off-grid data
  offGrid.forEach(service => {
    csvContent += `Off-grid,${formatServiceRound(service.service_round)},${service.no_of_sites},${service.capacity}\n`;
  });
  csvContent += `Off-grid,Total Off-grid,${totalOffGridSites},${totalOffGridCapacity}\n`;

  // Totals
  csvContent += `Overall,Number of Sites Serviced in ${getMonthName().split(' ')[0]},${totalSites},\n`;
  csvContent += `Overall,Total Capacity Serviced,,${totalCapacity}\n`;
  csvContent += `Overall,Total Paid Services,${totalPaidServices},\n`;

  // Encode and trigger download
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `service_summary_${selectedYear}_${selectedMonth}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Function to print the service summary
const handlePrint = () => {
  const printContent = document.getElementById("service-summary-table").outerHTML;
  const printWindow = window.open("", "_blank", "width=900,height=700");
  printWindow.document.write(`
    <html>
      <head>
        <title>Service Summary - ${getMonthName()}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #B6B6B6; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .gridType { background-color: #B8EBFF; font-weight: bold; }
          .totalRow { background-color: #f0f0f0; }
          .grandTotalRow { background-color: #DAFFBF; font-weight: bold; }
          h1 { text-align: center; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <h1>Monthly Service Summary - ${getMonthName()}</h1>
        ${printContent}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};



  return (
    <div style={styles.container}>
    
      <div style={{ marginBottom: "20px" }}>
          <div className="flex justify-between mb-5">
            <div>
  <label style={{ fontSize: "17px", fontWeight: "bold" }}>
    Year: 
    <select 
      value={selectedYear} 
      onChange={(e) => setSelectedYear(parseInt(e.target.value))}
      style={{ marginLeft: "10px", marginRight: "20px" }}
    >
      {years.map((y) => (
        <option key={y} value={y}>{y}</option>
      ))}
    </select>
  </label>

  <label style={{ fontSize: "17px", fontWeight: "bold" }}>
    Month: 
    <select 
      value={selectedMonth} 
      onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
      style={{  marginLeft: "10px" }}
    >
      {months.map((m) => (
        <option key={m.value} value={m.value}>{m.label}</option>
      ))}
    </select>
  </label>
  </div>
               <div className="flex justify-end">
        <div className ="flex justify-between space-x-4">
      <button 
  onClick={exportToCSV} 
  className="bg-teal-600 hover:bg-teal-700 text-white px-2 py-2 rounded-lg font-medium transition-transform duration-200 hover:scale-105 "
        >

  < FileDownloadSharpIcon fontSize='medium'/>
</button>
      <button 
  onClick={handlePrint} 
  className="bg-teal-600 hover:bg-teal-700 text-white px-2 py-2 rounded-lg font-medium transition-transform duration-200 hover:scale-105 "
        >

  < LocalPrintshopSharpIcon fontSize='medium'/>
</button>
</div>

      </div>
</div>
</div>
      <h1 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "20px" }}>Monthly Service Summary - {getMonthName()}</h1>

      <div className='flex justify-center overflow-x-auto'>
      <table id="service-summary-table" style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}></th>
            <th style={{...styles.th, width:'30%'}}>Service Round</th>
            <th style={{...styles.th, width:'20%'}}>Number of Sites</th>
            <th style={{...styles.th, width:'35%'}}>Serviced Solar Panel Capacity (kW)</th>
          </tr>
        </thead>
        <tbody>
          {/* On-grid services */}
          <tr style={styles.gridHeader}>
            <td style={{...styles.td, ...styles.gridType}} rowSpan={onGrid.length + 1}>On-grid</td>
          </tr>
          {onGrid.map((service, index) => (
            <tr key={`on-grid-${index}`}>
              <td style={styles.td}>{formatServiceRound(service.service_round)}</td>
              <td style={styles.td}>{service.no_of_sites}</td>
              <td style={styles.td}>{service.capacity.toFixed(2)}</td>
            </tr>
          ))}
          <tr style={styles.totalRow}>
            <td style={styles.td}></td> 
            <td style={styles.td}><strong>Total On-grid</strong></td>
            <td style={styles.td}><strong>{totalOnGridSites}</strong></td>
            <td style={styles.td}><strong>{totalOnGridCapacity.toFixed(2)}</strong></td>
          </tr>
          
          {/* Off-grid services */}
          <tr style={styles.gridHeader}>
            <td style={{...styles.td, ...styles.gridType}} rowSpan={offGrid.length + 1}>Off-grid</td>
          </tr>
          {offGrid.map((service, index) => (
            <tr key={`off-grid-${index}`}>
              <td style={styles.td}>{formatServiceRound(service.service_round)}</td>
              <td style={styles.td}>{service.no_of_sites}</td>
              <td style={styles.td}>{service.capacity.toFixed(2)}</td>
            </tr>
          ))}
          <tr style={styles.totalRow}>
            <td style={styles.td}></td> 
            <td style={styles.td}><strong>Total Off-grid</strong></td>
            <td style={styles.td}><strong>{totalOffGridSites}</strong></td>
            <td style={styles.td}><strong>{totalOffGridCapacity.toFixed(2)}</strong></td>
          </tr>
          
          {/* Overall totals */}
          <tr style={styles.grandTotalRow}>
            <td style={styles.td} colSpan="2"><strong>Number of Sites Serviced in {getMonthName().split(' ')[0]}</strong></td>
            <td style={styles.td} colSpan="2"><strong>{totalSites}</strong></td>
          </tr>
          <tr style={styles.grandTotalRow}>
            <td style={styles.td} colSpan="2"><strong>Total Capacity Serviced</strong></td>
            <td style={styles.td} colSpan="2"><strong>{totalCapacity.toFixed(2)}</strong></td>
          </tr>
          <tr style={styles.grandTotalRow}>
            <td style={styles.td} colSpan="2"><strong>Total Paid Services</strong></td>
            <td style={styles.td} colSpan="2"><strong>{totalPaidServices}</strong></td>
          </tr>
        </tbody>
      </table>
      </div>

      {/* <div style={styles.paidServicesNote}>
        <h3>Total Paid Services Count in {getMonthName().split(' ')[0]}: {totalPaidServices}</h3>
      </div> */}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    margin: '20px 0'
  },
  title: {
    marginBottom: '20px',
    color: '#333',
    borderBottom: '2px solid #f0f0f0',
    paddingBottom: '10px'
  },
  table: {
    width: '80%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
    
    
  },
  th: {
    border: '1px solid #B6B6B6',
    padding: '8px',
    textAlign: 'left',
    backgroundColor: '#f2f2f2',
    fontWeight: 'bold',
  },
  td: {
    border: '1px solid #B6B6B6',
    padding: '8px',
    textAlign: 'left',
  },
  gridType: {
    fontWeight: 'bold',
    backgroundColor: '#B8EBFF',
    verticalAlign: 'top',
  },
  gridHeader: {
    backgroundColor: '#f8f9fa',
  },
  totalRow: {
    backgroundColor: '#f0f0f0',
  },
  grandTotalRow: {
    backgroundColor: '#DAFFBF',
  },
  loading: {
    textAlign: 'center',
    padding: '20px',
    fontSize: '18px',
  },
  error: {
    color: '#dc3545',
    textAlign: 'center',
    padding: '20px',
    fontSize: '18px',
  },
  paidServicesNote: {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderLeft: '4px solid #95EBF4',
  }
};

export default ServiceSummary;