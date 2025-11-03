import React from "react";
import "./Box.css";

export interface BoxProps {
  match: string
  value: string | boolean
}

const Box: React.FC<BoxProps> = ({ match, value }) => {
  const displayValue = typeof value === "boolean" ? (value ? "Ano" : "Ne") : value
  return <div className={`box ${match}`}>{displayValue}</div>
}

export default Box;
