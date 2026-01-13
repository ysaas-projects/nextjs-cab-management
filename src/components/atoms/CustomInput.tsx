import React from "react";

interface CustomInputProps {
    label: string;
    name: string;
    value: string;
    className?: string;
    type?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // ✅ optional
    placeholder?: string;
    error?: string;
    readOnly?: boolean;
    disabled?: boolean;

}

export default function CustomInput({
    label,
    name,
    value,
    className,
    onChange,
    type = "text",
    placeholder,
    error,
    readOnly,
    disabled,
}: CustomInputProps) {
    return (
        <div className="space-y-1">
            <label className="font-medium text-gray-700">
                {label}
            </label>

            <input
                type={type}
                name={name}
                value={value}
                placeholder={placeholder}
                onChange={onChange}  
                readOnly={readOnly}
                disabled={disabled}
                className={`w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 ${className ? className : ""}
                    ${error
                        ? "border-red-500 focus:ring-red-400"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
            />

            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}
