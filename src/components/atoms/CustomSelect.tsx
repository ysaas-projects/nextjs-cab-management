interface CustomSelectProps {
    label: string;
    name: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: { id: number | string; name: string }[];
    disabled?: boolean;
    error?: string;
}

export default function CustomSelect({
    label,
    name,
    value,
    onChange,
    options,
    disabled = false,
    error,
}: CustomSelectProps) {
    return (
        <div className="space-y-1">
            <label className="font-medium text-gray-700">{label}</label>

            <select
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`w-full rounded-lg border px-3 py-2
                    ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
                    ${error ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500"}
                `}
            >
                <option value="">Select {label}</option>

                {options.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                        {opt.name}
                    </option>
                ))}
            </select>

            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}
