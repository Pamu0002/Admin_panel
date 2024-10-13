import { collection, doc, getDocs, updateDoc } from 'firebase/firestore'; // Import necessary Firestore functions
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Use useNavigate for navigation
import { db } from '../firebase-config'; // Import your Firebase configuration
import './Medicine.css';

function Medicine() {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]); // State to hold all medicine data
  const [searchTerm, setSearchTerm] = useState(''); // State to hold the search term

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
        const medicineList = medicineSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMedicines(medicineList); // Set the fetched data to state
      } catch (error) {
        console.error('Error fetching medicines:', error); // Handle any errors
      }
    };

    fetchMedicines(); // Call the function to fetch medicines
  }, []); // Empty dependency array to run effect once on mount

  // Function to hide a medicine by setting the `isHidden` field in Firestore
  const handleHideMedicine = async (medicine) => {
    try {
      // Update the `isHidden` field in Firestore to true
      await updateDoc(doc(db, 'Medicine', medicine.id), { isHidden: true });
      setMedicines((prevMedicines) =>
        prevMedicines.map((m) =>
          m.id === medicine.id ? { ...m, isHidden: true } : m
        )
      );
      console.log(`${medicine.medicineName} hidden from Firestore`); // Log action for feedback
    } catch (error) {
      console.error('Error hiding medicine:', error); // Handle any errors
    }
  };

  // Function to view (unhide) a hidden medicine by updating the `isHidden` field in Firestore
  const handleViewMedicine = async (medicine) => {
    try {
      // Update the `isHidden` field in Firestore to false
      await updateDoc(doc(db, 'Medicine', medicine.id), { isHidden: false });
      setMedicines((prevMedicines) =>
        prevMedicines.map((m) =>
          m.id === medicine.id ? { ...m, isHidden: false } : m
        )
      );
      console.log(`${medicine.medicineName} restored in Firestore`); // Log action for feedback
    } catch (error) {
      console.error('Error restoring medicine:', error);
    }
  };

  // Filter medicines based on the search term, and don't exclude hidden medicines from display
  const filteredMedicines = medicines.filter((medicine) =>
    medicine.medicineName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
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
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMedicines.map((medicine) => (
              <tr key={medicine.id}>
                <td>{medicine.id}</td> {/* Display the document ID */}
                <td>{medicine.medicineName}</td>
                <td>{medicine.medicineType}</td>
                <td>{medicine.brandName}</td>
                <td>Rs. {medicine.price}</td>
                <td>{medicine.isHidden ? 'Hidden' : 'Visible'}</td> {/* Display hidden status */}
                <td>
                  {medicine.isHidden ? (
                    <button
                      className="action-btn view"
                      onClick={() => handleViewMedicine(medicine)}
                    >
                      Unhide
                    </button>
                  ) : (
                    <button
                      className="action-btn hide"
                      onClick={() => handleHideMedicine(medicine)}
                    >
                      Hide
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="back-btn" onClick={handleBackToDashboard}>Back</button>
      </div>
    </div>
  );
}

export default Medicine;
