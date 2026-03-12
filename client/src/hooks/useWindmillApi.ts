import { baseUrl } from "../core/baseUrl.ts";
import { WebClientClient } from "../generated-ts-client.ts";
import {customFetch} from "../utilities/customFetch.ts";

const client = new WebClientClient(baseUrl, customFetch);

export default function useWindmillApi() {
    async function setReportingInterval(turbineId: string, interval: number): Promise<void> {
        try {
            await client.setReportingInterval(turbineId, interval);
        } catch (e: any) {
            console.error("Error setting reporting interval:", e);
        }
    }

    async function stopTurbine(turbineId: string, reason?: string): Promise<void> {
        try {
            await client.stopTurbine(turbineId, reason);
        } catch (e: any) {
            console.error("Error stopping turbine:", e);
        }
    }

    async function startTurbine(turbineId: string): Promise<void> {
        try {
            await client.startTurbine(turbineId);
        } catch (e: any) {
            console.error("Error starting turbine:", e);
        }
    }

    async function setBladePitch(turbineId: string, angle: number): Promise<void> {
        try {
            await client.setBladePitch(turbineId, angle);
        } catch (e: any) {
            console.error("Error setting blade pitch:", e);
        }
    }

    async function connect(): Promise<void> {
        try {
            await client.connect();
        } catch (e: any) {
            console.error("Error connecting:", e);
        }
    }

    return {
        setReportingInterval,
        stopTurbine,
        startTurbine,
        setBladePitch,
        connect,
    };
}