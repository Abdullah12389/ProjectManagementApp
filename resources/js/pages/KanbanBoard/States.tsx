import { create } from "zustand";
type forms="None" | "NewTask" | "NewProject";
type OpenFormState={
    Form:forms;
    toggleForm:(name:forms)=>void;
}
export const FormStates=create<OpenFormState>((set)=>({
    Form:"None",
    toggleForm:(name:forms)=>set({Form:name})
}))
