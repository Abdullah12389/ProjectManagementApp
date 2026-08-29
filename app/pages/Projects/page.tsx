import { Box } from "@mui/material"
import MainPage from "./PageHolder"
import ProjectCard from "./ProjectCard"
export default function Home({ workspaceId }: { workspaceId: string }){
    return(
        <MainPage>
            <Box className="w-full justify-around flex flex-wrap">
                <ProjectCard workspaceId={workspaceId}/>
            </Box>
        </MainPage>
    )
}
