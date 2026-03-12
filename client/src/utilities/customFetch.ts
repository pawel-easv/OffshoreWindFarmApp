import toast from "react-hot-toast";
import type {ProblemDetails} from "../core/ProblemDetails.ts";

export const customFetch = {
    fetch(url: RequestInfo, init?: RequestInit): Promise<Response> {
        const token = localStorage.getItem("token");
        const headers = new Headers(init?.headers);

        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }

        return fetch(url, {
            ...init,
            headers
        }).then(async (response) => {
            if (!response.ok) {
                const errorClone = response.clone();
                try {
                    const problemDetails = (await errorClone.json()) as ProblemDetails;
                    console.log(problemDetails);
                    toast.error(problemDetails.title || 'An error occurred');
                } catch (e) {
                    // If response is not JSON, show generic error
                    toast.error(`Error: ${response.status} ${response.statusText}`);
                }
            }

            return response;
        });
    }
};