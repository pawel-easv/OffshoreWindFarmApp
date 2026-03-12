import { Wind, Zap, Thermometer, Activity, Compass, RotateCcw } from "lucide-react";
import type { TurbineTelemetry } from "../../generated-ts-client.ts";

interface Props { metrics: TurbineTelemetry | null; }

export default function MetricsCards({ metrics: m }: Props) {
    if (!m) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-20 bg-base-200 border border-base-300 rounded-xl animate-pulse" />
                ))}
            </div>
        );
    }

    const status = m.status ?? "stopped";

    return (
        <div className="space-y-3">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-widest status-${status}`}>
                <span className={`w-2 h-2 rounded-full ${
                    status === "running" ? "bg-success animate-pulse" :
                        status === "fault"   ? "bg-error animate-pulse" :
                            "bg-base-content/30"
                }`} />
                {status}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard icon={<Zap size={16} />}        label="Power Output" value={(m.powerOutput   ?? 0).toFixed(1)} unit="kW"   color="text-warning"   bg="bg-warning/5   border-warning/20" />
                <StatCard icon={<Wind size={16} />}        label="Wind Speed"   value={(m.windSpeed     ?? 0).toFixed(1)} unit="m/s"  color="text-info"      bg="bg-info/5      border-info/20" />
                <StatCard icon={<Activity size={16} />}    label="Rotor RPM"    value={(m.rotorSpeed    ?? 0).toFixed(1)} unit="RPM"  color="text-secondary" bg="bg-secondary/5 border-secondary/20" />
                <StatCard icon={<RotateCcw size={16} />}   label="Blade Pitch"  value={(m.bladePitch    ?? 0).toFixed(1)} unit="°"    color="text-primary"   bg="bg-primary/5   border-primary/20" />
                <StatCard icon={<Thermometer size={16} />} label="Generator °C" value={(m.generatorTemp ?? 0).toFixed(0)} unit="°C"
                          color={(m.generatorTemp ?? 0) > 70 ? "text-error" : "text-warning"}
                          bg="bg-warning/5 border-warning/20" />
                <StatCard icon={<Thermometer size={16} />} label="Gearbox °C"   value={(m.gearboxTemp   ?? 0).toFixed(0)} unit="°C"
                          color={(m.gearboxTemp ?? 0) > 80 ? "text-error" : "text-warning"}
                          bg="bg-warning/5 border-warning/20" />
                <StatCard icon={<Activity size={16} />}    label="Vibration"    value={(m.vibration     ?? 0).toFixed(2)} unit="mm/s"
                          color={(m.vibration ?? 0) > 5 ? "text-error" : "text-success"}
                          bg="bg-success/5 border-success/20" />
                <StatCard icon={<Compass size={16} />}     label="Nacelle Dir"  value={(m.nacelleDirection ?? 0).toFixed(0)} unit="°" color="text-accent" bg="bg-accent/5 border-accent/20" />
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, unit, color, bg }: {
    icon: React.ReactNode; label: string; value: string; unit: string; color: string; bg: string;
}) {
    return (
        <div className={`stat-card ${bg}`}>
            <div className={`mb-2 ${color}`}>{icon}</div>
            <div className="flex items-end gap-1">
                <span className={`text-xl font-bold leading-none ${color}`}>{value}</span>
                <span className="text-xs text-base-content/40 mb-0.5">{unit}</span>
            </div>
            <p className="text-xs text-base-content/40 mt-1 truncate">{label}</p>
        </div>
    );
}