import { StateleSSEClient } from "statele-sse";
import { baseUrl } from "./baseUrl.ts";

let sse: StateleSSEClient | null = null;

export function getSse(): StateleSSEClient {
    if (!sse) {
        const token = localStorage.getItem("token");
        sse = new StateleSSEClient(`${baseUrl}/sse?access_token=${token}`);
    }
    return sse;
}