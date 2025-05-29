"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SlEnvolope } from "react-icons/sl";
import { CiLock } from "react-icons/ci";
import { FaGoogle } from "react-icons/fa";
import Button from "@/components/Button";
import Input from "@/components/ui/Input";
import Link from "next/link";
import Container from "@/components/layout/Container";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/,
      "Password must contain uppercase, lowercase, and numbers"
    ),
});

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, error, clearError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    clearError();
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  useEffect(() => {
    // Store the current URL before login if coming from another page
    const currentPath = window.location.pathname;
    if (currentPath !== "/auth/login" && currentPath !== "/auth/signup") {
      sessionStorage.setItem(
        "redirectAfterLogin",
        window.location.pathname + window.location.search
      );
    }
  }, []);

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      const redirectTo = sessionStorage.getItem("redirectAfterLogin") || "/";
      await login(data.email, data.password, redirectTo);
      // Clear the stored redirect URL after successful login
      sessionStorage.removeItem("redirectAfterLogin");
    } catch (error: any) {
      console.error("Login failed:", error);
      const errorMessage =
        error?.message ||
        "Login failed. Please check your credentials and try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-10 bg-white">
        <Container className="px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              Sign in to your account
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Welcome back! Please sign in to continue
            </p>
          </div>
        </Container>
      </section>

      {/* Login Form */}
      <section className="py-20 bg-gray-50">
        <Container className="px-4">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <Input
                    label="Email address"
                    icon={SlEnvolope}
                    type="email"
                    {...register("email")}
                    error={errors.email?.message}
                  />

                  <Input
                    label="Password"
                    icon={CiLock}
                    type="password"
                    {...register("password")}
                    error={errors.password?.message}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link
                      href="/auth/forgot-password"
                      className="font-medium text-blue-600 hover:text-blue-500"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </div>

                <div className="text-center">
                  <Button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-full justify-center mb-4"
                  >
                    {isSubmitting ? "Signing in..." : "Sign in"}
                  </Button>
                </div>
                {/* 
                <div className="text-center">
                  <button
                    onClick={() => {
                      toast("Google login not implemented yet");
                      return;
                    }}
                    className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors w-full justify-center"
                  >
                    <FaGoogle className="w-5 h-5 mr-2" />
                    Continue with Google
                  </button>
                </div> */}

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link
                      href="/auth/signup"
                      className="font-medium text-blue-600 hover:text-blue-500"
                    >
                      Create one
                    </Link>
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        </Container>
      </section>
    </main>
  );
}
