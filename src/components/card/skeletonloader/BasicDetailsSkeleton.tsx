import { Box, Skeleton, Divider } from "@mui/material";
import CardComponent from "../Card";

export default function BasicDetailsSkeleton() {
  return (
    <CardComponent>
      {/* Title */}
      <Box className="py-2 px-3">
        <Skeleton variant="text" width="30%" height={25} />
      </Box>

      <Divider sx={{ borderColor: "#899000" }} />

      {/* Inner content */}
      <CardComponent
        p={2}
        sx={{
          boxShadow: "none",
          border: "none",
          mb: 0,
        }}
      >
        {/* Two-column grid */}
        <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT COLUMN */}
          <Box className="flex flex-col gap-5">
            {[...Array(3)].map((_, index) => (
              <Box
                key={index}
                className="grid grid-cols-2 gap-3 items-center"
              >
                {/* Label */}
                <Skeleton variant="text" width="70%" height={20} />

                {/* Value */}
                <Skeleton variant="rounded" width="95%" height={20} />
              </Box>
            ))}
          </Box>

          {/* RIGHT COLUMN */}
          <Box className="flex flex-col gap-5">
            {[...Array(3)].map((_, index) => (
              <Box
                key={index}
                className="grid grid-cols-2 gap-3 items-center"
              >
                {/* Label */}
                <Skeleton variant="text" width="70%" height={20} />

                {/* Value */}
                <Skeleton variant="rounded" width="95%" height={20} />
              </Box>
            ))}
          </Box>
        </Box>
      </CardComponent>
    </CardComponent>
  );
}
