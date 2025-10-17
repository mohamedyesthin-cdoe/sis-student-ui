import {
  Box,
  Card,
  Typography,
  // Button,
  Avatar,
} from "@mui/material";
import ConstructionIcon from "@mui/icons-material/Construction";

export default function ComingSoon() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "linear-gradient(to bottom right, #f9fafb, #f3f4f6)",
        display: "flex",
        justifyContent: "center",
        pt: 20, // top spacing
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 400,
          height: 300,
          borderRadius: 4,
          boxShadow: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          p: 4,
        }}
      >
        {/* Icon Section */}
        <Avatar
          sx={{
            bgcolor: "#e5e7eb",
            width: 70,
            height: 70,
            mb: 3,
          }}
        >
          <ConstructionIcon sx={{ fontSize: 36, color: "#105c8e" }} />
        </Avatar>

        {/* Title */}
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: "#1e293b", mb: 1 }}
        >
          Coming Soon
        </Typography>

        {/* Subtitle */}
        <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
          We’re putting the final touches on something amazing.
          <br />
          Stay tuned for the launch!
        </Typography>

        {/* Notify Button */}
        {/* <Button
          variant="contained"
          sx={{
            backgroundColor: "#105c8e",
            textTransform: "none",
            borderRadius: 2,
            px: 4,
            py: 1.2,
            "&:hover": { backgroundColor: "#0d4a71" },
          }}
          onClick={() => window.location.reload()}
        >
          Notify Me
        </Button> */}

        {/* Footer */}
        {/* <Typography
          variant="caption"
          sx={{ color: "text.disabled", mt: 3 }}
        >
          © {new Date().getFullYear()} Your Company Name
        </Typography> */}
      </Card>
    </Box>
  );
}
