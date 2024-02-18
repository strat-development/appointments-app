"use client"

interface InputProps {
    id: string;
    label: string;
    type?: string;
    disabled?: boolean;
    formatPrice?: boolean;
    required?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
    placeholder?: string;
}

export const Input = ({
    placeholder,
    type = "text",
    disabled,
    onChange,
    value,
}: InputProps) => {


    return (
        <div className="w-full relative">
            <input
                disabled={disabled}
                placeholder={placeholder}
                type={type}
                onChange={onChange}
                value={value}
                className={`peer w-full py-2 pl-4 font-light bg-white border-[.5px] rounded-2xl outline-none transition disabled:opacity-70 disabled:cursor-not-allowed`}>
            </input>
        </div>
    )
}