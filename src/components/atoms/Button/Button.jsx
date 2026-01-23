// src/components/atoms/Button/Button.jsx
"use client";

import { useRouter } from "next/navigation";
import { Styles } from "./Button.module.css";

export default function Button({ children, href }) {
    const router = useRouter();
    return <button className={Styles.button} onClick={() => router.push(href)}>{children}</button>;
}
