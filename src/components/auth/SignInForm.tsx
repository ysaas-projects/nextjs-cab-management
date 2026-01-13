"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/atoms/Button";
import CustomInput from "../atoms/CustomInput";

import { useLoginMutation } from "@/features/auth/authApi";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/features/auth/authSlice";
import Icon from "../atoms/Icon";

export default function SignInForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await login({ username, password }).unwrap();

      dispatch(setCredentials(response));

      router.replace("/");
    } catch (err: any) {
      setError(err?.data?.message || "Invalid username or password");
    }
  };


  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <h1 className="text-xl font-semibold mb-4">Sign In</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <CustomInput
            label="Username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <div className="relative">
            <CustomInput
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[42px] cursor-pointer"
            >
              {showPassword ? <Icon name="EyeIcon" /> : <Icon name="EyeCloseIcon" />}
            </span>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
