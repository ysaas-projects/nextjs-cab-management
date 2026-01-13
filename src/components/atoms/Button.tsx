import React, {
  forwardRef,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type ButtonSize = "xs" | "sm" | "md";
type ButtonVariant =
  | "primary"
  | "secondary"
  | "warning"
  | "danger"
  | "dark"
  | "default";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
  outline?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      size = "md",
      variant = "primary",
      outline = false,
      startIcon,
      endIcon,
      isLoading = false,
      disabled,
      type = "button",
      className = "",
      ...rest
    },
    ref
  ) => {
    const sizeClasses: Record<ButtonSize, string> = {
      xs: "px-2 py-1 text-xs",
      sm: "px-4 py-2 text-sm",
      md: "px-5 py-3 text-sm",
    };

    const variants: Record<ButtonVariant, { solid: string; outline: string }> =
    {
      primary: {
        solid: "bg-brand-500 text-white hover:bg-brand-600",
        outline: "border border-brand-500 text-brand-500 hover:bg-brand-50",
      },
      secondary: {
        solid: "bg-gray-600 text-white hover:bg-gray-700",
        outline: "border border-gray-500 text-gray-700 hover:bg-gray-100",
      },
      warning: {
        solid: "bg-yellow-500 text-white hover:bg-yellow-600",
        outline: "border border-yellow-500 text-yellow-600 hover:bg-yellow-50",
      },
      danger: {
        solid: "bg-red-500 text-white hover:bg-red-600",
        outline: "border border-red-500 text-red-500 hover:bg-red-50",
      },
      dark: {
        solid: "bg-gray-900 text-white hover:bg-black",
        outline: "border border-gray-800 text-gray-800 hover:bg-gray-100",
      },
      default: {
        solid: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
        outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
      },
    };

    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={isLoading}
        className={`
          inline-flex items-center justify-center gap-2 rounded-lg font-medium
          transition-all duration-150 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500
          ${sizeClasses[size]}
          ${outline ? variants[variant].outline : variants[variant].solid}
          ${isDisabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
          ${className}
        `}
        {...rest}
      >
        {isLoading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        )}

        {!isLoading && startIcon && (
          <span className="flex items-center">{startIcon}</span>
        )}

        <span>{children}</span>

        {!isLoading && endIcon && (
          <span className="flex items-center">{endIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
