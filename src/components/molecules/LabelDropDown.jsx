// src/components/molecules/LabelDropDown.jsx
"use client";

import DropDown from "../atoms/DropDown/DropDown";
import Label from "../atoms/Label/Label";

export default function LabelDropDown({ label, options, value, onChange }) {
    return (
        <div className="label-drop-down">
            <Label>{label}</Label>
            <DropDown options={options} value={value} onChange={onChange} />
        </div>
    );
}