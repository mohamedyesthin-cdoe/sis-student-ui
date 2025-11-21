import { Box, Divider, Skeleton } from "@mui/material";
import CardComponent from "../Card";

export default function AddressSkeleton() {
  return (
    <CardComponent
      sx={{
        width: "100%",
        maxWidth: { xs: "100%", sm: "700px", md: "900px" },
        mx: "auto",
      }}
    >
      {/* Title */}
      <Box sx={{ py: 2, px: { xs: 2, sm: 3 } }}>
        <Box sx={{ width: { xs: "40%", sm: "25%" } }}>
          <Skeleton variant="text" height={25} width="100%" />
        </Box>
      </Box>

      <Divider sx={{ borderColor: "#899000" }} />

      {/* Inner content */}
      <CardComponent
        sx={{
          boxShadow: "none",
          border: "none",
          p: { xs: 1.5, sm: 2 },
          mb: 0,
        }}
      >
        {[...Array(2)].map((_, index) => (
          <Box
            key={index}
            sx={{
              backgroundColor: "white",
              p: { xs: 1, sm: 1.5 },
              width: "100%",
              mb: 1.5,
              borderRadius: 2,
            }}
          >
            <Box display="flex" alignItems="center">
              {/* Icon placeholder */}
              <Box
                sx={{
                  width: { xs: 40, sm: 50 },
                  height: { xs: 40, sm: 50 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f0f0f0",
                  borderRadius: 3,
                  mr: 2,
                }}
              >
                <Skeleton variant="circular" width={28} height={28} />
              </Box>

              {/* Text group */}
              <Box flexGrow={1}>
                <Box sx={{ width: { xs: "60%", sm: "40%" } }}>
                  <Skeleton variant="text" height={18} width="100%" />
                </Box>

                <Box sx={{ width: { xs: "90%", sm: "80%" }, mt: .5 }}>
                  <Skeleton variant="text" height={18} width="100%" />
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </CardComponent>
    </CardComponent>
  );
}
