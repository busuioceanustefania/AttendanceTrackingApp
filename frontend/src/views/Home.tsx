import { Box } from "@mui/material";
import icon from '../icon.png'

export default function Home(){
    return(
        <Box display="flex" flexDirection="column" alignItems="center">
        <div>
          <h1 style={{ color: "#7D0A0A" }}>Welcome to Attendify!</h1>
        </div>
        <div>
          <img src={icon} alt="Icon" style={{ width: '450px', height: '500px' }} />
        </div>
      </Box>
    )    
}