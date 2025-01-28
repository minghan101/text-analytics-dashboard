import React, { useState, useEffect } from "react";
import axios from "axios";

export const RecordsList = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null); // Holds the full text of the selected record
  const [analyzedData, setAnalyzedData] = useState(null); // Stores analysis results
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const recordsPerPage = 10; // Limit to 10 records per page

  const fetchRecords = async () => {
    setLoading(true); // Show loading while fetching
    try {
      const response = await axios.get("http://127.0.0.1:5000/get_records"); // Flask endpoint
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
        text: record.Text, // Pass the record's text to the backend
      });
      setAnalyzedData(response.data); // Save the analysis result
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <h1 className="text-2xl font-bold mb-4">Excel Records List</h1>
      <button
        onClick={fetchRecords} // Trigger refresh
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
      >
        Refresh Records
      </button>
      <div className="bg-white p-6 border border-black rounded-lg shadow-md w-3/4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-black">
            <thead>
              <tr className="bg-gray-300">
                <th className="border border-black px-4 py-2">Index</th>
                <th className="border border-black px-4 py-2">Link</th>
                <th className="border border-black px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRecords.map((record, index) => (
                <tr key={record.index} className="hover:bg-gray-200">
                  <td className="border border-black px-4 py-2">{record.index}</td>
                  <td className="border border-black px-4 py-2">
                    <a
                      href={record.Link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {record.Link}
                    </a>
                  </td>
                  <td className="border border-black px-4 py-2 flex space-x-2">
                    <button
                      onClick={() => handleSelectRecord(record)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      View Text
                    </button>
                    <button
                      onClick={() => handleAnalyzeRecord(record)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Analyze
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded ${
              currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded ${
              currentPage === totalPages ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Next
          </button>
        </div>
      </div>
      {/* Full Text Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-3/4 max-h-[80%] overflow-auto">
            <h2 className="text-xl font-bold mb-4">Record Details</h2>
            <p className="text-gray-700 whitespace-pre-line mb-4">{selectedRecord.Text}</p>
            <button
              onClick={handleCloseDetails}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Analysis Modal */}
      {analyzedData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-3/4 max-h-[80%] overflow-auto">
            <h2 className="text-xl font-bold mb-4">Analysis Results</h2>
            <pre className="text-gray-700 mb-4">{JSON.stringify(analyzedData, null, 2)}</pre>
            <button
              onClick={handleCloseAnalysis}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
