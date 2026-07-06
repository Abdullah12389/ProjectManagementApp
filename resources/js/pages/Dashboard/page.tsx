import { Typography } from "@mui/material";
import MainPage from "../Projects/PageHolder";
import EmpTable from "./EmployeeTable";
import ProjTable from "./ProjectsTable";
import TeamTable from "./TeamsTable";
import {Box} from "@mui/material";
export default function Home(){
    return(
        <MainPage>
            <Box sx={{display:"flex", flexDirection:"column", gap:10}}>
                <EmpTable/>
                <ProjTable/>
                <TeamTable/>
            </Box>
        </MainPage>
    );
}   