import React, { useEffect, useState } from 'react';
import { collection, doc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaTrash, FaEdit } from 'react-icons/fa'; // Icons for actions
import { db } from '../firebase-config';
import './Medicine.css';

function Medicine() {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleAddMedicine = () => {
    navigate('/add-medicine');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  useEffect(() => {
    const fetchMedicines = async () => {
      setLoading(true);
      try {
        const medicineCollection = collection(db, 'Medicine');
        const medicineSnapshot = await getDocs(medicineCollection);
        const medicineList = medicineSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMedicines(medicineList);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch medicines. Please try again later.');
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  const handleHideMedicine = async (medicine) => {
    try {
      await updateDoc(doc(db, 'Medicine', medicine.id), { isHidden: true });
      setMedicines((prevMedicines) =>
        prevMedicines.map((m) =>
          m.id === medicine.id ? { ...m, isHidden: true } : m
        )
      );
    } catch (error) {
      setError('Failed to hide medicine. Please try again.');
    }
  };

  const handleViewMedicine = async (medicine) => {
    try {
      await updateDoc(doc(db, 'Medicine', medicine.id), { isHidden: false });
      setMedicines((prevMedicines) =>
        prevMedicines.map((m) =>
          m.id === medicine.id ? { ...m, isHidden: false } : m
        )
      );
    } catch (error) {
      setError('Failed to restore medicine. Please try again.');
    }
  };

  const handleDeleteMedicine = async (medicineId) => {
    try {
      await deleteDoc(doc(db, 'Medicine', medicineId));
      setMedicines((prevMedicines) => prevMedicines.filter((m) => m.id !== medicineId));
    } catch (error) {
      setError('Failed to delete medicine. Please try again.');
    }
  };

  const handleEditMedicine = (medicineId) => {
    navigate(`/edit-medicine/${medicineId}`); // Fixed template literal
  };

  const filteredMedicines = medicines.filter((medicine) =>
    medicine.medicineName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="medicine-list-container">
       <div className="breadcrumb-Container">
          <div className="breadcrumb">
            <span>Dashboard</span> {'>'}
          </div>
           <div className="breadcrumbs">
            <span>Medicine List</span>
          </div>
        </div>
     
      {/* Header with search box */}
      <div className="page-header">
        <button className="medicine-btn" onClick={handleAddMedicine}>
          + Add Medicine 
        </button>
       
        <input
          className="search-box"
          type="text"
          placeholder="Search Medicine here"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "300px", height: "auto" }}
        />
      </div>

      {loading ? (
        <p>Loading medicines...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <>
          {/* Medicine List Table */}
          <div className="table-container">
            <table className="medicine-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Medicine Name</th>
                  <th>Type</th>
                  <th>Brand</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMedicines.map((medicine) => (
                  <tr key={medicine.id}>
                    <td>{medicine.id}</td>
                    <td>{medicine.medicineName}</td>
                    <td>{medicine.medicineType}</td>
                    <td>{medicine.brandName}</td>
                    <td>Rs. {medicine.price}</td>
                    <td>{medicine.isHidden ? 'Hidden' : 'Visible'}</td>
                    <td>
                      <div className="action-buttons">
                        {medicine.isHidden ? (
                          <button
                            className="action-btn view"
                            onClick={() => handleViewMedicine(medicine)}
                          >
                            <FaEyeSlash /> {/* Icon for "Unhide" */}
                          </button>
                        ) : (
                          <button
                            className="action-btn view"
                            onClick={() => handleHideMedicine(medicine)}
                            style={{ backgroundColor:'#1ABC9C', color:'white' }}
                          >
                            <FaEye /> {/* Icon for "Hide" */}
                          </button>
                        )}
                        <button
                          className="action-btn edit"
                          onClick={() => handleEditMedicine(medicine.id)}
                          style={{ backgroundColor:'#1ABC9C', color:'white' }}
                        >
                          <FaEdit /> {/* Icon for "Edit" */}
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => handleDeleteMedicine(medicine.id)}
                          style={{ backgroundColor:'#1ABC9C', color:'white' }}
                        >
                          <FaTrash /> {/* Icon for "Delete" */}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Back button */}
          <div className="back-button-container3">
            <button className="back-btn3" onClick={handleBackToDashboard}>
              Back
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Medicine;
