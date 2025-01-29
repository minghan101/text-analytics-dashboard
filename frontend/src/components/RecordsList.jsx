import React, { useState, useEffect } from "react";
import axios from "axios";
import { TouchableOpacity, Text } from 'react-native';
import { colors } from '../../assets/colors.js';
import { fonts } from '../../assets/fonts.js';

export const RecordsList = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [analyzedData, setAnalyzedData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:5000/get_records");
      setRecords(response.data.records);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch records");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSelectRecord = (record) => {
    setSelectedRecord(record);
  };

  const handleAnalyzeRecord = async (record) => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/analyze", {
        text: record.Text,
      });
      setAnalyzedData(response.data);
    } catch (err) {
      console.error("Error analyzing record:", err);
    }
  };

  const handleCloseDetails = () => {
    setSelectedRecord(null);
  };

  const handleCloseAnalysis = () => {
    setAnalyzedData(null);
  };

  const totalPages = Math.ceil(records.length / recordsPerPage);
  const paginatedRecords = records.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  if (loading) return <p>Loading records...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Excel Records List</h1>
      <TouchableOpacity onPress={fetchRecords} style={styles.refreshButton}>
        <Text style={styles.refreshButtonText}>Refresh Records</Text>
      </TouchableOpacity>
      <div style={styles.tableContainer}>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.tableCell}>Index</th>
                <th style={styles.tableCell}>Link</th>
                <th style={styles.tableCell}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRecords.map((record) => (
                <tr key={record.index} style={styles.tableRow}>
                  <td style={styles.tableCell}>{record.index}</td>
                  <td style={styles.tableCell}>
                    <a
                      href={record.Link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.tableLink}
                    >
                      {record.Link}
                    </a>
                  </td>
                  <td style={styles.tableCell}>
                    <TouchableOpacity
                      onPress={() => handleSelectRecord(record)}
                      style={styles.actionButton}
                    >
                      <Text style={styles.buttonText}>View Text</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleAnalyzeRecord(record)}
                      style={styles.actionButton}
                    >
                      <Text style={styles.buttonText}>Analyze</Text>
                    </TouchableOpacity>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={styles.pagination}>
          <TouchableOpacity
            onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{
              ...styles.paginationButton,
              backgroundColor: currentPage === 1 ? '#ddd' : colors.neonblue,
            }}
          >
            <Text style={styles.buttonText}>Previous</Text>
          </TouchableOpacity>
          <span style={styles.pageInfo}>
            Page {currentPage} of {totalPages}
          </span>
          <TouchableOpacity
            onPress={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{
              ...styles.paginationButton,
              backgroundColor: currentPage === totalPages ? '#ddd' : colors.neonblue,
            }}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </div>
      </div>

      {/* Full Text Modal */}
      {selectedRecord && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>Record Details</h2>
            <p style={styles.modalText}>{selectedRecord.Text}</p>
            <TouchableOpacity
              onPress={handleCloseDetails}
              style={styles.modalCloseButton}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </div>
        </div>
      )}

      {/* Analysis Modal */}
      {analyzedData && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>Analysis Results</h2>
            <pre style={styles.modalText}>{JSON.stringify(analyzedData, null, 2)}</pre>
            <TouchableOpacity
              onPress={handleCloseAnalysis}
              style={styles.modalCloseButton}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </div>
        </div>
      )}
    </div>
  );
};

// Styling
const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: colors.neonblue,
    fontFamily: fonts.Bold,
    marginBottom: '10px',
  },
  refreshButton: {
    backgroundColor: colors.neonblue,
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    border: 'none',
    marginBottom: '20px',
    width: 'auto',
    alignItems: 'center',
  },
  refreshButtonText: {
    fontFamily: fonts.Regular,
    fontSize: '16px',
    color: '#fff',
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: '#f1f1f1',
  },
  tableCell: {
    padding: '4px 10px',
    border: '1px solid #ddd',
    fontSize: '14px',
  },
  tableRow: {
    '&:hover': {
      backgroundColor: '#f9f9f9',
    },
  },
  tableLink: {
    color: colors.neonblue,
    textDecoration: 'underline',
    fontSize: '14px',
  },
  actionButton: {
    backgroundColor: colors.neongreen,
    color: '#fff',
    padding: '6px 12px',
    borderRadius: '5px',
    cursor: 'pointer',
    border: 'none',
    margin: '5px',
  },
  buttonText: {
    fontFamily: fonts.Regular,
    fontSize: '14px',
    color: '#fff',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  paginationButton: {
    padding: '6px 12px',
    color: '#fff',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  pageInfo: {
    fontSize: '14px',
    alignSelf: 'center',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '20px',
    width: '80%',
    maxWidth: '800px',
    maxHeight: '80%',
    overflowY: 'auto',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  modalText: {
    fontSize: '16px',
    color: '#333',
  },
  modalCloseButton: {
    backgroundColor: colors.neonred,
    color: '#fff',
    padding: '6px 12px',
    borderRadius: '5px',
    cursor: 'pointer',
    border: 'none',
    marginTop: '20px',
  },
};

export default RecordsList;
