"use client";
import React, { useEffect, useState } from "react";

export default function TestBlogsPage() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);

  const filesToTest = [
    "blogs.json",
    "project-explanations.json"
  ];

  useEffect(() => {
    const testFiles = async () => {
      const newResults = {};
      
      for (const file of filesToTest) {
        try {
          const startTime = performance.now();
          const response = await fetch(`/data/${file}`);
          const endTime = performance.now();
          
          if (response.ok) {
            const data = await response.json();
            newResults[file] = {
              status: "✅ OK",
              size: JSON.stringify(data).length,
              time: Math.round(endTime - startTime) + "ms",
              count: Array.isArray(data.data) ? data.data.length : "N/A"
            };
          } else {
            newResults[file] = {
              status: `❌ Failed (${response.status})`,
              error: response.statusText
            };
          }
        } catch (error) {
          newResults[file] = {
            status: "❌ Error",
            error: error.message
          };
        }
      }
      
      setResults(newResults);
      setLoading(false);
    };

    testFiles();
  }, []);

  return (
    <div style={{ padding: "40px", fontFamily: "monospace", background: "#111", color: "#fff", minHeight: "100vh" }}>
      <h1>Local JSON Test (Blogs & Explanations)</h1>
      
      {loading ? (
        <p>Testing files...</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #333", textAlign: "left" }}>
              <th style={{ padding: "10px" }}>File</th>
              <th style={{ padding: "10px" }}>Status</th>
              <th style={{ padding: "10px" }}>Size (bytes)</th>
              <th style={{ padding: "10px" }}>Items</th>
              <th style={{ padding: "10px" }}>Load Time</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(results).map(([file, result]) => (
              <tr key={file} style={{ borderBottom: "1px solid #222" }}>
                <td style={{ padding: "10px" }}>{file}</td>
                <td style={{ padding: "10px", color: result.status.includes("OK") ? "#4ade80" : "#ef4444" }}>
                  {result.status}
                </td>
                <td style={{ padding: "10px" }}>{result.size}</td>
                <td style={{ padding: "10px" }}>{result.count}</td>
                <td style={{ padding: "10px" }}>{result.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      <div style={{ marginTop: "40px", padding: "20px", background: "#222", borderRadius: "8px" }}>
        <h3>How to fix failures:</h3>
        <ol>
          <li>Check if files exist in <code>public/data/</code></li>
          <li>Run <code>.\generate-json.ps1</code> to regenerate files</li>
          <li>Check browser console for network errors</li>
        </ol>
      </div>
    </div>
  );
}
