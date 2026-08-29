"use client";

import MainPage from "../Projects/PageHolder";
import { Box, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Card, Typography, CardContent, CardHeader, IconButton, Menu, MenuItem, Snackbar, Alert } from "@mui/material";
import { PlusIcon, Link2Icon, EllipsisVerticalIcon, PencilIcon, TrashIcon } from "lucide-react";
import { Slide } from "react-awesome-reveal";
import PasswordField from "@/app/components/ui/password";
import React, { useEffect, useState, useReducer, useContext, createContext } from "react";
import { api, useApiResource, visit } from "@/app/lib/api";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";

type Workspace = {
    id: number;
    name: string;
    owner_id: number;
    project_count: number;
    user_count: number;
    owner: { id: number; name: string };
};

interface PageProps {
    workspaces: Workspace[];
}

type Mode = "JOIN" | "UPDATE" | "NEW" | "None";

type State = {
    mode: Mode;
    isOpen: boolean;
    id: number | undefined;
    form: {
        name: string;
    };
};

type Action =
    | { type: "SET_MODE"; payload: Mode }
    | { type: "UPDATE_FIELD"; payload: { field: string; value: string } }
    | { type: "CLOSE" }
    | { type: "SETID"; payload: { id: number } };

type ContextType = {
    state: State;
    dispatch: React.Dispatch<Action>;
    reload: () => Promise<void>;
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "SET_MODE":
            return { ...state, isOpen: true, mode: action.payload };
        case "UPDATE_FIELD":
            return {
                ...state,
                isOpen: true,
                mode: "UPDATE",
                form: { ...state.form, [action.payload.field]: action.payload.value },
            };
        case "CLOSE":
            return { id: undefined, mode: "None", isOpen: false, form: { name: "" } };
        case "SETID":
            return { ...state, id: action.payload.id };
        default:
            return state;
    }
}

const StateProvider = createContext<ContextType | undefined>(undefined);
const WorkspaceDataProvider = createContext<PageProps | undefined>(undefined);

export function WorkspaceMenu({ id, name }: { id: number; name: string }) {
    const context = useContext(StateProvider);
    if (!context) throw new Error("State Provider Not Found");
    const { dispatch, reload } = context;
    const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);

    const deleteIt = () => {
        if (confirm("Do you really wanna proceed")) {
            void api.delete(`/workspace/${id}`).then(reload);
        }
    };

    return (
        <Box>
            <IconButton onClick={(e: React.MouseEvent<HTMLElement>) => setAnchorElement(e.currentTarget)} onPointerDown={(e) => e.stopPropagation()}>
                <EllipsisVerticalIcon className="w-5 h-5" aria-label="settings" />
            </IconButton>
            <Menu anchorEl={anchorElement} open={Boolean(anchorElement)} onClose={() => setAnchorElement(null)}>
                <MenuItem className="flex gap-2" onClick={() => {
                    dispatch({ type: "UPDATE_FIELD", payload: { field: "name", value: name } });
                    dispatch({ type: "SETID", payload: { id } });
                }}>
                    <PencilIcon className="w-5 h-5" />
                    <Typography>Edit</Typography>
                </MenuItem>
                <MenuItem className="flex gap-2" onClick={deleteIt}>
                    <TrashIcon className="w-5 h5" />
                    <div>Delete</div>
                </MenuItem>
            </Menu>
        </Box>
    );
}

function checkState({ state }: { state: Mode }) {
    switch (state) {
        case "NEW":
            return "Create";
        case "UPDATE":
            return "Update";
        case "JOIN":
            return "Join";
        default:
            return "";
    }
}

