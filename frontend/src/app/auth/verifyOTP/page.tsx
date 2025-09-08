"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { CiLock } from "react-icons/ci";
import Input from "@/components/ui/Input";
import Button from "@/components/Button";
import Container from "@/components/layout/Container";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/loader";

// OTP validation schema
const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

type OtpFormData = z.infer<typeof otpSchema>;

export default function VerifyEmailPage() {
  const { verifyEmail, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEmail = localStorage.getItem("reset-password-email");
      if (savedEmail) {
        setEmail(savedEmail);
      } else {
        router.push("/auth/signup");
        toast.error("No verification email found. Please sign up first.");
      }
    }
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = async (data: OtpFormData) => {
    if (!email) {
      toast.error("Email not found. Please try signing up again.");
      return;
    }

    setIsSubmitting(true);

    try {
      await verifyEmail(email, data.otp);
      toast.success("Email verified successfully! You can now reset.");
      // Clear the email from localStorage after successful verification
      localStorage.removeItem("pendingVerificationEmail");
      router.push("/auth/reset-password");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Verification failed";
      toast.error(errorMessage);
      console.error("Verification error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<OtpFormData>({
  //   resolver: zodResolver(otpSchema),
  //   defaultValues: {
  //     otp: "",
  //   },
  // });

  // const onSubmit = async (data: OtpFormData) => {
  //   setIsSubmitting(true);

  //   try {
  //     const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  //     console.log("Sending request to:", `${apiUrl}api/auth/verifyOTP/`);
  //     console.log(
  //       "Request body:",
  //       JSON.stringify({
  //         email: email,
  //         otp: data.otp,
  //       })
  //     );

  //     const response = await fetch(`${apiUrl}api/auth/verifyOTP/`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Accept: "application/json",
  //       },
  //       body: JSON.stringify({
  //         email: email,
  //         otp: data.otp,
  //       }),
  //     });

  //     const responseData = await response.json();
  //     console.log("Response status:", response.status);
  //     console.log("Response data:", responseData);

  //     if (!response.ok) {
  //       let errorMessage = responseData.message || "Verification failed";

  //       // If there are validation errors in the entity object
  //       if (responseData.entity) {
  //         const validationErrors = Object.entries(responseData.entity)
  //           .map(([field, errors]) => {
  //             if (Array.isArray(errors)) {
  //               return `${field}: ${errors.join(", ")}`;
  //             }
  //             return `${field}: ${errors}`;
  //           })
  //           .join("\n");

  //         if (validationErrors) {
  //           errorMessage += "\n" + validationErrors;
  //         }
  //       }

  //       throw new Error(errorMessage);
  //     }

  //     toast.success("Email verified successfully! You can now log in.");
  //     router.push("/auth/login");
  //   } catch (error) {
  //     const errorMessage =
  //       error instanceof Error ? error.message : "An error occurred";
  //     toast.error(errorMessage);
  //     console.error("Verification error:", error);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  return (
    <Container className="py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Verify Your Email
            </h1>
            <p className="mt-2 text-gray-600">
              We've sent a 6-digit code to{" "}
              <span className="font-medium">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Input
                label="Enter 6-digit code"
                icon={CiLock}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={6}
                autoComplete="one-time-code"
                {...register("otp")}
                error={errors.otp?.message}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <Link
                href="/auth/resend-verification"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Didn't receive a code?
              </Link>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Verifying..." : "Verify Email"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Container>
  );
}
