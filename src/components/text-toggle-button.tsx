"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";

export default function TextToggleButton() {
  const [isExpanded, setIsExpandes] = useState(false);
  const handleChange = () => {
    setIsExpandes((prev) => !prev);
  };
  return (
    <Button onClick={handleChange}>
      {isExpanded ? "表示を戻す" : "すべて表示"}
    </Button>
  );
}
