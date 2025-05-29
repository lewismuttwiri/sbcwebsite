import toast from "react-hot-toast";

type ToastType = "success" | "error" | "loading";

interface ToastOptions {
  duration?: number;
  position?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
  icon?: string;
}

const showToast = (
  message: string,
  type: ToastType = "success",
  options: ToastOptions = {}
) => {
  const { duration, position = "top-center", icon } = options;

  const toastOptions = {
    duration: duration || 400,
    position,
    ...(icon && { icon }),
  };

  switch (type) {
    case "success":
      return toast.success(message, toastOptions);
    case "error":
      return toast.error(message, toastOptions);
    case "loading":
      return toast.loading(message, toastOptions);
    default:
      return toast(message, toastOptions);
  }
};

export default showToast;
