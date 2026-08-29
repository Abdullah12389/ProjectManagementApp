"use client"

import { api } from "@/app/lib/api";
import { UserLoginStates } from "./States";
import { Box, Stack, TextField, Typography, Button, Alert } from "@mui/material";
import PasswordField from "../../components/ui/password";
import { useShallow } from "zustand/react/shallow";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Login = () => {
    const router = useRouter();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");
    const [data, setData] = useState({ name: "", password: "" });
    const update = (field: string, value: string) => setData((prev) => ({ ...prev, [field]: value }));

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setProcessing(true);
        setError("");
        api.post("/auth/login", data)
            .then(() => router.push("/workspace"))
            .catch((err) => setError(err.response?.data?.error || "Login failed"))
            .finally(() => setProcessing(false));
    };

    return (
        <form onSubmit={submit}>
            <Stack spacing={2}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "transparent", backgroundImage: "linear-gradient(45deg,#8A2BE2 30%,blue,green)", backgroundClip: "text" }}>Login</Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <TextField label="Username" value={data.name} onChange={(e) => update("name", e.target.value)} />
                <PasswordField text="Password" value={data.password} onChange={(e) => update("password", e.target.value)} />
                <Button variant="contained" type="submit" disabled={processing}>Login</Button>
            </Stack>
        </form>
    );
};

const Signup = () => {
    const router = useRouter();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");
    const [data, setData] = useState({ name: "", email: "", password: "", password_confirmation: "" });
    const update = (field: string, value: string) => setData((prev) => ({ ...prev, [field]: value }));

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setProcessing(true);
        setError("");
        api.post("/auth/register", data)
            .then(() => router.push("/workspace"))
            .catch((err) => setError(err.response?.data?.error || "Registration failed"))
            .finally(() => setProcessing(false));
    };

    return (
        <form onSubmit={submit}>
            <Stack spacing={2}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "transparent", backgroundImage: "linear-gradient(45deg,#8A2BE2 30%,blue,green)", backgroundClip: "text" }}>Sign Up</Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <TextField label="Name" value={data.name} onChange={(e) => update("name", e.target.value)} />
                <TextField label="Email" value={data.email} onChange={(e) => update("email", e.target.value)} />
                <PasswordField text="Password" value={data.password} onChange={(e) => update("password", e.target.value)} />
                <PasswordField text="Confirm Password" value={data.password_confirmation} onChange={(e) => update("password_confirmation", e.target.value)} />
                <Button type="submit" variant="contained" disabled={processing}>Sign Up</Button>
            </Stack>
        </form>
    );
};

export default function AuthForm() {
    const { state } = UserLoginStates(useShallow((states) => ({
        state: states.userState,
        toggle: states.toogleUserState,
    })));

    return (
        <Box sx={{ display: "flex", overflow: "hidden" }}>
            <Box sx={{ display: "flex", minWidth: "100%", justifyContent: "center", alignItems: "center", textAlign: "center", transform: state ? "translateX(0%)" : "translateX(-100%)", transition: "transform 0.5s" }}>
                <Login />
            </Box>
            <Box sx={{ display: "flex", minWidth: "100%", justifyContent: "center", alignItems: "center", textAlign: "center", transform: state ? "translateX(0%)" : "translateX(-100%)", transition: "transform 0.5s" }}>
                <Signup />
            </Box>
        </Box>
    );
}
