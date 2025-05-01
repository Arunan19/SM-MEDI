import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/admin side bar";
import "./Inventory.css";

const InventoryEquipmentPage = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [equipmentData, setEquipmentData] = useState([]);
  const [showInventoryForm, setShowInventoryForm] = useState(false);
  const [showEquipmentForm, setShowEquipmentForm] = useState(false);

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
    await fetch("http://localhost:5000/api/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newInventory),
    });
    fetchInventory();
    setShowInventoryForm(false);
  };

  const handleEquipmentSubmit = async (e) => {
    e.preventDefault();

    // Format date fields to YYYY-MM-DD
    const formattedEquipment = {
      ...newEquipment,
      purchase_date: new Date(newEquipment.purchase_date).toISOString().split("T")[0],
      last_serviced: newEquipment.last_serviced
        ? new Date(newEquipment.last_serviced).toISOString().split("T")[0]
        : null, // Handle optional field
    };

    try {
      const response = await fetch("http://localhost:5000/api/equipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedEquipment),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error adding equipment:", error);
        alert(error.message || "Failed to add equipment");
      } else {
        alert("Equipment added successfully!");
        fetchEquipment();
        setShowEquipmentForm(false);
      }
    } catch (error) {
      console.error("Network or server error:", error);
      alert("An error occurred. Please try again later.");
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
            <button onClick={() => setShowInventoryForm(true)}>Add Inventory</button>
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
              </tr>
            </thead>
            <tbody>
              {inventoryData.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.item_name}</td>
                  <td>{item.category}</td>
                  <td>{item.quantity}</td>
                  <td>{item.supplier}</td>
                  <td>{item.purchase_date}</td>
                  <td>{item.expiry_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Equipment Section */}
        <div className="equipment-table-section">
          <div className="table-header">
            <h2>Equipment</h2>
            <button onClick={() => setShowEquipmentForm(true)}>Add Equipment</button>
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
              </tr>
            </thead>
            <tbody>
              {equipmentData.map((eq) => (
                <tr key={eq.equipment_id}>
                  <td>{eq.equipment_name}</td>
                  <td>{eq.equipment_type}</td>
                  <td>{eq.brand}</td>
                  <td>{eq.model}</td>
                  <td>{eq.quantity}</td>
                  <td>{eq.purchase_date}</td>
                  <td>{eq.status}</td>
                  <td>{eq.last_serviced}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory Popup Form */}
      {showInventoryForm && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>Add Inventory</h3>
            <form onSubmit={handleInventorySubmit}>
              {Object.keys(newInventory).map((field) => (
                <input
                  key={field}
                  type={field.includes("date") ? "date" : "text"}
                  name={field}
                  placeholder={field.replace("_", " ")}
                  value={newInventory[field]}
                  onChange={(e) =>
                    setNewInventory({ ...newInventory, [field]: e.target.value })
                  }
                  required={field !== "supplier"}
                />
              ))}
              <div className="popup-buttons">
                <button type="submit">Submit</button>
                <button type="button" onClick={() => setShowInventoryForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Equipment Popup Form */}
      {showEquipmentForm && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>Add Equipment</h3>
            <form onSubmit={handleEquipmentSubmit}>
              {Object.keys(newEquipment).map((field) => (
                <input
                  key={field}
                  type={field.includes("date") ? "date" : "text"}
                  name={field}
                  placeholder={field.replace("_", " ")}
                  value={newEquipment[field]}
                  onChange={(e) =>
                    setNewEquipment({ ...newEquipment, [field]: e.target.value })
                  }
                  required={field !== "brand" && field !== "model" && field !== "last_serviced"}
                />
              ))}
              <div className="popup-buttons">
                <button type="submit">Submit</button>
                <button type="button" onClick={() => setShowEquipmentForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryEquipmentPage;
