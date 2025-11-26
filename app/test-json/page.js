"use client";
import React, { useEffect, useState } from "react";

export default function TestJsonPage() {
  const [results, setResults] = useState({});
  const sections = ["profile", "projects", "skills", "experience", "education"];

  useEffect(() => {
    const checkFiles = async () => {
      const newResults = {};
      
      for (const section of sections) {
        try {
          const start = performance.now();
          const res = await fetch(`/data/${section}.json`, { cache: 'no-store' });
          const end = performance.now();
          
          if (res.ok) {
            const json = await res.json();
            newResults[section] = {
              status: "✅ OK",
              time: `${(end - start).toFixed(2)}ms`,
              size: `${JSON.stringify(json).length} bytes`,
              data: json
            };
          } else {
            newResults[section] = {
              status: `❌ Failed (${res.status})`,
              error: res.statusText
            };
          }
        } catch (err) {
          newResults[section] = {
            status: "❌ Error",
            error: err.message
          };
        }
      }
      setResults(newResults);
    };
    
    checkFiles();
  }, []);

  return (
    <div style={{ padding: "40px", fontFamily: "monospace", background: "#111", color: "#fff", minHeight: "100vh" }}>
      <h1>Local JSON File Test</h1>
      <p>Checking public/data/*.json files...</p>
      
      <div style={{ display: "grid", gap: "20px", marginTop: "20px" }}>
        {sections.map(section => (
          <div key={section} style={{ 
            padding: "20px", 
            border: "1px solid #333", 
            borderRadius: "8px",
            background: results[section]?.status?.includes("OK") ? "#1a2e1a" : "#2e1a1a"
          }}>
            <h3 style={{ margin: "0 0 10px 0", textTransform: "capitalize" }}>
              {section}.json
            </h3>
            
            {results[section] ? (
              <div>
                <div style={{ fontSize: "1.2em", marginBottom: "10px" }}>
                  {results[section].status}
                </div>
                {results[section].time && <div>⏱️ Load time: {results[section].time}</div>}
                {results[section].size && <div>📦 Size: {results[section].size}</div>}
                {results[section].error && <div style={{ color: "#ff4444" }}>Error: {results[section].error}</div>}
              </div>
            ) : (
              <div>Loading...</div>
            )}
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: "40px", padding: "20px", background: "#222", borderRadius: "8px" }}>
        <h3>Debug Info:</h3>
        <p>If files are missing, run: <code>.\download-json-files.ps1</code></p>
        <p>If files exist but fail to load, check console logs.</p>
      </div>
    </div>
  );
}
