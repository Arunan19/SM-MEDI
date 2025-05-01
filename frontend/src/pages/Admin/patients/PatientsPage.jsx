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
                  <th>ID</th><th>Name</th><th>DOB</th><th>Gender</th><th>Contact</th><th>Email</th><th>Address</th>
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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No patients found</td>
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
                  <th>ID</th><th>Name</th><th>Description</th><th>Type</th><th>Price</th><th>Duration</th>
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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No tests found</td>
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
                  <th>ID</th><th>Patient ID</th><th>Patient Name</th><th>Test ID</th><th>Test Name</th><th>Added By</th>
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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No patient tests found</td>
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
