// src/components/molecules/InputLabel.jsx
"use client";

import Input from "../atoms/Input/Input";
import Label from "../atoms/Label/Label";

export default function InputLabel({ label, placeholder, value, onChange }) {
    return (
        <div className="input-label">
            <Label>{label}</Label>
            <Input type="text" placeholder={placeholder} value={value} onChange={onChange} />
        </div>
    );
}