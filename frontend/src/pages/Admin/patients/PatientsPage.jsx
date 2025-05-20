import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/admin side bar";
import "./Patients.css";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong. Please try again later.</h2>;
    }
    return this.props.children;
  }
}

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [tests, setTests] = useState([]);
  const [patientTests, setPatientTests] = useState([]);

  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showTestForm, setShowTestForm] = useState(false);
  const [showPatientTestForm, setShowPatientTestForm] = useState(false);
  
  // Edit form states
  const [showEditPatientForm, setShowEditPatientForm] = useState(false);
  const [showEditTestForm, setShowEditTestForm] = useState(false);
  const [showEditPatientTestForm, setShowEditPatientTestForm] = useState(false);
  
  // Editing entities
  const [editingPatient, setEditingPatient] = useState(null);
  const [editingTest, setEditingTest] = useState(null);
  const [editingPatientTest, setEditingPatientTest] = useState(null);

  const [newPatient, setNewPatient] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "Male",
    contact_number: "",
    email: "",
    address: "",
    added_by: "",
  });

  const [newTest, setNewTest] = useState({
    test_name: "",
    description: "",
    test_type: "",
    price: "",
    duration: "",
    added_by: "",
  });

  const [newPatientTest, setNewPatientTest] = useState({
    patient_id: "",
    test_id: "",
    added_by: "",
  });

  const [currentPage, setCurrentPage] = useState({ patients: 1, tests: 1, patientTests: 1 });
  const recordsPerPage = 10;

  const paginate = (data, page) => {
    const startIndex = (page - 1) * recordsPerPage;
    return data.slice(startIndex, startIndex + recordsPerPage);
  };

  const handleNextPage = (type) => {
    setCurrentPage((prev) => ({ ...prev, [type]: prev[type] + 1 }));
  };

  const handlePreviousPage = (type) => {
    setCurrentPage((prev) => ({ ...prev, [type]: Math.max(prev[type] - 1, 1) }));
  };

  useEffect(() => {
    fetchPatients();
    fetchTests();
    fetchPatientTests();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/patients");
      const data = await res.json();
      setPatients(data.patients || []);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const fetchTests = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/lab-tests");
      const data = await res.json();
      console.log("Lab Tests API Response:", data); // Debugging log
      if (data && Array.isArray(data.labTests)) {
        setTests(data.labTests); // Corrected key
      } else {
        console.error("Unexpected response format for lab tests:", data);
        setTests([]);
      }
    } catch (error) {
      console.error("Error fetching lab tests:", error);
      setTests([]);
    }
  };

  const fetchPatientTests = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/patient-tests");
      const data = await res.json();
      console.log("Patient Tests API Response:", data); // Debugging log
      if (data && Array.isArray(data.patientTests)) {
        setPatientTests(data.patientTests); // Corrected key
      } else {
        console.error("Unexpected response format for patient tests:", data);
        setPatientTests([]);
      }
    } catch (error) {
      console.error("Error fetching patient tests:", error);
      setPatientTests([]);
    }
  };

  const handleSubmit = async (e, endpoint, body, closePopup, fetchFn) => {
    e.preventDefault();
    try {
      // Append '/add' for specific endpoints
      const apiEndpoint = ["patients", "lab-tests", "patient-tests"].includes(endpoint)
        ? `${endpoint}/add`
        : endpoint;

      const res = await fetch(`http://localhost:5000/api/${apiEndpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        console.error(`Error: Received status ${res.status} from ${apiEndpoint}`);
        const errorText = await res.text(); // Read the response as text for debugging
        console.error("Response body:", errorText);
        alert(`Submission failed: ${res.statusText}`);
        return;
      }

      try {
        const data = await res.json();
        console.log("Submission successful:", data);
        await fetchFn();
        closePopup(false);
      } catch (jsonError) {
        console.error("Error parsing JSON response:", jsonError);
        alert("Submission failed: Invalid JSON response from server.");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const getPatientName = (patientId) => {
    const patient = patients.find((p) => p.patient_id === patientId);
    return patient ? `${patient.first_name} ${patient.last_name}` : "Unknown";
  };

  const getTestName = (testId) => {
    const test = tests.find((t) => t.test_id === testId);
    return test ? test.test_name : "Unknown";
  };

  // Edit handlers for Patient
  const handleEditPatient = (patient) => {
    setEditingPatient({...patient});
    setShowEditPatientForm(true);
  };

  const handleUpdatePatient = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/patients/update/${editingPatient.patient_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPatient)
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Update failed:", errorText);
        alert(`Update failed: ${res.statusText}`);
        return;
      }

      const data = await res.json();
      console.log("Update successful:", data);
      
      // Update the patients list
      setPatients(patients.map(p => 
        p.patient_id === editingPatient.patient_id ? editingPatient : p
      ));
      
      setShowEditPatientForm(false);
      setEditingPatient(null);
    } catch (error) {
      console.error("Error updating patient:", error);
      alert("An error occurred during update. Please try again.");
    }
  };

  // Edit handlers for Test
  const handleEditTest = (test) => {
    setEditingTest({...test});
    setShowEditTestForm(true);
  };

  const handleUpdateTest = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/lab-tests/update/${editingTest.test_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTest)
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Test update failed:", errorText);
        alert(`Test update failed: ${res.statusText}`);
        return;
      }

      const data = await res.json();
      console.log("Test update successful:", data);
      
      // Update the tests list
      setTests(tests.map(t => 
        t.test_id === editingTest.test_id ? editingTest : t
      ));
      
      setShowEditTestForm(false);
      setEditingTest(null);
    } catch (error) {
      console.error("Error updating test:", error);
      alert("An error occurred during test update. Please try again.");
    }
  };

  // Edit handlers for PatientTest
  const handleEditPatientTest = (patientTest) => {
    setEditingPatientTest({...patientTest});
    setShowEditPatientTestForm(true);
  };

  const handleUpdatePatientTest = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/patient-tests/update/${editingPatientTest.patient_tests_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPatientTest)
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Patient test update failed:", errorText);
        alert(`Patient test update failed: ${res.statusText}`);
        return;
      }

      const data = await res.json();
      console.log("Patient test update successful:", data);
      
      // Update the patient tests list
      setPatientTests(patientTests.map(pt => 
        pt.patient_tests_id === editingPatientTest.patient_tests_id ? editingPatientTest : pt
      ));
      
      setShowEditPatientTestForm(false);
      setEditingPatientTest(null);
    } catch (error) {
      console.error("Error updating patient test:", error);
      alert("An error occurred during patient test update. Please try again.");
    }
  };

  return (
    <ErrorBoundary>
      <div className="patients-page-container">
        <Sidebar />
        <div className="content">

          {/* Patients Table */}
          <div className="table-section">
            <div className="table-header">
              <h2>Patients</h2>
              <button onClick={() => setShowPatientForm(true)}>Add Patient</button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>ID</th><th>Name</th><th>DOB</th><th>Gender</th><th>Contact</th><th>Email</th><th>Address</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginate(patients, currentPage.patients).length > 0 ? (
                  paginate(patients, currentPage.patients).map((p) => (
                    <tr key={p.patient_id}>
                      <td>{p.patient_id}</td>
                      <td>{p.first_name} {p.last_name}</td>
                      <td>{p.date_of_birth}</td>
                      <td>{p.gender}</td>
                      <td>{p.contact_number}</td>
                      <td>{p.email}</td>
                      <td>{p.address}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="edit-btn" onClick={() => handleEditPatient(p)}>Edit</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">No patients found</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="pagination">
              <button onClick={() => handlePreviousPage("patients")} disabled={currentPage.patients === 1}>Previous</button>
              <button onClick={() => handleNextPage("patients")} disabled={currentPage.patients * recordsPerPage >= patients.length}>Next</button>
            </div>
          </div>

          {/* Tests Table */}
          <div className="table-section">
            <div className="table-header">
              <h2>Lab Tests</h2>
              <button onClick={() => setShowTestForm(true)}>Add Test</button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>ID</th><th>Name</th><th>Description</th><th>Type</th><th>Price</th><th>Duration</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginate(tests, currentPage.tests).length > 0 ? (
                  paginate(tests, currentPage.tests).map((t) => (
                    <tr key={t.test_id}>
                      <td>{t.test_id}</td>
                      <td>{t.test_name}</td>
                      <td>{t.description}</td>
                      <td>{t.test_type}</td>
                      <td>{t.price}</td>
                      <td>{t.duration}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="edit-btn" onClick={() => handleEditTest(t)}>Edit</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No tests found</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="pagination">
              <button onClick={() => handlePreviousPage("tests")} disabled={currentPage.tests === 1}>Previous</button>
              <button onClick={() => handleNextPage("tests")} disabled={currentPage.tests * recordsPerPage >= tests.length}>Next</button>
            </div>
          </div>

          {/* Patient Tests Table */}
          <div className="table-section">
            <div className="table-header">
              <h2>Patient Tests</h2>
              <button onClick={() => setShowPatientTestForm(true)}>Add Patient Test</button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>ID</th><th>Patient ID</th><th>Patient Name</th><th>Test ID</th><th>Test Name</th><th>Added By</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginate(patientTests, currentPage.patientTests).length > 0 ? (
                  paginate(patientTests, currentPage.patientTests).map((pt) => (
                    <tr key={pt.patient_tests_id}>
                      <td>{pt.patient_tests_id}</td>
                      <td>{pt.patient_id}</td>
                      <td>{getPatientName(pt.patient_id)}</td>
                      <td>{pt.test_id}</td>
                      <td>{getTestName(pt.test_id)}</td>
                      <td>{pt.added_by}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="edit-btn" onClick={() => handleEditPatientTest(pt)}>Edit</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No patient tests found</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="pagination">
              <button onClick={() => handlePreviousPage("patientTests")} disabled={currentPage.patientTests === 1}>Previous</button>
              <button onClick={() => handleNextPage("patientTests")} disabled={currentPage.patientTests * recordsPerPage >= patientTests.length}>Next</button>
            </div>
          </div>

          {/* Popup Forms */}
          {showPatientForm && (
            <PopupForm title="Add Patient" data={newPatient} setData={setNewPatient} onSubmit={(e) =>
              handleSubmit(e, "patients", newPatient, setShowPatientForm, fetchPatients)
            } onCancel={() => setShowPatientForm(false)} />
          )}
          {showTestForm && (
            <PopupForm title="Add Test" data={newTest} setData={setNewTest} onSubmit={(e) =>
              handleSubmit(e, "lab-tests", newTest, setShowTestForm, fetchTests)
            } onCancel={() => setShowTestForm(false)} />
          )}
          {showPatientTestForm && (
            <PopupForm title="Add Patient Test" data={newPatientTest} setData={setNewPatientTest} onSubmit={(e) =>
              handleSubmit(e, "patient-tests", newPatientTest, setShowPatientTestForm, fetchPatientTests)
            } onCancel={() => setShowPatientTestForm(false)} />
          )}
          
          {/* Edit Forms */}
          {showEditPatientForm && editingPatient && (
            <div className="popup-overlay">
              <div className="popup-card edit-popup-card">
                <h3>Edit Patient</h3>
                <form onSubmit={handleUpdatePatient}>
                  {Object.entries(editingPatient)
                    .filter(([key]) => key !== 'patient_id' && key !== 'created_at' && key !== 'updated_at')
                    .map(([key, value]) => (
                    <div className="form-group" key={key}>
                      <label htmlFor={key}>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</label>
                      <input
                        id={key}
                        type={key.includes("date") ? "date" : "text"}
                        name={key}
                        value={value || ''}
                        onChange={(e) => setEditingPatient({ ...editingPatient, [key]: e.target.value })}
                        required={['first_name', 'last_name', 'date_of_birth', 'gender'].includes(key)}
                      />
                    </div>
                  ))}
                  <div className="popup-buttons edit-popup-buttons">
                    <button type="submit">Update</button>
                    <button type="button" onClick={() => {
                      setShowEditPatientForm(false);
                      setEditingPatient(null);
                    }}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Test Form */}
          {showEditTestForm && editingTest && (
            <div className="popup-overlay">
              <div className="popup-card edit-popup-card">
                <h3>Edit Lab Test</h3>
                <form onSubmit={handleUpdateTest}>
                  {Object.entries(editingTest)
                    .filter(([key]) => key !== 'test_id' && key !== 'created_at' && key !== 'updated_at')
                    .map(([key, value]) => (
                    <div className="form-group" key={key}>
                      <label htmlFor={key}>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</label>
                      <input
                        id={key}
                        type="text"
                        name={key}
                        value={value || ''}
                        onChange={(e) => setEditingTest({ ...editingTest, [key]: e.target.value })}
                        required={['test_name', 'test_type'].includes(key)}
                      />
                    </div>
                  ))}
                  <div className="popup-buttons edit-popup-buttons">
                    <button type="submit">Update</button>
                    <button type="button" onClick={() => {
                      setShowEditTestForm(false);
                      setEditingTest(null);
                    }}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Patient Test Form */}
          {showEditPatientTestForm && editingPatientTest && (
            <div className="popup-overlay">
              <div className="popup-card edit-popup-card">
                <h3>Edit Patient Test</h3>
                <form onSubmit={handleUpdatePatientTest}>
                  {Object.entries(editingPatientTest)
                    .filter(([key]) => key !== 'patient_tests_id' && key !== 'created_at' && key !== 'updated_at')
                    .map(([key, value]) => (
                    <div className="form-group" key={key}>
                      <label htmlFor={key}>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</label>
                      {key === 'patient_id' ? (
                        <select
                          id={key}
                          name={key}
                          value={value || ''}
                          onChange={(e) => setEditingPatientTest({ ...editingPatientTest, [key]: e.target.value })}
                          required
                        >
                          <option value="">Select Patient</option>
                          {patients.map(p => (
                            <option key={p.patient_id} value={p.patient_id}>
                              {p.first_name} {p.last_name}
                            </option>
                          ))}
                        </select>
                      ) : key === 'test_id' ? (
                        <select
                          id={key}
                          name={key}
                          value={value || ''}
                          onChange={(e) => setEditingPatientTest({ ...editingPatientTest, [key]: e.target.value })}
                          required
                        >
                          <option value="">Select Test</option>
                          {tests.map(t => (
                            <option key={t.test_id} value={t.test_id}>
                              {t.test_name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          id={key}
                          type="text"
                          name={key}
                          value={value || ''}
                          onChange={(e) => setEditingPatientTest({ ...editingPatientTest, [key]: e.target.value })}
                          required={['patient_id', 'test_id'].includes(key)}
                        />
                      )}
                    </div>
                  ))}
                  <div className="popup-buttons edit-popup-buttons">
                    <button type="submit">Update</button>
                    <button type="button" onClick={() => {
                      setShowEditPatientTestForm(false);
                      setEditingPatientTest(null);
                    }}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

// Reusable Popup Form
const PopupForm = ({ title, data, setData, onSubmit, onCancel }) => (
  <div className="popup-overlay">
    <div className="popup-card">
      <h3>{title}</h3>
      <form onSubmit={onSubmit}>
        {Object.entries(data).map(([key, value]) => (
          <input
            key={key}
            type={key.includes("date") ? "date" : "text"}
            name={key}
            placeholder={key.replace("_", " ")}
            value={value}
            onChange={(e) => setData({ ...data, [key]: e.target.value })}
            required
          />
        ))}
        <div className="popup-buttons">
          <button type="submit">Submit</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  </div>
);

export default PatientsPage;