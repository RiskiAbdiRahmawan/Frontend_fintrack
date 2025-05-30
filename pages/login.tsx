import React, { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { login } from "lib/auth";
import {
  Label,
  Input,
  Button,
  WindmillContext,
} from "@roketid/windmill-react-ui";
import { route } from "next/dist/server/router";

function LoginPage() {
  const { mode } = useContext(WindmillContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const imgSource =
    mode === "dark" ? "/assets/img/login.jpg" : "/assets/img/login.jpg";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email dan password harus diisi.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await login(email, password);

      console.log("login sukses", response);

      const role = response.user.role;

      if (role == "admin") {
        router.push("/admin/dashboard");
      } else if (role == "super_admin") {
        router.push("/superadmin/dashboard");
      } else {
        setError("Role tidak dikenal. Hubungi administrator.");
      }
    } catch (err: any) {
      if (err.response) {
        if (err.response.status === 422) {
          setError("Email dan password harus diisi.");
        } else if (err.response.status === 401) {
          setError(err.response.data.message || "Email atau password salah.");
        } else {
          setError("Terjadi kesalahan. Silakan coba lagi.");
        }
      } else {
        setError("Tidak dapat terhubung ke server.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center relative"
      style={{ backgroundImage: `url(${imgSource})` }}
    >
      <div className="absolute inset-0 bg-black opacity-30 z-0" />
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 text-center">
          Login
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-300 mb-6">
          Enter your email and password to login!
        </p>

        <form onSubmit={handleSubmit}>
          <Label className="mb-4 block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Email
            </span>
            <Input
              className="mt-1"
              placeholder="user@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Label>

          <Label className="mb-2 block">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Password
            </span>
            <Input
              className="mt-1"
              type="password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Label>

          <div className="flex justify-between items-center mb-6">
            {/* <Link href="/">
              <span className="text-sm text-indigo-600 hover:underline cursor-pointer">
                Forgot password?
              </span>
            </Link> */}
          </div>

          {error && <p className="text-red-600 text-center mb-4">{error}</p>}

          <Button
            block
            className="bg-indigo-600 hover:bg-indigo-700"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
