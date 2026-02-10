"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { login } from "@/lib/auth/auth";

export default function AdminLogin() {
  const { register, handleSubmit } = useForm();
  const onSubmit = async (data) => {
    const response = await login(data.email, data.password);
    console.log(response);
  };
  return (
    <>
    <div className="login-box">
        {/* <!-- /.login-logo --> */}
        <div className="card card-outline card-primary">
            <div className="card-header text-center">
            <Link href="/dashboard" className="h1"><b>Admin Login</b></Link>
            </div>
            <div className="card-body">
            <p className="login-box-msg">Please login to start your session</p>

            <form action="/dashboard/auth/login" method="post">
                <div className="input-group mb-3">
                <input type="email" className="form-control" placeholder="Email" />
                <div className="input-group-append">
                    <div className="input-group-text">
                    <span className="fas fa-envelope"></span>
                    </div>
                </div>
                </div>
                <div className="input-group mb-3">
                <input type="password" className="form-control" placeholder="Password" />
                <div className="input-group-append">
                    <div className="input-group-text">
                    <span className="fas fa-lock"></span>
                    </div>
                </div>
                </div>
                <div className="row">

                {/* <!-- /.col --> */}
                <div className="col-4">
                    <button type="submit" className="btn btn-primary btn-block">Sign In</button>
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