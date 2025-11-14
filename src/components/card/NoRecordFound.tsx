import { Box } from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import Customtext from "../customtext/Customtext";

export default function NoRecordFound() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "text.secondary",
        animation: "float 3s ease-in-out infinite",
        "@keyframes float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      }}
    >
      <SearchOffIcon
        sx={{
          fontSize: 60,
          mb: 1,
          color: "grey.600",
          animation: "pulse 1.6s infinite",
          "@keyframes pulse": {
            "0%": { transform: "scale(1)" },
            "50%": { transform: "scale(1.08)" },
            "100%": { transform: "scale(1)" },
          },
        }}
      />


      <Customtext
        fieldName="No records found"
        sx={{
          fontSize: { xs: "1rem", md: "1.4rem" },
          fontWeight: 600,
        }}
      />

      <Customtext
        fieldName="Please check your search or filters."
        sx={{
          fontSize: { xs: "0.8rem", md: "1rem" },
          fontWeight: 400,
        }}
      />
    </Box>
  );
}
