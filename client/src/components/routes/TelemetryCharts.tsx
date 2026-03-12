import {
    ResponsiveContainer, LineChart, Line,
    AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";
import type { TurbineTelemetry } from "../../generated-ts-client.ts";
import { type Timeframe, TIMEFRAMES } from "../../hooks/useTurbineDetail.ts";

interface Props {
    history:     TurbineTelemetry[];
    timeframe:   Timeframe;
    onTimeframe: (t: Timeframe) => void;
    loading:     boolean;
}

const COLORS = {
    power:   "#f59e0b",
    wind:    "#06b6d4",
    rpm:     "#a855f7",
    pitch:   "#6366f1",
    temp:    "#f59e0b",
    tempGen: "#fde68a",
    vibe:    "#22c55e",
};

const tick    = { fill: "#64748b", fontSize: 9, fontFamily: "monospace" };
const grid    = "#1e293b";
const ttStyle = {
    contentStyle: {
        background: "#0f172a", border: "1px solid #1e293b",
        borderRadius: 8, fontSize: 11, fontFamily: "monospace"
    },
    labelStyle: { color: "#94a3b8" },
};

function downsample(data: any[], maxPoints: number) {
    if (data.length <= maxPoints) return data;
    const step = Math.ceil(data.length / maxPoints);
    return data.filter((_, i) => i % step === 0 || i === data.length - 1);
}

function fmtTime(ts: string | undefined, timeframe: Timeframe) {
    try {
        const d = new Date(ts!);
        if (timeframe === "1m") return d.toTimeString().slice(3, 8);
        if (timeframe === "1h") return d.toTimeString().slice(0, 5);
        if (timeframe === "1d") return d.toTimeString().slice(0, 5);
        return `${d.getMonth()+1}/${d.getDate()} ${d.toTimeString().slice(0, 5)}`;
    } catch { return ts ?? ""; }
}

function xAxisProps(dataLength: number) {
    const interval = Math.max(1, Math.floor(dataLength / 6));
    return {
        dataKey:    "t" as const,
        tick,
        interval,
        angle:      -40,
        textAnchor: "end" as const,
        height:     45,
        tickMargin: 4,
    };
}

export default function TelemetryCharts({ history, timeframe, onTimeframe, loading }: Props) {
    const maxPoints = timeframe === "1m" ? 60 : timeframe === "1h" ? 60 : timeframe === "1d" ? 120 : 168;

    const data = downsample(history, maxPoints).map(h => ({
        t:       fmtTime(h.timestamp, timeframe),
        power:   +(h.powerOutput   ?? 0).toFixed(2),
        wind:    +(h.windSpeed     ?? 0).toFixed(2),
        rpm:     +(h.rotorSpeed    ?? 0).toFixed(1),
        pitch:   +(h.bladePitch    ?? 0).toFixed(1),
        gearbox: +(h.gearboxTemp   ?? 0).toFixed(1),
        gen:     +(h.generatorTemp ?? 0).toFixed(1),
        vibe:    +(h.vibration     ?? 0).toFixed(3),
    }));

    const xProps = xAxisProps(data.length);

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600 font-mono uppercase tracking-widest mr-1">Range</span>
                {TIMEFRAMES.map(tf => (
                    <button
                        key={tf}
                        onClick={() => onTimeframe(tf)}
                        className={`px-3 py-1 text-xs font-mono rounded transition-all border ${
                            timeframe === tf
                                ? "bg-slate-700 border-slate-500 text-slate-100"
                                : "bg-transparent border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300"
                        }`}
                    >
                        {tf}
                    </button>
                ))}
                {loading && (
                    <span className="ml-2 text-xs text-slate-600 font-mono animate-pulse">loading…</span>
                )}
                <span className="ml-auto text-xs text-slate-700 font-mono">{data.length} points</span>
            </div>

            {data.length === 0 && !loading ? (
                <div className="flex items-center justify-center h-40 text-slate-600 text-xs font-mono">
                    No data for this timeframe
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

                    <Chart title="Power Output (kW)" color={COLORS.power}>
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="gPower" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%"  stopColor={COLORS.power} stopOpacity={0.25} />
                                    <stop offset="95%" stopColor={COLORS.power} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid stroke={grid} strokeDasharray="3 3" />
                            <XAxis {...xProps} />
                            <YAxis tick={tick} width={46} />
                            <Tooltip {...ttStyle} />
                            <Area dataKey="power" stroke={COLORS.power} fill="url(#gPower)" dot={false} strokeWidth={2} name="kW" />
                        </AreaChart>
                    </Chart>

                    <Chart title="Wind Speed (m/s)" color={COLORS.wind}>
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="gWind" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%"  stopColor={COLORS.wind} stopOpacity={0.25} />
                                    <stop offset="95%" stopColor={COLORS.wind} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid stroke={grid} strokeDasharray="3 3" />
                            <XAxis {...xProps} />
                            <YAxis tick={tick} width={46} />
                            <Tooltip {...ttStyle} />
                            <Area dataKey="wind" stroke={COLORS.wind} fill="url(#gWind)" dot={false} strokeWidth={2} name="m/s" />
                        </AreaChart>
                    </Chart>

                    <Chart title="Temperature (°C)" color={COLORS.temp}>
                        <LineChart data={data}>
                            <CartesianGrid stroke={grid} strokeDasharray="3 3" />
                            <XAxis {...xProps} />
                            <YAxis tick={tick} width={46} />
                            <Tooltip {...ttStyle} />
                            <Line dataKey="gearbox" stroke={COLORS.temp}    dot={false} strokeWidth={1.5} strokeDasharray="4 2" name="Gearbox °C" />
                            <Line dataKey="gen"     stroke={COLORS.tempGen} dot={false} strokeWidth={1.5} strokeDasharray="2 3" name="Generator °C" />
                        </LineChart>
                    </Chart>

                    <Chart title="Rotor RPM" color={COLORS.rpm}>
                        <LineChart data={data}>
                            <CartesianGrid stroke={grid} strokeDasharray="3 3" />
                            <XAxis {...xProps} />
                            <YAxis tick={tick} width={46} />
                            <Tooltip {...ttStyle} />
                            <Line dataKey="rpm" stroke={COLORS.rpm} dot={false} strokeWidth={2} name="RPM" />
                        </LineChart>
                    </Chart>

                    <Chart title="Blade Pitch (°)" color={COLORS.pitch}>
                        <LineChart data={data}>
                            <CartesianGrid stroke={grid} strokeDasharray="3 3" />
                            <XAxis {...xProps} />
                            <YAxis tick={tick} width={36} />
                            <Tooltip {...ttStyle} />
                            <Line dataKey="pitch" stroke={COLORS.pitch} dot={false} strokeWidth={2} name="Pitch°" />
                        </LineChart>
                    </Chart>

                    <Chart title="Vibration (mm/s)" color={COLORS.vibe}>
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="gVibe" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%"  stopColor={COLORS.vibe} stopOpacity={0.2} />
                                    <stop offset="95%" stopColor={COLORS.vibe} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid stroke={grid} strokeDasharray="3 3" />
                            <XAxis {...xProps} />
                            <YAxis tick={tick} width={50} />
                            <Tooltip {...ttStyle} />
                            <Area dataKey="vibe" stroke={COLORS.vibe} fill="url(#gVibe)" dot={false} strokeWidth={2} name="mm/s" />
                        </AreaChart>
                    </Chart>

                </div>
            )}
        </div>
    );
}

function Chart({ title, color, children, className = "" }: {
    title: string; color: string; children: React.ReactNode; className?: string;
}) {
    return (
        <div className={`bg-slate-900 border border-slate-800 rounded-xl p-4 ${className}`}>
            <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                <span className="text-xs font-mono font-semibold text-slate-400"
                      dangerouslySetInnerHTML={{ __html: title }} />
            </div>
            <ResponsiveContainer width="100%" height={160}>
                {children as any}
            </ResponsiveContainer>
        </div>
    );
}