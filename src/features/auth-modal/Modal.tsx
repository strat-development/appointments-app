import { IoMdClose } from "react-icons/io";
import * as Dialog from '@radix-ui/react-dialog';

interface ModalProps {
    isOpen: boolean;
    onChange: (open: boolean) => void;
    title: string;
    description: string;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onChange,
    title,
    description,
    children
}) => {
    return (
        <Dialog.Root
            open={isOpen}
            defaultOpen={isOpen}
            onOpenChange={onChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed z-[9999999999] inset-0 backdrop-blur-sm bg-white/50" />
                <Dialog.Content className='fixed z-[9999999999] drop-shadow-md bg-white border top-[50%] left-[50%] max-h-full h-full w-full translate-x-[-50%] translate-y-[-50%] rounded-lg p-[25px] focus:outline-none md:w-[90vw] md:max-w-[450px] md:h-auto md:max-h-[85vh]'>
                    <Dialog.Title className='text-xl text-violet-600 text-center font-bold mb-4'>
                        {title}
                    </Dialog.Title>
                    <Dialog.Description className='mb-5 text-sm leading-normal text-center'>
                        {description}
                    </Dialog.Description>
                    <div>
                        {children}
                    </div>
                    <Dialog.Close asChild>
                        <button className='text-violet-400 hover:text-violet-300 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:outline-none'>
                            <IoMdClose />
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}