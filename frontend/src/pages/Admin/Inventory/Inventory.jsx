import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/admin side bar";
import "./Inventory.css";

const InventoryEquipmentPage = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [equipmentData, setEquipmentData] = useState([]);
  const [showInventoryForm, setShowInventoryForm] = useState(false);
  const [showEquipmentForm, setShowEquipmentForm] = useState(false);
  const [editInventory, setEditInventory] = useState(null);
  const [editEquipment, setEditEquipment] = useState(null);

  const [newInventory, setNewInventory] = useState({
    item_name: "",
    category: "",
    quantity: 0,
    supplier: "",
    purchase_date: "",
    expiry_date: "",
    added_by: "",
  });

  const [newEquipment, setNewEquipment] = useState({
    equipment_name: "",
    equipment_type: "",
    brand: "",
    model: "",
    quantity: 1,
    purchase_date: "",
    status: "Active",
    last_serviced: "",
    added_by: "",
  });

  const [inventoryPage, setInventoryPage] = useState(0);
  const [equipmentPage, setEquipmentPage] = useState(0);
  const recordsPerPage = 10;

  useEffect(() => {
    fetchInventory();
    fetchEquipment();
  }, []);

  const fetchInventory = async () => {
    const res = await fetch("http://localhost:5000/api/inventory");
    const data = await res.json();
    setInventoryData(data.inventory);
  };

  const fetchEquipment = async () => {
    const res = await fetch("http://localhost:5000/api/equipment");
    const data = await res.json();
    setEquipmentData(data.equipment);
  };

  const handleInventorySubmit = async (e) => {
    e.preventDefault();

    const inventoryToSubmit = editInventory || newInventory;

    const formattedInventory = {
      ...inventoryToSubmit,
      purchase_date: new Date(inventoryToSubmit.purchase_date).toISOString().split("T")[0],
      expiry_date: inventoryToSubmit.expiry_date
        ? new Date(inventoryToSubmit.expiry_date).toISOString().split("T")[0]
        : null,
    };

    const url = editInventory
      ? `http://localhost:5000/api/inventory/${editInventory.id}`
      : "http://localhost:5000/api/inventory";
    const method = editInventory ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formattedInventory),
    });

    if (!response.ok) {
      const error = await response.json();
      alert(error.message || "Failed to save inventory");
    } else {
      alert(editInventory ? "Inventory updated successfully!" : "Inventory added successfully!");
      fetchInventory();
      setShowInventoryForm(false);
      setEditInventory(null);
    }
  };

  const handleEquipmentSubmit = async (e) => {
    e.preventDefault();

    // Determine which object to use based on whether we're editing or adding
    const equipmentToSubmit = editEquipment || newEquipment;
    
    // Safely format dates with validation
    const formatDate = (dateString) => {
      if (!dateString) return null;
      
      // Check if date is valid
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return null; // Return null for invalid dates
      }
      
      return date.toISOString().split("T")[0];
    };

    const formattedEquipment = {
      ...equipmentToSubmit,
      purchase_date: formatDate(equipmentToSubmit.purchase_date),
      last_serviced: formatDate(equipmentToSubmit.last_serviced)
    };

    try {
      const url = editEquipment
        ? `http://localhost:5000/api/equipment/${editEquipment.equipment_id}`
        : "http://localhost:5000/api/equipment";

      const method = editEquipment ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedEquipment),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.message || "Failed to save equipment");
      } else {
        alert(editEquipment ? "Equipment updated successfully!" : "Equipment added successfully!");
        fetchEquipment();
        setShowEquipmentForm(false);
        setEditEquipment(null);
        // Reset form after successful submission
        setNewEquipment({
          equipment_name: "",
          equipment_type: "",
          brand: "",
          model: "",
          quantity: 1,
          purchase_date: "",
          status: "Active",
          last_serviced: "",
          added_by: "",
        });
      }
    } catch (error) {
      console.error("Network or server error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const handleEditInventory = (item) => {
    setEditInventory(item);
    setShowInventoryForm(true);
  };

  const handleEditEquipment = (equipment) => {
    // Format dates to YYYY-MM-DD for HTML date input compatibility
    const formattedEquipment = {
      ...equipment,
      purchase_date: equipment.purchase_date ? equipment.purchase_date.split('T')[0] : '',
      last_serviced: equipment.last_serviced ? equipment.last_serviced.split('T')[0] : ''
    };
    
    setEditEquipment(formattedEquipment);
    setShowEquipmentForm(true);
  };

  const handleInventoryNext = () => {
    if ((inventoryPage + 1) * recordsPerPage < inventoryData.length) {
      setInventoryPage(inventoryPage + 1);
    }
  };

  const handleInventoryPrevious = () => {
    if (inventoryPage > 0) {
      setInventoryPage(inventoryPage - 1);
    }
  };

  const handleEquipmentNext = () => {
    if ((equipmentPage + 1) * recordsPerPage < equipmentData.length) {
      setEquipmentPage(equipmentPage + 1);
    }
  };

  const handleEquipmentPrevious = () => {
    if (equipmentPage > 0) {
      setEquipmentPage(equipmentPage - 1);
    }
  };

  return (
    <div className="inventory-equipment-container">
      <Sidebar />
      <div className="content">
        {/* Inventory Section */}
        <div className="table-section">
          <div className="table-header">
            <h2>Inventory</h2>
            <button onClick={() => {
              setEditInventory(null);
              setShowInventoryForm(true);
            }}>
              Add Inventory
            </button>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Item Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Supplier</th>
                <th>Purchase Date</th>
                <th>Expiry Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {inventoryData
                .slice(inventoryPage * recordsPerPage, (inventoryPage + 1) * recordsPerPage)
                .map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.item_name}</td>
                    <td>{item.category}</td>
                    <td>{item.quantity}</td>
                    <td>{item.supplier}</td>
                    <td>{item.purchase_date}</td>
                    <td>{item.expiry_date}</td>
                    <td>
                      <button onClick={() => handleEditInventory(item)}>Edit</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className="pagination-buttons">
            <button onClick={handleInventoryPrevious} disabled={inventoryPage === 0}>
              Previous
            </button>
            <button
              onClick={handleInventoryNext}
              disabled={(inventoryPage + 1) * recordsPerPage >= inventoryData.length}
            >
              Next
            </button>
          </div>
        </div>

        {/* Equipment Section */}
        <div className="equipment-table-section">
          <div className="table-header">
            <h2>Equipment</h2>
            <button onClick={() => {
              setEditEquipment(null);
              setShowEquipmentForm(true);
            }}>
              Add Equipment
            </button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Brand</th>
                <th>Model</th>
                <th>Quantity</th>
                <th>Purchase Date</th>
                <th>Status</th>
                <th>Last Serviced</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {equipmentData
                .slice(equipmentPage * recordsPerPage, (equipmentPage + 1) * recordsPerPage)
                .map((eq) => (
                  <tr key={eq.equipment_id}>
                    <td>{eq.equipment_name}</td>
                    <td>{eq.equipment_type}</td>
                    <td>{eq.brand}</td>
                    <td>{eq.model}</td>
                    <td>{eq.quantity}</td>
                    <td>{eq.purchase_date}</td>
                    <td>{eq.status}</td>
                    <td>{eq.last_serviced}</td>
                    <td>
                      <button onClick={() => handleEditEquipment(eq)}>Edit</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className="pagination-buttons">
            <button onClick={handleEquipmentPrevious} disabled={equipmentPage === 0}>
              Previous
            </button>
            <button
              onClick={handleEquipmentNext}
              disabled={(equipmentPage + 1) * recordsPerPage >= equipmentData.length}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Form Modal */}
      {showInventoryForm && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>{editInventory ? "Edit Inventory" : "Add Inventory"}</h3>
            <form onSubmit={handleInventorySubmit}>
              {Object.keys(newInventory).map((field) => (
                <input
                  key={field}
                  type={field.includes("date") ? "date" : "text"}
                  name={field}
                  placeholder={field.replace("_", " ")}
                  value={editInventory ? editInventory[field] || "" : newInventory[field]}
                  onChange={(e) =>
                    editInventory
                      ? setEditInventory({ ...editInventory, [field]: e.target.value })
                      : setNewInventory({ ...newInventory, [field]: e.target.value })
                  }
                  required={field !== "supplier" && field !== "expiry_date"}
                />
              ))}
              <div className="popup-buttons">
                <button type="submit">{editInventory ? "Update" : "Submit"}</button>
                <button type="button" onClick={() => {
                  setShowInventoryForm(false);
                  setEditInventory(null);
                }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Equipment Form Modal */}
      {showEquipmentForm && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>{editEquipment ? "Edit Equipment" : "Add Equipment"}</h3>
            <form onSubmit={handleEquipmentSubmit}>
              {Object.keys(newEquipment).map((field) => {
                // For date fields, ensure proper format
                let fieldValue = editEquipment ? (editEquipment[field] || "") : newEquipment[field];
                
                // For debugging
                if (field.includes('date') && editEquipment) {
                  console.log(`Field ${field}:`, fieldValue);
                }
                
                return (
                  <input
                    key={field}
                    type={field.includes("date") ? "date" : field === "quantity" ? "number" : "text"}
                    name={field}
                    placeholder={field.replace(/_/g, " ")}
                    value={fieldValue}
                    onChange={(e) =>
                      editEquipment
                        ? setEditEquipment({ ...editEquipment, [field]: e.target.value })
                        : setNewEquipment({ ...newEquipment, [field]: e.target.value })
                    }
                    required={field !== "brand" && field !== "model" && field !== "last_serviced"}
                  />
                );
              })}
              <div className="popup-buttons">
                <button type="submit">{editEquipment ? "Update" : "Submit"}</button>
                <button type="button" onClick={() => {
                  setShowEquipmentForm(false);
                  setEditEquipment(null);
                }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryEquipmentPage;
