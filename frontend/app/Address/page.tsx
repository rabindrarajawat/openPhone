"use client";
import React, { useState } from "react";
import styles from "./page.module.css"; // Import the CSS module

const TwoColumns = () => {
  const [column1Width, setColumn1Width] = useState(300); // Initial width for Column 1
  const [column2Width, setColumn2Width] = useState(300); // Initial width for Column 2

  const handleMouseDown = (e: React.MouseEvent, column: string) => {
    const startX = e.clientX;
    const startColumn1Width = column1Width;
    const startColumn2Width = column2Width;

    const onMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;

      if (column === "column1") {
        setColumn1Width(startColumn1Width + deltaX);
      } else if (column === "column2") {
        setColumn2Width(startColumn2Width + deltaX);
      }
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div className="container-fluid">
      <div className="row d-flex justify-content-center">
        <div className="d-flex" style={{ width: "100%" }}>
          {/* Column 1 */}
          <div
            className={`${styles.column}`}
            style={{
              width: `${column1Width}px`,
              flexShrink: 0, // Prevent column 1 from shrinking
            }}
          >
            <h2>Column 1</h2>
            <p>This column can be resized by dragging its right border.</p>
          </div>

          {/* Resizer for Column 1 */}
          <div
            className={styles.resizer}
            onMouseDown={(e) => handleMouseDown(e, "column1")}
          />

          {/* Column 2 */}
          <div
            className={`${styles.column} ${styles.column2}`}
            style={{
              width: `${column2Width}px`,
              flexShrink: 0, // Prevent column 2 from shrinking
            }}
          >
            <h2>Column 2</h2>
            <p>This column can also be resized by dragging its right border.</p>
          </div>

          {/* Resizer for Column 2 */}
          <div
            className={styles.resizer}
            onMouseDown={(e) => handleMouseDown(e, "column2")}
          />
        </div>
      </div>
    </div>
  );
};

export default TwoColumns;
