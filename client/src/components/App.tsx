import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { useSetAtom} from "jotai";
import Login from "./routes/Login.tsx";
import FleetView from "./routes/FleetView.tsx";
import TurbineView from "./routes/TurbineView.tsx";
import Main from "./routes/Main.tsx";
import { Toaster } from "react-hot-toast";
import { type TurbineTelemetry, WebClientClient } from "../generated-ts-client.ts";
import { baseUrl } from "../core/baseUrl.ts";
import { customFetch } from "../utilities/customFetch.ts";
import { TurbineMapAtom, TurbineIdsAtom} from "../core/atoms/atoms.ts";
import { getSse } from "../core/sseClient.ts";

export const LoginPath         = "/";
export const FleetPath         = "/fleet";
export const AlertsPath        = "/alerts";
export const turbineDetailPath = (id: string) => `/turbine/${id}`;

const TURBINE_IDS = ["turbine-alpha", "turbine-beta", "turbine-gamma", "turbine-delta"];

const restClient = new WebClientClient(baseUrl, customFetch);

const router = createBrowserRouter([
    {
        path: "/",
        element: <Main />,
        children: [
            { index: true, element: <Login /> },
            { path: "fleet", element: <FleetView /> },
            { path: "turbine/:turbineId", element: <TurbineView /> },
        ]
    }
]);

function SseProvider() {
    const setTurbineMap = useSetAtom(TurbineMapAtom);
    const setTurbineIds = useSetAtom(TurbineIdsAtom);

    useEffect(() => {
        setTurbineIds(TURBINE_IDS);

        const cleanup = getSse().listen<TurbineTelemetry[]>(
            async (connectionId) => restClient.getTelemetry(connectionId),
            (data) => {
                const map: Record<string, TurbineTelemetry> = {};
                for (const t of data) {
                    if (t.turbineId) map[t.turbineId] = t;
                }
                setTurbineMap(map);
            }
        );
        return () => cleanup();
    }, []);

    return null;
}

function App() {
    return (
        <div className="App">
            <SseProvider />
            <RouterProvider router={router} />
            <Toaster position="top-center" reverseOrder={false} />
        </div>
    );
}

export default App;