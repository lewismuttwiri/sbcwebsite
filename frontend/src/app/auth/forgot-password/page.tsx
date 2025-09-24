"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { FiMail } from "react-icons/fi";
import Link from "next/link";
import Container from "@/components/layout/Container";
import Input from "@/components/ui/Input";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormData = z.infer<typeof formSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      localStorage.setItem("reset-password-email", data.email);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}auth/api/auth/sendOTP/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: data.email }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to send reset email");
      }

      setEmailSent(true);
      router.push("/auth/verifyOTP");
      toast.success("Password reset link sent to your email!");
    } catch (error: any) {
      toast.error(
        error.message || "Failed to send reset email. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (emailSent) {
    return (
      <Container className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="bg-green-50 rounded-full p-4 inline-flex items-center justify-center">
            <FiMail className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {/* Check your email */}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a password reset link to your email address. Please check
            your inbox and follow the instructions to reset your password.
          </p>
          <div className="mt-6">
            <Link
              href="/auth/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Back to login
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Forgot your password?
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              label="Email address"
              id="email"
              type="email"
              autoComplete="email"
              required
              icon={FiMail}
              {...register("email")}
              error={errors.email?.message}
            />
          </div>

          <div>
            <Button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send reset link"}
            </Button>
          </div>
        </form>

        <div className="text-sm text-center">
          <Link
            href="/auth/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Back to login
          </Link>
        </div>
      </div>
    </Container>
  );
}
