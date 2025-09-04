"use client";
import React, { useState } from "react";
import { Reorder } from "framer-motion";

// Example section data
const initialVerticalSections = [
  { id: "summary", title: "Summary", content: "Motivated developer..." },
  { id: "experience", title: "Experience", content: "ABC Corp..." },
  { id: "education", title: "Education", content: "BSc Computer Science" },
];

const initialHorizontalSections = [
  { id: "skills", title: "Skills", content: "React, Node.js..." },
  { id: "certifications", title: "Certifications", content: "AWS, PMP" },
  { id: "projects", title: "Projects", content: "Portfolio site..." },
];

export default function ResumeReorder() {
  const [verticalSections, setVerticalSections] = useState(
    initialVerticalSections
  );
  const [horizontalSections, setHorizontalSections] = useState(
    initialHorizontalSections
  );

  return (
    <div style={{ maxWidth: 650, margin: "0 auto", fontFamily: "sans-serif" }}>
      <h2>Reorder Resume Sections</h2>

      <h3>Vertical (Main) Sections</h3>
      <Reorder.Group
        axis="y"
        values={verticalSections}
        onReorder={setVerticalSections}
        style={{ gap: 12, marginBottom: 32 }}
      >
        {verticalSections.map((section) => (
          <Reorder.Item
            key={section.id}
            value={section}
            style={{
              padding: 16,
              background: "#f7fafc",
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              marginBottom: 10,
              boxShadow: "0 2px 4px rgba(150,150,150,0.04)",
              cursor: "grab",
            }}
          >
            <strong>{section.title}</strong>
            <p style={{ margin: 0, color: "#555" }}>{section.content}</p>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <h3>Horizontal Sections</h3>
      <Reorder.Group
        axis="x"
        values={horizontalSections}
        onReorder={setHorizontalSections}
        style={{
          display: "flex",
          gap: 12,
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        {horizontalSections.map((section) => (
          <div key={section.id} className="hover:border-blue-400 hover:border-1 rounded-lg">
            <Reorder.Item
              value={section}
              style={{
                minWidth: 160,
                textAlign: "center",
                padding: 16,
                background: "#f0f4fa",
                border: "1px solid #a0aec0",
                borderRadius: 8,
                cursor: "grab",
                flex: "0 0 auto",
              }}
            >
              <strong>{section.title}</strong>
              <p style={{ margin: 0, color: "#555" }}>{section.content}</p>
            </Reorder.Item>
          </div>
        ))}
      </Reorder.Group>

      <button
        style={{ marginTop: 28, padding: "8px 16px" }}
        onClick={() => {
          const verticalOrder = verticalSections.map((s) => s.id);
          const horizontalOrder = horizontalSections.map((s) => s.id);
          alert(
            "Vertical: " +
              verticalOrder.join(", ") +
              "\nHorizontal: " +
              horizontalOrder.join(", ")
          );
        }}
      >
        Get Section Orders
      </button>
    </div>
  );
}
