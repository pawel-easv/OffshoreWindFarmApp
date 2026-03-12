// TurbineCard.tsx
import type { TurbineTelemetry } from "../../generated-ts-client.ts";
import { Wind, Zap, Thermometer, Activity, AlertTriangle } from "lucide-react";

interface Props {
    turbineId: string;
    metrics?:  TurbineTelemetry;
    selected:  boolean;
    onClick:   () => void;
}

export default function TurbineCard({ turbineId, metrics, selected, onClick }: Props) {
    const status = metrics?.status ?? "stopped";

    return (
        <button onClick={onClick}
                className={`turbine-card ${selected ? "turbine-card-selected" : ""}`}
        >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Wind size={14} className={selected ? "text-primary" : "text-base-content/40"} />
                    <span className="text-xs font-bold text-base-content">{turbineId}</span>
                </div>
                <div className={`flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full status-${status}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                        status === "running"     ? "bg-success animate-pulse" :
                            status === "fault"       ? "bg-error animate-pulse" :
                                status === "maintenance" ? "bg-warning" :
                                    "bg-base-content/30"
                    }`} />
                    {status}
                </div>
            </div>

            {metrics ? (
                <div className="space-y-2">
                    <Row icon={<Zap size={11} />}        label="Power"  value={`${(metrics.powerOutput   ?? 0).toFixed(1)} kW`}  color="text-warning" />
                    <Row icon={<Wind size={11} />}        label="Wind"   value={`${(metrics.windSpeed     ?? 0).toFixed(1)} m/s`}  color="text-info" />
                    <Row icon={<Thermometer size={11} />} label="Gen °C" value={`${(metrics.generatorTemp ?? 0).toFixed(0)}°C`}
                         color={(metrics.generatorTemp ?? 0) > 70 ? "text-error" : "text-base-content/70"} />
                    <Row icon={<Activity size={11} />}    label="RPM"    value={(metrics.rotorSpeed ?? 0).toFixed(1)} color="text-secondary" />
                </div>
            ) : (
                <div className="h-16 flex items-center justify-center text-base-content/30 text-xs">
                    No data yet
                </div>
            )}

            {(metrics?.vibration ?? 0) > 5 && (
                <div className="absolute top-2 right-2">
                    <AlertTriangle size={13} className="text-error" />
                </div>
            )}
        </button>
    );
}

function Row({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
    return (
        <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-base-content/40">{icon} {label}</span>
            <span className={`font-semibold ${color}`}>{value}</span>
        </div>
    );
}