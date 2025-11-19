import { Box, Typography } from "@mui/material";

export function ServerErrorUI() {
  return (
    <Box sx={{ textAlign: "center", py: 4 }}>
      <Typography sx={{ fontSize: "1.3rem", fontWeight: 700 }}>
        Server Error
      </Typography>

      <Typography sx={{ color: "text.secondary", mt: 1 }}>
        Something went wrong on our side. Please try again in a few minutes.
      </Typography>
    </Box>
  );
}
