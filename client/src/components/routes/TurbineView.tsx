// TurbineView.tsx
import { useNavigate } from "react-router";
import { ChevronLeft } from "lucide-react";
import { FleetPath } from "../App.tsx";
import useTurbineDetail from "../../hooks/useTurbineDetail.ts";
import MetricsCards from "./MetricsCards.tsx";
import TelemetryCharts from "./TelemetryCharts.tsx";
import TurbineAlerts from "./TurbineAlerts.tsx";
import ControlPanel from "./ControlPanel.tsx";

export default function TurbineView() {
    const navigate = useNavigate();
    const detail   = useTurbineDetail();

    return (
        <div className="flex flex-col h-full overflow-hidden bg-base-200">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-base-300 bg-base-100 shrink-0">
                <button onClick={() => navigate(FleetPath)}
                        className="flex items-center gap-1 text-xs text-base-content/40 hover:text-base-content transition-colors font-mono"
                >
                    <ChevronLeft size={14} /> Fleet
                </button>
                <span className="text-base-content/20">/</span>
                <span className="text-xs font-bold text-primary font-mono">{detail.turbineId}</span>
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-4 p-4">
                    <div className="space-y-4 min-w-0">
                        <MetricsCards metrics={detail.latest} />
                        <TelemetryCharts
                            history={detail.history}
                            timeframe={detail.timeframe}
                            onTimeframe={detail.setTimeframe}
                            loading={detail.loading}
                        />
                    </div>
                    <div className="space-y-4">
                        <ControlPanel detail={detail} />
                        <div className="h-[400px]">
                            <TurbineAlerts turbineId={detail.turbineId} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}