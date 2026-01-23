// src/components/atoms/Search/InputSearch.jsx
"use client";

import Input from "../atoms/Input/Input";

export default function InputSearch({ placeholder, value, onChange }) {
    return <Input type="search" placeholder={placeholder} value={value} onChange={onChange} />;
}