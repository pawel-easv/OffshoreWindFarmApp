import { useState, useEffect } from "react";
import { AlertTriangle, Info, Zap, Siren } from "lucide-react";
import type { JSX } from "react";
import type { TurbineAlert } from "../../generated-ts-client.ts";
import { WebClientClient } from "../../generated-ts-client.ts";
import { baseUrl } from "../../core/baseUrl.ts";
import { customFetch } from "../../utilities/customFetch.ts";
import toast from "react-hot-toast";

const restClient = new WebClientClient(baseUrl, customFetch);

const SEV_STYLES: Record<string, string> = {
    critical: "border-l-red-500 bg-red-500/5 text-red-400",
    warning:  "border-l-amber-500 bg-amber-500/5 text-amber-400",
    info:     "border-l-cyan-500 bg-cyan-500/5 text-cyan-400",
};

const SEV_ICON: Record<string, JSX.Element> = {
    critical: <Zap size={13} />,
    warning:  <AlertTriangle size={13} />,
    info:     <Info size={13} />,
};

interface Props { turbineId: string; }

export default function TurbineAlerts({ turbineId }: Props) {
    const [alerts, setAlerts] = useState<TurbineAlert[]>([]);

    async function loadAlerts() {
        try {
            const data = await restClient.getAlerts(turbineId);
            setAlerts(data ?? []);
        } catch {}
    }

    useEffect(() => { loadAlerts(); }, [turbineId]);

    async function simulateAlert() {
        try {
            await restClient.simulateAlert(turbineId);
            toast.success("Alert simulated");
            await loadAlerts();
        } catch {
            toast.error("Failed to simulate alert");
        }
    }

    return (
        <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden font-mono">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800 shrink-0">
                <AlertTriangle size={14} className="text-amber-400" />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-widest">Alerts</span>
                <span className="ml-auto text-xs text-slate-600">{alerts.length} total</span>
            </div>

            <div className="flex-1 overflow-y-auto">
                {alerts.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-slate-600 text-xs">
                        No alerts for this turbine
                    </div>
                ) : (
                    alerts.map((a: TurbineAlert) => {
                        const sev = a.severity ?? "info";
                        return (
                            <div key={a.id}
                                 className={`flex items-start gap-3 px-4 py-3 border-b border-slate-800/50 border-l-2 ${SEV_STYLES[sev] ?? SEV_STYLES.info}`}
                            >
                                <span className="mt-0.5 shrink-0">{SEV_ICON[sev] ?? SEV_ICON.info}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-slate-300">{a.message}</p>
                                    <span className="text-xs text-slate-600 mt-1 block">
                                        {a.timestamp ? new Date(a.timestamp).toLocaleTimeString() : ""}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="shrink-0 p-3 border-t border-slate-800">
                <button
                    onClick={simulateAlert}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-mono
                               bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500
                               text-slate-400 hover:text-slate-200 rounded-lg transition-all"
                >
                    <Siren size={12} />
                    Simulate Alert
                </button>
            </div>
        </div>
    );
}