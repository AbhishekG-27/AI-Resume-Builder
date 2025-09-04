"use client";
import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import react-pdf components with no SSR
const Document = dynamic(
  () => import("react-pdf").then((mod) => mod.Document),
  { ssr: false }
);

const Page = dynamic(() => import("react-pdf").then((mod) => mod.Page), {
  ssr: false,
});

// Import CSS files only on client side
const PDFViewer = ({ pdfUrl }: { pdfUrl: string }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set up PDF.js worker and CSS imports only on client side
    const setupPdfJs = async () => {
      const { pdfjs } = await import("react-pdf");
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

      // Import CSS files
      // await import("react-pdf/dist/Page/AnnotationLayer.css");
      // await import("react-pdf/dist/Page/TextLayer.css");

      setIsClient(true);
    };

    setupPdfJs();
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  // Don't render PDF until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="flex-1 overflow-auto p-4">
        <div className="flex items-center justify-center">
          <div className="text-center py-8">Loading PDF viewer...</div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex-1 overflow-auto p-4">
      <div className="flex items-center justify-center">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<div className="text-center py-8">Loading PDF...</div>}
          error={
            <div className="text-center py-8 text-red-600">
              Failed to load PDF
            </div>
          }
        >
          {Array.from(new Array(numPages), (el, index) => (
            <div
              key={`page_${index + 1}`}
              id={`page-${index + 1}`}
              className="mb-4 shadow-lg"
            >
              <Page
                pageNumber={index + 1}
                scale={1.5}
                loading={
                  <div className="text-center py-4">Loading page...</div>
                }
                error={
                  <div className="text-center py-4 text-red-600">
                    Failed to load page {index + 1}
                  </div>
                }
              />
            </div>
          ))}
        </Document>
      </div>
    </div>
  );
};

export default PDFViewer;
