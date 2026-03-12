import { AuthClient } from "../generated-ts-client.ts";
import { baseUrl } from "../core/baseUrl.ts";
import { customFetch } from "../utilities/customFetch.ts";
import { useAtom } from "jotai";
import { JwtAtom } from "../core/atoms/atoms.ts";

const client = new AuthClient(baseUrl, customFetch);

export default function useAuthApi() {
    const [, setJwt] = useAtom(JwtAtom);

    async function login(email: string, password: string): Promise<void> {
        const result = await client.login({ email, password });
        if (result?.token) {
            localStorage.setItem("token", result.token);
            setJwt(result.token);
        }
    }

    async function logout(): Promise<void> {
        localStorage.removeItem("token");
        setJwt(null);
    }

    async function register(username: string, email: string, password: string): Promise<void> {
        const result = await client.register({ username, email, password });
        if (result?.token) {
            localStorage.setItem("token", result.token);
            setJwt(result.token);
        }
    }

    async function whoAmI() {
        return await client.whoAmI();
    }


    return { login, register, whoAmI, logout };
}