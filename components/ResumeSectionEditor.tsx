"use client";
import React, { useEffect, useState } from "react";
import { Reorder } from "framer-motion";
import { createResumeWithLayoutPDF } from "@/lib/utils";
import { Eye } from "lucide-react";

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
  // Separate name and contact sections from others
  const horizontalSections = sections.filter((section) =>
    ["name", "contact"].includes(section.key.toLowerCase())
  );
  const otherSections = sections.filter(
    (section) => !["name", "contact"].includes(section.key.toLowerCase())
  );

  const GeneratePdfPreview = async () => {
    const pdfBytes = await createResumeWithLayoutPDF(
      sections,
      sections.map((s) => s.key)
    );
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  useEffect(() => {
    setSections(resumeSections);
  }, [resumeSections]);

  return (
    <div className="w-full mx-auto p-4">
      {sections ? (
        <div className="relative">
          <div className="bg-white shadow rounded-lg p-6">
            {/* Horizontal reorderable layout for Name and Contact */}
            {horizontalSections.length > 0 && (
              <div>
                <Reorder.Group
                  axis="x"
                  values={horizontalSections}
                  onReorder={(newOrder) => {
                    // Reconstruct the full sections array with reordered horizontal sections
                    const updatedSections = [...newOrder, ...otherSections];
                    setSections(updatedSections);
                  }}
                  style={{
                    display: "flex",
                    gap: 16,
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                  }}
                >
                  {horizontalSections.map((section) => (
                    <Reorder.Item
                      key={section.key}
                      value={section}
                      style={{
                        flex: 1,
                        padding: 16,
                        boxShadow: "0 2px 4px rgba(150,150,150,0.04)",
                        cursor: "grab",
                        borderRadius: "8px",
                      }}
                    >
                      <div className="hover:bg-gray-50 hover:border-blue-400 hover:border p-2 rounded">
                        <strong>{section.key}</strong>
                        <p style={{ margin: 0, color: "#555" }}>
                          {section.value}
                        </p>
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              </div>
            )}

            {/* Vertical layout for other sections */}
            {otherSections.length > 0 && (
              <Reorder.Group
                axis="y"
                values={otherSections}
                onReorder={(newOrder) => {
                  // Reconstruct the full sections array maintaining horizontal sections at top
                  const updatedSections = [...horizontalSections, ...newOrder];
                  setSections(updatedSections);
                }}
                style={{ gap: 8 }}
              >
                {otherSections.map((section) => (
                  <Reorder.Item
                    key={section.key}
                    value={section}
                    style={{
                      padding: 16,
                      boxShadow: "0 2px 4px rgba(150,150,150,0.04)",
                      cursor: "grab",
                    }}
                  >
                    <div className="hover:bg-gray-50 hover:border-blue-400 hover:border p-2 rounded">
                      <strong>{section.key}</strong>
                      <p style={{ margin: 0, color: "#555" }}>
                        {section.value}
                      </p>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            )}
          </div>
          <button
            className="px-4 py-3 bg-blue-500 flex items-center justify-center text-white rounded absolute top-5 right-5 cursor-pointer z-10"
            onClick={GeneratePdfPreview}
          >
            <Eye className="inline-block" size={16} />
          </button>
        </div>
      ) : (
        <p>Loading sections...</p>
      )}
    </div>
  );
}
