"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { TextField, InputAdornment } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { setSearchTerm } from "@/app/searchSlice";

export default function Search({ className }: { className?: string }) {
    const dispatch = useDispatch();
    const searchTerm = useSelector((state: RootState) => state.search.term);
    return (
        <TextField
            className={className}
            variant="outlined"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            sx={{
                borderRadius: 20,
                "& .MuiOutlinedInput-root": {
                    borderRadius: 20,
                    height: "50px",
                },
            }}
            slotProps={{
                input: {
                    startAdornment: (
                        <InputAdornment position="start">
                            <MagnifyingGlassIcon className="w-7 h-7" />
                        </InputAdornment>
                    ),
                },
            }}
        />
    );
}
