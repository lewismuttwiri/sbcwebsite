"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CiLock, CiMail, CiPhone } from "react-icons/ci";
import { IoPersonCircle } from "react-icons/io5";
import Button from "@/components/Button";
import Input from "@/components/ui/Input";
import Link from "next/link";
import Container from "@/components/layout/Container";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// Form validation schema using Zod
const formSchema = z
  .object({
    firstName: z.string().min(2, "Full name must be at least 2 characters"),
    lastName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string().min(8, "Please confirm your password"),
    phoneNumber: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .regex(/^[0-9]+$/, "Phone number must contain only numbers"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>;

export default function SignUpPage() {
  const {
    register: authRegister,
    isLoading,
    error: authError,
    clearError,
  } = useAuth();

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Define the error type for API responses
  type ApiError = {
    message?: string;
    errors?: Record<string, string[]>;
  };

  const apiError = authError as unknown as ApiError | null;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Clear any previous errors when component mounts
  useEffect(() => {
    clearError();
    console.log(isLoading);
  }, [clearError]);

  // Show error toast if there's an error
  useEffect(() => {
    if (apiError?.message) {
      toast.error(apiError.message);
      clearError();
    }
  }, [apiError, clearError]);

  const getUserRole = (email: string): number => {
    const emailToCheck = email.toLowerCase();

    if (
      emailToCheck === "hro@sbckenya.com" ||
      emailToCheck === "cynthia@sbckenya.com"
    ) {
      return 5;
    } else if (emailToCheck === "procurement@sbckenya.com") {
      return 6;
    } else if (emailToCheck === "lewis@sbckenya.com") {
      return 1;
    }
    return 4;
  };

  const onSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true);

      // Determine user role based on email
      const userRole = getUserRole(formData.email);

      // Log the form data being sent
      // console.log("📤 Form data being sent:", {
      //   first_name: formData.firstName,
      //   last_name: formData.lastName,
      //   email: formData.email,
      //   phone_number: formData.phoneNumber,
      //   password: formData.password,
      //   confirm_password: formData.confirmPassword,
      //   user_role: userRole,
      // });

      await authRegister({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone_number: formData.phoneNumber,
        password: formData.password,
        confirm_password: formData.confirmPassword,
        user_role: userRole,
      });

      localStorage.setItem("pendingVerificationEmail", formData.email);
      toast.success(
        "Registration successful! Please check your email for verification."
      );
      router.push("/auth/verify-email");
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle loading state
  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  //     </div>
  //   );
  // }

  // Helper function to get error message for a field
  const getErrorMessage = (field: keyof FormData) => {
    // First check for form validation errors
    if (errors[field]?.message) {
      return String(errors[field]?.message);
    }

    // Then check for API field errors
    if (apiError?.errors?.[field]) {
      const errorValue = apiError.errors[field];
      return Array.isArray(errorValue) ? errorValue[0] : String(errorValue);
    }

    return "";
  };

  // Helper function to check if a field has an error
  const hasError = (field: keyof FormData) => {
    if (errors[field]) return true;

    return Boolean(
      apiError?.errors && field in apiError.errors && apiError.errors[field]
    );
  };

  // Show general error message if exists
  const showGeneralError = Boolean(
    apiError?.message &&
      (!apiError.errors || Object.keys(apiError.errors).length === 0)
  );

  return (
    <div className="min-h-screen">
      <section className="py-10 bg-white">
        <Container className="px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              Create Account
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our community and start your journey with us
            </p>
          </div>
        </Container>
      </section>

      <section className="py-20 bg-gray-50">
        <Container className="px-4">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    icon={IoPersonCircle}
                    {...register("firstName")}
                    error={errors.firstName?.message}
                    required
                  />
                  <Input
                    label="Last Name"
                    icon={CiPhone}
                    {...register("lastName")}
                    error={errors.lastName?.message}
                    required
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Email address"
                    icon={CiMail}
                    type="email"
                    {...register("email")}
                    error={errors.email?.message}
                    required
                  />
                  <Input
                    label="Phone Number"
                    icon={CiPhone}
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    {...register("phoneNumber")}
                    error={errors.phoneNumber?.message}
                    required
                  />
                </div>
              </div>

              {/* Security Information */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Security Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Password"
                    icon={CiLock}
                    type="password"
                    {...register("password")}
                    error={errors.password?.message}
                  />
                  <Input
                    label="Confirm Password"
                    icon={CiLock}
                    type="password"
                    {...register("confirmPassword")}
                    error={errors.confirmPassword?.message}
                  />
                </div>
              </div>

              {/* Show general error message */}
              {/* {showGeneralError && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                  {getApiErrorMessage()}
                </div>
              )} */}
              <div className="text-center">
                <Button
                  disabled={isSubmitting}
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </Container>
      </section>
    </div>
  );
}
