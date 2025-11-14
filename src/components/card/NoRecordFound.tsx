import { Box } from '@mui/material';
import SearchOffIcon from "@mui/icons-material/SearchOff";
import Customtext from '../customtext/Customtext';
import theme from '../../styles/theme';

export default function NoRecordFound() {
  return (
    <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: "text.secondary",
        }}
      >
        <SearchOffIcon sx={{ fontSize: 50, mb: 1, color: "grey.500" }} />
        <Customtext
          fieldName={'No records found'} sx={{fontSize:'1.25rem',color:theme.palette.text.secondary}}/>
           <Customtext
          fieldName={'Please check your search or filters.'} 
          sx={{fontSize:'0.95rem',color:theme.palette.text.secondary,fontWeight:'400'}}/>
      </Box>

  );
}






