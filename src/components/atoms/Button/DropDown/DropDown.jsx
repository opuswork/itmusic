// src/components/atoms/DropDown/DropDown.jsx
"use client";

export default function DropDown({ options, value, onChange }) {
    return (
        <div className="drop-down">
            <select value={value} onChange={onChange}>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select>
        </div>
    );
}
