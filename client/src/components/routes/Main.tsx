import { Outlet } from "react-router-dom";

export default function Main() {
    return (
        <div className="flex flex-col min-h-screen overflow-x-hidden bg-slate-950 text-slate-100 font-mono">
            <Outlet />
        </div>
    );
}