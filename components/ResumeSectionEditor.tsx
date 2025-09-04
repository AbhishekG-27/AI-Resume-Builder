"use client";
import React, { useEffect, useState } from "react";
import { Reorder } from "framer-motion";

// Your initial section data
// const initialSections = [
//   { id: "summary", title: "Summary", content: "A motivated developer..." },
//   { id: "experience", title: "Experience", content: "ABC Corp..." },
//   { id: "skills", title: "Skills", content: "React, Node.js..." },
//   { id: "education", title: "Education", content: "BSc Computer Science" },
// ];

export default function ResumeReorder({
  resumeSections,
}: {
  resumeSections: { key: string; value: string }[];
}) {
  const [sections, setSections] = useState<{ key: string; value: string }[]>(
    []
  );

  useEffect(() => {
    setSections(resumeSections);
  }, [resumeSections]);

  return (
    <div className="w-full mx-auto p-4">
      {sections ? (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">
            Reorder Resume Sections
          </h2>
          <Reorder.Group
            axis="y"
            values={sections}
            onReorder={setSections}
            style={{ gap: 12 }}
          >
            {sections.map((section) => (
              <Reorder.Item
                key={section.key}
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
                <strong>{section.key}</strong>
                <p style={{ margin: 0, color: "#555" }}>{section.value}</p>
              </Reorder.Item>
            ))}
          </Reorder.Group>
          <button
            style={{ marginTop: 20, padding: "8px 16px" }}
            onClick={() =>
              alert(
                "Current section order: " +
                  sections.map((s) => s.key).join(", ")
              )
            }
          >
            Get Section Order
          </button>
        </div>
      ) : (
        <p>Loading sections...</p>
      )}
    </div>
  );
}
