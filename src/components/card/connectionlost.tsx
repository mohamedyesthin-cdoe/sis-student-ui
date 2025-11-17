import { Box, Typography } from "@mui/material";
import CloudOffIcon from "@mui/icons-material/CloudOff";

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

      <Typography sx={{ fontSize: "1.2rem", fontWeight: 700 }}>
        Connection Lost
      </Typography>

      <Typography sx={{ color: "text.secondary", mt: 1 }}>
        Please check your internet connection.
      </Typography>
    </Box>
  );
}
