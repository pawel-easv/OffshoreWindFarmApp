import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router";
import { useAtomValue } from "jotai";
import type { TurbineTelemetry } from "../generated-ts-client.ts";
import { baseUrl } from "../core/baseUrl.ts";
import { customFetch } from "../utilities/customFetch.ts";
import { WebClientClient } from "../generated-ts-client.ts";
import { TurbineMapAtom } from "../core/atoms/atoms.ts";

const restClient = new WebClientClient(baseUrl, customFetch);

export type Timeframe = "1m" | "1h" | "1d" | "1w";
export const TIMEFRAMES: Timeframe[] = ["1m", "1h", "1d", "1w"];
const MAX_HISTORY = 500;

export default function useTurbineDetail() {
    const { turbineId } = useParams<{ turbineId: string }>();
    const turbineMap = useAtomValue(TurbineMapAtom);
    const latest = turbineId ? (turbineMap[turbineId] ?? null) : null;

    const [history,   setHistory]   = useState<TurbineTelemetry[]>([]);
    const [timeframe, setTimeframe] = useState<Timeframe>("1h");
    const [loading,   setLoading]   = useState(false);
    const lastTimestampRef = useRef<string | null>(null);

    const loadHistory = useCallback(async () => {
        if (!turbineId) return;
        setLoading(true);
        try {
            const data = await restClient.getTelemetryHistory(turbineId, timeframe);
            setHistory(data ?? []);
            if (data?.length)
                lastTimestampRef.current = data[data.length - 1].timestamp ?? null;
        } catch {}
        finally { setLoading(false); }
    }, [turbineId, timeframe]);

    useEffect(() => { loadHistory(); }, [loadHistory]);

    useEffect(() => {
        if (!latest?.timestamp) return;
        if (latest.timestamp <= (lastTimestampRef.current ?? "")) return;
        lastTimestampRef.current = latest.timestamp;
        setHistory(prev => [...prev.slice(-(MAX_HISTORY - 1)), latest]);
    }, [latest]);

    return {
        turbineId:   turbineId ?? "",
        latest,
        history,
        timeframe,
        setTimeframe,
        loading,
    };
}