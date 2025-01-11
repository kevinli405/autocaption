import React from "react";

const SubtitleControls = ({ selectedSubtitle, updateSubtitle }) => {
  if (!selectedSubtitle) return null;

  return (
    <div style={{ border: "1px solid #ccc", display: "flex", flexWrap: "wrap", gap: "10px" }}>
      <h3 style={{ width: "100%" }}>Subtitle Controls</h3>

      {/* Text Input */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>Text:</label>
        <input
          type="text"
          value={selectedSubtitle.text}
          onChange={(e) => updateSubtitle("text", e.target.value)}
        />
      </div>

      {/* Font Input */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>Font:</label>
        <input
          type="text"
          value={selectedSubtitle.font}
          onChange={(e) => updateSubtitle("font", e.target.value)}
        />
      </div>

      {/* Size Input */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>Size:</label>
        <input
          type="number"
          value={selectedSubtitle.size}
          onChange={(e) => updateSubtitle("size", parseInt(e.target.value))}
        />
      </div>

      {/* Color Input */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>Color:</label>
        <input
          type="color"
          value={selectedSubtitle.color}
          onChange={(e) => updateSubtitle("color", e.target.value)}
        />
      </div>

      {/* Start Time Input */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>Start Time:</label>
        <input
          type="number"
          value={selectedSubtitle.start}
          onChange={(e) => updateSubtitle("start", parseFloat(e.target.value))}
          step="0.1"
          min="0"
        />
      </div>

      {/* End Time Input */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>End Time:</label>
        <input
          type="number"
          value={selectedSubtitle.end}
          onChange={(e) => updateSubtitle("end", parseFloat(e.target.value))}
          step="0.1"
          min="0"
        />
      </div>
    </div>
  );
};

export default SubtitleControls;
