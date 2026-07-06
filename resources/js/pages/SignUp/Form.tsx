"use client"
import { UserLoginStates } from "./States";
import { Box,Stack,TextField,ToggleButtonGroup,ToggleButton,Typography,Button } from "@mui/material";
import PasswordField from "../../components/ui/password";
import { useShallow } from "zustand/react/shallow";
import React, { FormEvent } from "react";
import { route } from 'ziggy-js';
import { useForm,Head } from "@inertiajs/react";
const Login=()=>{
    const { data,setData,post,processing,errors }=useForm({
        name:'',
        password:'',
    })
    const submit=(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        post(route('login.store'),{
            onError:(errors)=>{
                console.log("validation failed",errors);
            }
        });
    }
    return(
        <form onSubmit={submit}>
            <Stack spacing={2}>
                <Typography variant="h4" sx={{fontWeight:800,color:"transparent", backgroundImage:"linear-gradient(45deg,#8A2BE2 30%,blue,green)", backgroundClip:"text"}}>Login</Typography>
                <TextField label="Username" value={data.name} onChange={(e)=>setData('name',e.target.value)}/>
                <PasswordField text="Password" value={data.password} onChange={(e)=>setData('password',e.target.value)}/>
                <Button variant="contained" type="submit" disabled={processing}>Login</Button>
            </Stack>
        </form>
    )
}
const Signup=()=>{
    const { data,setData,post,processing }=useForm({
        name:'',
        email:'',
        password:'',
        password_confirmation:''
    })
    const submit=(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        post(route('register.store'));
    }
    return(
            <form onSubmit={submit}>
                <Stack spacing={2}>
                    <Typography variant="h4" sx={{fontWeight:800,color:"transparent", backgroundImage:"linear-gradient(45deg,#8A2BE2 30%,blue,green)", backgroundClip:"text"}}>Sign Up</Typography>
                    <TextField label="Name" value={data.name} onChange={(e)=>setData('name',e.target.value)}/>
                    <TextField label="Email" value={data.email} onChange={(e)=>setData('email',e.target.value)}/>
                    <PasswordField text="Password" value={data.password} onChange={(e)=>setData('password',e.target.value)}/>
                    <PasswordField text="Confirm Password" value={data.password_confirmation} onChange={(e)=>setData('password_confirmation',e.target.value)}/>
                    <Button type="submit" variant="contained" disabled={processing}>Sign Up</Button>
                </Stack>
            </form>
        )
    }
    export default function AuthForm(){
        const {state}=UserLoginStates(useShallow(
            states=>({
                state:states.userState,
                toggle:states.toogleUserState
            })
        ));
        return(
            <Box sx={{display:"flex", overflow:"hidden"}}>
                <Box sx={{display:"flex", minWidth:"100%", justifyContent:"center", alignItems:"center", textAlign:"center", transform:state?"translateX(0%)":"translateX(-100%)", transition:"transform 0.5s"}}>
                    <Login/>
                </Box>
                <Box sx={{display:"flex", minWidth:"100%", justifyContent:"center", alignItems:"center", textAlign:"center", transform:state?"translateX(0%)":"translateX(-100%)", transition:"transform 0.5s"}}>
                    <Signup/>
                </Box>
            </Box>
    )
}