// src/components/atoms/Upload/InputUpload.jsx
"use client";

import Input from "../Input/Input";

export default function InputUpload({ placeholder, value, onChange }) {
    return <Input type="file" placeholder={placeholder} value={value} onChange={onChange} />;
}