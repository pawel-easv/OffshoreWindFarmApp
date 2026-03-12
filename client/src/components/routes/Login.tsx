import { useState } from "react";
import { useNavigate } from "react-router";
import { useAtom } from "jotai";
import toast from "react-hot-toast";
import { Wind, Mail, Lock, User } from "lucide-react";
import {JwtAtom} from "../../core/atoms/atoms.ts";
import {FleetPath} from "../App.tsx";
import useAuthApi from "../../hooks/useAuth.ts";
import * as React from "react";

export default function Login() {
    const navigate  = useNavigate();
    const auth      = useAuthApi();
    const [jwt]     = useAtom(JwtAtom);

    const [mode,     setMode]     = useState<"login" | "register">("login");
    const [email,    setEmail]    = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [loading,  setLoading]  = useState(false);

    if (jwt) { navigate(FleetPath); return null; }

    const handleSubmit = async () => {
        if (!email || !password) { toast.error("Please enter email and password"); return; }
        if (mode === "register" && !username) { toast.error("Please enter a username"); return; }
        setLoading(true);
        try {
            if (mode === "login") await auth.login(email, password);
            else                  await auth.register(username, email, password);
            navigate(FleetPath);
        } catch (err: any) {
            toast.error(err?.message ?? "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !loading) handleSubmit();
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 border border-primary/30 mb-4">
                        <Wind className="text-primary" size={28} />
                    </div>
                    <h1 className="text-xl font-bold tracking-widest text-base-content uppercase font-mono">
                        WindFarm
                    </h1>
                    <p className="text-base-content/40 text-xs mt-1 font-mono">Operation Center</p>
                </div>

                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body gap-4">
                        <div className="tabs tabs-boxed bg-base-200">
                            {(["login", "register"] as const).map(m => (
                                <button key={m} onClick={() => setMode(m)}
                                        className={`tab flex-1 capitalize font-mono text-xs font-semibold ${mode === m ? "tab-active" : ""}`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>

                        {mode === "register" && (
                            <InputField icon={<User size={14} />} placeholder="Username"
                                        value={username} onChange={setUsername} onKeyDown={handleKeyDown} />
                        )}
                        <InputField icon={<Mail size={14} />} placeholder="Email" type="email"
                                    value={email} onChange={setEmail} onKeyDown={handleKeyDown} autoComplete="email" />
                        <InputField icon={<Lock size={14} />} placeholder="Password" type="password"
                                    value={password} onChange={setPassword} onKeyDown={handleKeyDown}
                                    autoComplete={mode === "login" ? "current-password" : "new-password"} />

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="btn btn-primary w-full font-mono"
                        >
                            {loading && <span className="loading loading-spinner loading-xs" />}
                            {mode === "login" ? "Sign In" : "Create Account"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InputField({ icon, placeholder, type = "text", value, onChange, onKeyDown, autoComplete }: {
    icon: React.ReactNode; placeholder: string; type?: string;
    value: string; onChange: (v: string) => void;
    onKeyDown: (e: React.KeyboardEvent) => void; autoComplete?: string;
}) {
    return (
        <label className="input input-bordered flex items-center gap-2 font-mono text-sm">
            <span className="text-base-content/40">{icon}</span>
            <input type={type} placeholder={placeholder} value={value} autoComplete={autoComplete}
                   onChange={e => onChange(e.target.value)} onKeyDown={onKeyDown}
                   className="grow" required />
        </label>
    );
}