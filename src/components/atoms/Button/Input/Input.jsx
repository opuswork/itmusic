// src/components/atoms/Input/Input.jsx
"use client";

export default function Input({ type, placeholder, value, onChange }) {
    return <input type={type} placeholder={placeholder} value={value} onChange={onChange} />;
}