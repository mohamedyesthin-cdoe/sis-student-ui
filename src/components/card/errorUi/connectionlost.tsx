import { Box } from "@mui/material";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import Customtext from "../../customtext/Customtext";
import theme from "../../../styles/theme";

export function ConnectionLostUI() {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: 5,
        animation: "pulse 2s infinite",
        "@keyframes pulse": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)" },
        },
      }}
    >
      <CloudOffIcon sx={{ fontSize: 80, color: "grey.600", mb: 2 }} />
      <Customtext
        fieldName='Connection Lost'
        sx={{
          fontSize: { xs: "1rem", md: "1.4rem" },
          fontWeight: 600,
        }}
      />
      <Customtext
        fieldName='Please check your internet connection.'
        sx={{
          fontSize: { xs: "0.8rem", md: "1rem" },
          fontWeight: 400,
          color: theme.palette.text.secondary
        }}
      />
    </Box>
  );
}
