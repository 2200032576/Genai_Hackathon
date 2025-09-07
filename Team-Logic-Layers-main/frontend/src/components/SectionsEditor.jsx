import React from "react";

export default function SectionsEditor({ sections, setSections }) {
  function updateSection(i, val) {
    const copy = [...sections];
    copy[i] = val;
    setSections(copy);
  }
  function removeSection(i) {
    setSections(sections.filter((_, idx) => idx !== i));
  }
  function addSection() {
    setSections([...sections, "New Section"]);
  }

  return (
    <div className="card">
      <h3>Template Sections</h3>
      {sections.map((s, idx) => (
        <div key={idx} className="section-row">
          <input
            value={s}
            onChange={(e) => updateSection(idx, e.target.value)}
            className="section-input"
          />
          <button onClick={() => removeSection(idx)} className="danger small">
            Remove
          </button>
        </div>
      ))}
      <div style={{ marginTop: 8 }}>
        <button onClick={addSection} className="secondary small">
          + Add Section
        </button>
      </div>
    </div>
  );
}
