"use client";

import Link from "next/link";
import styles from "./adminLogin.module.css";

export default function AdminLogin() {
  return (
    <>
    <div className={styles.loginBox}>
        {/* <!-- /.login-logo --> */}
        <div className={styles.card}>
            <div className={styles.cardHeader}>
            <Link href="/dashboard" className="h1"><b>Admin Login</b></Link>
            </div>
            <div className={styles.cardBody}>
            <p className="login-box-msg">Please login to start your session</p>

            <form action="/api/auth/login" method="post">
                <div className={styles.inputGroup}>
                <input type="text" name="id" className="form-control" placeholder="Username" required autoComplete="username" />
                <div className={styles.inputGroupAppend}>
                    <div className={styles.inputGroupText}>
                    <span className={styles.fasFaEnvelope}></span>
                    </div>
                </div>
                </div>
                <div className={styles.inputGroup}>
                <input type="password" name="password" className="form-control" placeholder="Password" required autoComplete="current-password" />
                <div className={styles.inputGroupAppend}>
                    <div className={styles.inputGroupText}>
                    <span className={styles.fasFaLock}></span>
                    </div>
                </div>
                </div>
                <div className={styles.row}>

                {/* <!-- /.col --> */}
                <div className={styles.col4}>
                    <button type="submit" className={styles.btnPrimaryBtnBlock}>Sign In</button>
                </div>
                {/* <!-- /.col --> */}
                </div>
            </form>

            {/* <!-- /.social-auth-links --> */}
            </div>
        </div>
    </div>
    </>
  );
}