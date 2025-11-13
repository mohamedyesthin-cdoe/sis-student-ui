import {  Box } from '@mui/material';
import SearchOffIcon from "@mui/icons-material/SearchOff";
import CardComponent from '../../components/card/Card';
import Customtext from '../customtext/Customtext';

export default function NoRecordFound() {
  return (
    <CardComponent
      sx={{
        width: '100%',
        maxWidth: { xs: '350px', sm: '900px', md: '1300px' },
        mx: 'auto',
        p: 3,
        mt: 3,
      }}
    >
      {/* No Data Found */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 8,
          color: "text.secondary",
        }}
      >
        <SearchOffIcon sx={{ fontSize: 50, mb: 1, color: "grey.500" }} />
        <Customtext
          fieldName={'No records found'}
          variantName="h6"
        />
      </Box>

    </CardComponent>
  );
}






