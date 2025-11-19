import { Box, Divider, Skeleton } from "@mui/material";
import CardComponent from "./Card";

export default function AddressSkeleton() {
  return (
    <CardComponent>
      {/* Title */}
      <Box className="py-2 px-3">
        <Skeleton variant="text" width="25%" height={25} />
      </Box>

      <Divider sx={{ borderColor: "#899000" }} />

      {/* Inner content */}
      <CardComponent
        p={2}
        sx={{ boxShadow: "none", mb: 0, border: "none" }}
      >
        {[...Array(2)].map((_, index) => (
          <Box
            key={index}
            sx={{
              backgroundColor: "white",
              p: 1,
              width: "100%",
              mb: 1,
            }}
          >
            <Box display="flex" alignItems="center">
              {/* Icon placeholder */}
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f0f0f0",
                  borderRadius: 3,
                  mr: 2,
                  mb: 1,
                }}
              >
                <Skeleton variant="circular" width={32} height={32} />
              </Box>

              {/* Title + text */}
              <Box sx={{ flexGrow: 1 }}>
                <Skeleton variant="text" width="40%" height={20} />
                <Skeleton variant="text" width="80%" height={20} />
              </Box>
            </Box>
          </Box>
        ))}
      </CardComponent>
    </CardComponent>
  );
}
