import { create } from "zustand"
type GlobalUserState={
    userState:boolean;
    toogleUserState:()=>void;
}
export const UserLoginStates=create<GlobalUserState>((set)=>({
    userState:true,
    toogleUserState:()=>set((s)=>({userState:!s.userState}))
}))