function Form() {
    const context = useContext(StateProvider);
    if (!context) throw new Error("State Provider Not Found");
    const { state, dispatch, reload } = context;
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [data, setDataState] = useState({ name: "", code: "" });
    const setData = (field: string, value: string) => setDataState((prev) => ({ ...prev, [field]: value }));
    const reset = () => setDataState({ name: "", code: "" });

    useEffect(() => {
        setData("name", state.form.name);
    }, [state.form.name]);

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        const request =
            state.mode === "NEW"
                ? api.post("/workspace", data)
                : state.mode === "JOIN"
                    ? api.post("/workspace/join", { code: data.code })
                    : api.put(`/workspace/${state.id}`, data);

        request
            .then(async () => {
                dispatch({ type: "CLOSE" });
                reset();
                await reload();
            })
            .catch((error) => setErrors({ code: error.response?.data?.error || "Workspace request failed" }))
            .finally(() => setProcessing(false));
    };

    return (
        <Dialog open={state.isOpen}>
            <DialogTitle>{checkState({ state: state.mode }) + " Workspace"}</DialogTitle>
            <form onSubmit={submit}>
                <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
                    {Object.keys(errors).length > 0 && <Snackbar open={true} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
                        <Alert severity="error">{errors.name || errors.code}</Alert>
                    </Snackbar>}
                    {["NEW", "UPDATE"].includes(state.mode) && <TextField margin="dense" autoFocus label="Name" autoComplete="off" value={data.name} onChange={(e) => setData("name", e.target.value)} />}
                    <PasswordField text="Code" margin="dense" value={data.code} onChange={(e) => setData("code", e.target.value)} autoComplete="off" />
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={() => dispatch({ type: "CLOSE" })}>Cancel</Button>
                    <Button variant="contained" type="submit" disabled={processing}>{checkState({ state: state.mode })}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

function Cards() {
    const pageData = useContext(WorkspaceDataProvider);
    const workspaces = pageData?.workspaces || [];
    const searchTerm = useSelector((state: RootState) => state.search.term);
    const data = workspaces.filter((ws) => ws.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()));

    return (
        <Box display="flex" gap={5} flexDirection="row" flexWrap="wrap" justifyContent="space-around">
            {data.map((value, index) => (
                <Slide key={index} direction="up" triggerOnce cascade damping={0.2}>
                    <Card sx={{ borderRadius: 5, background: "linear-gradient(135deg, #1a1a2e, #2c2c54, #6a0dad)", padding: 5, minWidth: 500, maxWidth: 500 }}>
                        <CardHeader
                            title={<Typography fontWeight="bold" variant="h5" onClick={() => visit(`/workspace/${value.id}`)}>{value.name}</Typography>}
                            sx={{ color: "#cba6f7" }}
                            action={value.owner.name === "You" && <WorkspaceMenu name={value.name} id={value.id} />}
                        />
                        <CardContent>
                            <Typography sx={{ color: "#d0d0d0" }}>Owner: {value.owner.name}</Typography>
                            <Typography sx={{ color: "#bfa5ff" }}>Workers: {value.user_count}</Typography>
                            <Typography sx={{ color: "#d0d0d0" }}>Projects: {value.project_count}</Typography>
                            <Typography sx={{ color: "#bfa5ff" }}>CompletedProjects: {value.project_count}</Typography>
                        </CardContent>
                    </Card>
                </Slide>
            ))}
        </Box>
    );
}

export default function Page() {
    const initialState = { mode: "None" as Mode, isOpen: false, id: undefined, form: { name: "" } };
    const [state, dispatch] = useReducer(reducer, initialState);
    const { data, loading, reload } = useApiResource<PageProps>("/workspace", { workspaces: [] });
    const show = data.workspaces.length === 0;

    if (loading) return <MainPage><Box padding={4}>Loading workspaces...</Box></MainPage>;

    return (
        <MainPage>
            <Box display="flex" sx={{ height: show ? "calc(100vh - 17vh)" : "", justifyContent: show ? "center" : "flex-end", alignItems: "center" }} padding={2} gap={2}>
                <Button variant="outlined" onClick={() => dispatch({ type: "SET_MODE", payload: "JOIN" })}>
                    <Link2Icon className="w-5 h-5" />
                    <Box>Join WorkSpace</Box>
                </Button>
                <Button variant="contained" onClick={() => dispatch({ type: "SET_MODE", payload: "NEW" })}>
                    <PlusIcon className="w-5 h-5" />
                    <Box>New WorkSpace</Box>
                </Button>
            </Box>
            <WorkspaceDataProvider.Provider value={data}>
                <StateProvider.Provider value={{ state, dispatch, reload }}>
                    <Form />
                    <Cards />
                </StateProvider.Provider>
            </WorkspaceDataProvider.Provider>
        </MainPage>
    );
}
