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
            {/* <label className={`absolute text-md duration-150 transform -translate-y-2 top-4 left-4 z-10 origin-[0]
                peer-placeholder-shown:scale-100 
                peer-placeholder-shown:translate-y-0 
                peer-focus:scale-75
                peer-focus:-translate-y-4`}>
                {label}
            </label> */}
        </div>
    )
}