// src/pages/ComposePage.jsx
import React from "react";
import SectionsEditor from "../components/SectionsEditor";
import ChatBox from "../components/ChatBox";
import { useUpload } from "../UploadContext";
import * as api from "../api";

export default function ComposePage() {
  const {
    uploadId,
    // note: uploadId is the upload_id from /upload; your /generate endpoint expects job_id in the backend code.
    // The backend's /generate and /generate_template require job_id. Ensure you pass job_id in context (job_id).
    jobId, // if you stored job_id in context; if not, use uploadResult.job_id where you stored it
    sections,
    setSections,
    topK,
    setTopK,
    setGenerated,
    setDownloadUrl,
    setLoading,
    loading,
    token
  } = useUpload();

  // If your context stores uploadResult with job_id, adapt accordingly.
  async function generateReport() {
    const job_id = jobId || uploadId; // adapt if you stored jobId elsewhere
    if (!job_id) {
      alert("Upload a PDF first (go to Upload).");
      return;
    }
    setLoading(true);
    try {
      const res = await api.generateReport({ job_id, sections, tone: "formal" }, token);
      setGenerated(res.template?.content || {});
      setDownloadUrl(res.download || api.downloadUrlFor(job_id));
    } catch (err) {
      console.error("Generate failed:", err);
      alert("Generate failed: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", gap: 20 }}>
      <div style={{ flex: 1 }}>
        <div className="card">
          <h3>Template Sections</h3>
          <SectionsEditor sections={sections} setSections={setSections} />
          <div style={{ marginTop: 12 }}>
            <label>
              Top sentences per section:
              <input
                type="number"
                min="1"
                max="6"
                value={topK}
                onChange={(e) => setTopK(Number(e.target.value))}
                style={{ marginLeft: 8 }}
              />
            </label>
            <div style={{ marginTop: 10 }}>
              <button className="primary" onClick={generateReport} disabled={loading}>
                {loading ? "Generating..." : "Generate Report"}
              </button>
            </div>
          </div>
        </div>

        <ChatBox
          onAddSection={(sec) => {
            if (!sec) return;
            setSections((s) => [...s, sec]);
          }}
        />
      </div>

      <aside style={{ width: 420 }}>
        <div className="card">
          <h3>Preview Sections</h3>
          {sections.map((s, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <strong>{s}</strong>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
