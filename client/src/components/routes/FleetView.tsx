import { useNavigate } from "react-router-dom";
import { useAtom, useAtomValue } from "jotai";
import { turbineDetailPath } from "../App.tsx";
import { TurbineIdsAtom, TurbineMapAtom, SelectedTurbineAtom } from "../../core/atoms/atoms.ts";
import TurbineCard from "./TurbineCard.tsx";

export default function FleetView() {
    const navigate       = useNavigate();
    const turbineIds     = useAtomValue(TurbineIdsAtom);
    const turbineMap     = useAtomValue(TurbineMapAtom);
    const [selectedTurbine, setSelectedTurbine] = useAtom(SelectedTurbineAtom);

    return (
        <div className="h-full w-full overflow-y-auto">
            <div className="px-4 pt-4 pb-1">
                <p className="text-xs font-bold uppercase tracking-widest text-base-content/40 font-mono">
                    Fleet Overview — {turbineIds.length} turbines
                </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 p-4">
                {turbineIds.map(id => (
                    <TurbineCard
                        key={id}
                        turbineId={id}
                        metrics={turbineMap[id]}
                        selected={selectedTurbine === id}
                        onClick={() => {
                            setSelectedTurbine(id);
                            navigate(turbineDetailPath(id));
                        }}
                    />
                ))}
            </div>
        </div>
    );
}