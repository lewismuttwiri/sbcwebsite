// app/auth/reset-password/ResetPasswordForm.tsx
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { FiLock } from "react-icons/fi";
import Link from "next/link";
import Container from "@/components/layout/Container";
import Input from "@/components/ui/Input";
import Button from "@/components/Button";

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>;

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    // if (!token || !email) {
    //   toast.error("Invalid reset link. Please request a new one.");
    //   return;
    // }

    try {
      setIsSubmitting(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}auth/api/auth/resetpassword/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            email,
            password: data.password,
            password_confirmation: data.confirmPassword,
          }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to reset password");
      }

      setIsSuccess(true);
      toast.success("Password reset successful!");
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast.error(
        error.message || "Failed to reset password. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // if (!token || !email) {
  //   return (
  //     <Container className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
  //       <div className="max-w-md w-full space-y-8 text-center">
  //         <div className="bg-red-50 rounded-full p-4 inline-flex items-center justify-center">
  //           <FiLock className="h-12 w-12 text-red-600" />
  //         </div>
  //         <h2 className="mt-6 text-2xl font-extrabold text-gray-900">
  //           Invalid reset link
  //         </h2>
  //         <p className="mt-2 text-sm text-gray-600">
  //           The password reset link is invalid or has expired. Please request a
  //           new reset link.
  //         </p>
  //         <div className="mt-6">
  //           <Link
  //             href="/auth/forgot-password"
  //             className="font-medium text-blue-600 hover:text-blue-500"
  //           >
  //             Request new reset link
  //           </Link>
  //         </div>
  //       </div>
  //     </Container>
  //   );
  // }

  if (isSuccess) {
    return (
      <Container className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="bg-green-50 rounded-full p-4 inline-flex items-center justify-center">
            <FiLock className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="mt-6 text-2xl font-extrabold text-gray-900">
            Password updated
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your password has been successfully updated. You can now log in with
            your new password.
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
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please enter your new password below.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              label="New password"
              id="password"
              type="password"
              autoComplete="new-password"
              required
              icon={FiLock}
              {...register("password")}
              error={errors.password?.message}
            />
            <Input
              label="Confirm new password"
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              icon={FiLock}
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
            />
          </div>

          <div>
            <Button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Resetting..." : "Reset password"}
            </Button>
          </div>
        </form>
      </div>
    </Container>
  );
}
