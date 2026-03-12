import { useState } from "react";
import { Play, Square, Sliders, Clock } from "lucide-react";
import useWindmillApi from "../../hooks/useWindmillApi.ts";
export const MAX_BLADE_PITCH = 30;
interface Props { detail: { turbineId: string } }

export default function ControlPanel({ detail }: Props) {
    const { startTurbine, stopTurbine, setBladePitch, setReportingInterval } = useWindmillApi();

    const [stopReason,     setStopReason]     = useState("");
    const [pitchAngle,     setPitchAngle]     = useState(0);
    const [reportInterval, setReportInterval] = useState(5);

    const handleStart       = () => startTurbine(detail.turbineId);
    const handleStop        = () => stopTurbine(detail.turbineId, stopReason || undefined);
    const handleSetPitch    = () => setBladePitch(detail.turbineId, pitchAngle);
    const handleSetInterval = () => setReportingInterval(detail.turbineId, reportInterval);

    return (
        <div className="control-panel">
            <div className="flex items-center gap-2 pb-2 border-b border-base-300">
                <Sliders size={14} className="text-primary" />
                <span className="text-xs font-bold text-base-content uppercase tracking-widest">Controls</span>
            </div>

            <Section label="Power">
                <div className="flex gap-2">
                    <button onClick={handleStart} className="btn btn-success btn-sm gap-1">
                        <Play size={12} /> Start
                    </button>
                    <button onClick={handleStop} className="btn btn-error btn-sm gap-1">
                        <Square size={12} /> Stop
                    </button>
                </div>
                <input
                    type="text" placeholder="Stop reason (optional)"
                    value={stopReason} onChange={e => setStopReason(e.target.value)}
                    className="input input-bordered input-sm w-full mt-2 font-mono text-xs"
                />
            </Section>

            <Section label="Blade Pitch">
                <div className="flex items-center gap-3">
                    <input type="range" min={0} max={MAX_BLADE_PITCH} step={0.5}
                           value={pitchAngle} onChange={e => setPitchAngle(+e.target.value)}
                           className="range range-primary range-xs flex-1"
                    />
                    <span className="w-14 text-center text-xs font-bold text-primary bg-base-200 rounded px-2 py-1">
                        {pitchAngle.toFixed(1)}°
                    </span>
                </div>
                <button onClick={handleSetPitch} className="btn btn-primary btn-sm w-full mt-2 gap-1">
                    <Sliders size={12} /> Apply Pitch
                </button>
            </Section>

            <Section label="Reporting Interval">
                <div className="flex items-center gap-2">
                    <Clock size={12} className="text-base-content/40 shrink-0" />
                    <input type="number" min={1} max={3600}
                           value={reportInterval} onChange={e => setReportInterval(+e.target.value)}
                           className="input input-bordered input-sm flex-1 font-mono text-xs"
                    />
                    <span className="text-xs text-base-content/40">sec</span>
                    <button onClick={handleSetInterval} className="btn btn-secondary btn-sm gap-1">
                        <Clock size={12} /> Set
                    </button>
                </div>
            </Section>
        </div>
    );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-2">
            <p className="text-xs text-base-content/40 uppercase tracking-wider">{label}</p>
            {children}
        </div>
    );
}