import { atom } from "jotai";
import type {TurbineAlert, TurbineTelemetry} from "../../generated-ts-client.ts";

export const JwtAtom      = atom<string | null>(localStorage.getItem("jwt"));


export const SelectedTurbineAtom = atom<string | null>(null);

export const TurbineIdsAtom = atom<string[]>([]);

export const TurbineMapAtom      = atom<Record<string, TurbineTelemetry>>({});


export const AlertsAtom = atom<TurbineAlert[]>([]);
