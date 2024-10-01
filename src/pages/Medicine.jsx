import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Use useNavigate for navigation
import { db } from '../firebase-config'; // Import your Firebase configuration
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore'; // Import necessary Firestore functions
import './Medicine.css';

function Medicine() {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]); // State to hold all medicine data
  const [searchTerm, setSearchTerm] = useState(''); // State to hold the search term
  const [filteredMedicines, setFilteredMedicines] = useState([]); // State for filtered medicines
  const [viewDetails, setViewDetails] = useState({}); // State to hold visibility of details for each medicine
  const [editId, setEditId] = useState(null); // State to hold the ID of the medicine being edited
  const [updatedMedicine, setUpdatedMedicine] = useState({}); // State for holding updated medicine details

  const handleAddMedicine = () => {
    navigate('/add-medicine'); // Navigate to AddMedicine page
  };

  // Handle back button click to navigate to the dashboard
  const handleBackToDashboard = () => {
    navigate('/dashboard'); // Navigate to dashboard page (make sure the route exists)
  };

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const medicineCollection = collection(db, 'Medicine'); // Reference to the 'Medicine' collection
        const medicineSnapshot = await getDocs(medicineCollection); // Fetch documents
        const medicineList = medicineSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMedicines(medicineList); // Set the fetched data to state
        setFilteredMedicines(medicineList); // Initially, show all medicines
      } catch (error) {
        console.error('Error fetching medicines:', error); // Handle any errors
      }
    };

    fetchMedicines(); // Call the function to fetch medicines
  }, []); // Empty dependency array to run effect once on mount

  // Filter medicines when search term changes
  useEffect(() => {
    const filtered = medicines.filter(medicine =>
      medicine.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) // Filter based on name
    );
    setFilteredMedicines(filtered);
  }, [searchTerm, medicines]); // Re-filter medicines when search term or medicines change

  // Function to toggle view details
  const toggleViewDetails = (id) => {
    setViewDetails(prev => ({
      ...prev,
      [id]: !prev[id], // Toggle the boolean value for the medicine id
    }));
  };

  // Function to start editing a medicine
  const handleEditMedicine = (medicine) => {
    setEditId(medicine.id); // Set the current medicine ID to edit
    setUpdatedMedicine(medicine); // Set the current medicine data for editing
  };

  // Function to handle the save after editing
  const handleSaveEdit = async () => {
    try {
      const medicineRef = doc(db, 'Medicine', editId);
      await updateDoc(medicineRef, updatedMedicine); // Update the medicine in Firestore
      setMedicines(medicines.map(medicine => (medicine.id === editId ? { ...medicine, ...updatedMedicine } : medicine))); // Update local state
      setFilteredMedicines(filteredMedicines.map(medicine => (medicine.id === editId ? { ...medicine, ...updatedMedicine } : medicine)));
      setEditId(null); // Clear the edit state
      setUpdatedMedicine({}); // Clear the updated medicine state
    } catch (error) {
      console.error('Error updating medicine:', error);
    }
  };

  // Function to delete a medicine
  const handleDeleteMedicine = async (id) => {
    try {
      await deleteDoc(doc(db, 'Medicine', id)); // Delete document from Firestore
      setFilteredMedicines(filteredMedicines.filter(medicine => medicine.id !== id)); // Remove from state
    } catch (error) {
      console.error('Error deleting medicine:', error); // Handle any errors
    }
  };

  return (
    <div className="container">
      <div className="header">
        <button className="medicine-btn" onClick={handleAddMedicine}>Medicine +</button>
        <span className="dashboard-text">Dashboard &gt; Medical List</span>
        <input
          className="search-box"
          type="text"
          placeholder="Search Medicine here"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)} // Update search term on input change
        />
      </div>

      <div className="table-container">
        <table className="medicine-table">
          <thead>
            <tr>
              <th>ID</th>
              
              <th>Medicine Name</th>
              <th>Medicine Type</th>
              <th>Brand Name</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMedicines.map((medicine) => (
              <React.Fragment key={medicine.id}>
                <tr>
                  <td>{medicine.id}</td> {/* Display the document ID */}
                  <td>
                    {editId === medicine.id ? (
                      <input
                        type="text"
                        value={updatedMedicine.medicineName}
                        onChange={(e) => setUpdatedMedicine({ ...updatedMedicine, medicineName: e.target.value })}
                      />
                    ) : (
                      medicine.medicineName
                    )}
                  </td>
                  <td>
                    {editId === medicine.id ? (
                      <input
                        type="text"
                        value={updatedMedicine.medicineType}
                        onChange={(e) => setUpdatedMedicine({ ...updatedMedicine, medicineType: e.target.value })}
                      />
                    ) : (
                      medicine.medicineType
                    )}
                  </td>
                  <td>
                    {editId === medicine.id ? (
                      <input
                        type="text"
                        value={updatedMedicine.brandName}
                        onChange={(e) => setUpdatedMedicine({ ...updatedMedicine, brandName: e.target.value })}
                      />
                    ) : (
                      medicine.brandName
                    )}
                  </td>
                  <td>
                    {editId === medicine.id ? (
                      <input
                        type="number"
                        value={updatedMedicine.price}
                        onChange={(e) => setUpdatedMedicine({ ...updatedMedicine, price: e.target.value })}
                      />
                    ) : (
                      `Rs. ${medicine.price}`
                    )}
                  </td>
                  <td>
                    {editId === medicine.id ? (
                      <>
                        <button className="action-btn save" onClick={handleSaveEdit}>💾</button>
                        <button className="action-btn cancel" onClick={() => setEditId(null)}>❌</button>
                      </>
                    ) : (
                      <>
                        <button className="action-btn view" onClick={() => toggleViewDetails(medicine.id)}>
                          {viewDetails[medicine.id] ? 'Hide Details' : 'View Details'}
                        </button>
                        <button className="action-btn edit" onClick={() => handleEditMedicine(medicine)}>
                          ✏️
                        </button>
                        <button className="action-btn delete" onClick={() => handleDeleteMedicine(medicine.id)}>
                          🗑
                        </button>
                      </>
                    )}
                  </td>
                </tr>
                {viewDetails[medicine.id] && (
                  <tr>
                    <td colSpan="6">
                      <p>Details for {medicine.medicineName}:</p>
                      <p>Type: {medicine.medicineType}</p>
                      <p>Brand: {medicine.brandName}</p>
                      <p>Price: Rs. {medicine.price}</p>
                      {/* Add more details about the medicine here */}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <button className="back-btn" onClick={handleBackToDashboard}>Back</button>
      </div>
    </div>
  );
}

export default Medicine;

