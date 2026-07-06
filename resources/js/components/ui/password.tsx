"use client"
import { EyeIcon,EyeSlashIcon } from "@heroicons/react/16/solid";
import { useState } from "react";
import { TextFieldProps } from "@mui/material";
import { TextField,InputAdornment,IconButton } from "@mui/material";

type PasswordFieldProps=TextFieldProps & {
    className?:string
    text:string 
}

export default function PasswordField({className,text,...props}:PasswordFieldProps){
  const [state,setState]=useState<boolean>(false);
  return(
    <TextField
      variant="outlined"
      label={text}
      className={className}
      {...props}
      type={state?"text":"password"}
      slotProps={{
        input:{
          endAdornment:(
            <InputAdornment position="end">
              <IconButton onClick={()=>setState(!state)}>
                {state?<EyeIcon className="h-5 w-5"/>:<EyeSlashIcon className="h-5 w-5"/>}
              </IconButton>
            </InputAdornment>
          )
        }
      }}
    />
  )
}