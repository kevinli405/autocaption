import React from "react";

const SubtitleControls = ({ selectedSubtitle, updateSubtitle }) => {
  const isDisabled = !selectedSubtitle; // Inputs are disabled when no subtitle is selected

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        opacity: isDisabled ? 0.5 : 1, // Make the component appear "grayed out" when disabled
      }}
    >
      <h3 style={{ marginTop: "0px", marginBottom: "15px", fontSize: "18px" }}>Subtitle Controls</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
          gap: "15px",
        }}
      >

        {/* Font Input */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontWeight: "bold", marginBottom: "15px" }}>Font:</label>
          <select
            value={selectedSubtitle?.font ?? ""}
            onChange={(e) => updateSubtitle("font", e.target.value)}
            disabled={isDisabled}
            style={{
              ...inputStyle,
              padding: "9px", // Adjust padding for better dropdown appearance
            }}
          >
            <option value="">Select Font</option> {/* Default option */}
            <option value="Arial">Arial</option>
            <option value="Verdana">Verdana</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
          </select>
        </div>

        {/* Size Input */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontWeight: "bold", marginBottom: "5px" }}>Size:</label>
          <input
            type="number"
            value={selectedSubtitle?.size ?? ""}
            onChange={(e) => updateSubtitle("size", parseInt(e.target.value))}
            disabled={isDisabled}
            style={inputStyle}
          />
        </div>

        {/* Color Input */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontWeight: "bold", marginBottom: "5px" }}>Color:</label>
          <input
            type="color"
            value={selectedSubtitle?.color ?? "#000000"}
            onChange={(e) => updateSubtitle("color", e.target.value)}
            disabled={isDisabled}
            style={{
              ...inputStyle,
              height: "38px",
              padding: "1px",
            }}
          />
        </div>

        {/* Start Time Input */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontWeight: "bold", marginBottom: "5px" }}>Start Time:</label>
          <input
            type="number"
            value={selectedSubtitle?.start ?? ""}
            onChange={(e) => updateSubtitle("start", parseFloat(e.target.value))}
            step="0.1"
            min="0"
            disabled={isDisabled}
            style={inputStyle}
          />
        </div>

        {/* End Time Input */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontWeight: "bold", marginBottom: "5px" }}>End Time:</label>
          <input
            type="number"
            value={selectedSubtitle?.end ?? ""}
            onChange={(e) => updateSubtitle("end", parseFloat(e.target.value))}
            step="0.1"
            min="0"
            disabled={isDisabled}
            style={inputStyle}
          />
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  boxSizing: "border-box",
  fontSize: "14px",
};

export default SubtitleControls;
