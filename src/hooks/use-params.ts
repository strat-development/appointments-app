import { usePathname, useRouter, useSearchParams } from "next/navigation"

export const useSetSearchParams = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const setSearchParams = (name: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        params.set(name, value);

        router.push(`${pathname}?${params.toString()}`);
    }

    return {
        setSearchParams
    }
}