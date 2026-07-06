import { Box } from "@mui/material"
import MainPage from "./PageHolder"
import ProjectCard from "./ProjectCard"
export default function Home(){
    return(
        <MainPage>
            <Box className="w-full justify-around flex flex-wrap">
                <ProjectCard/>
            </Box>
        </MainPage>
    )
}