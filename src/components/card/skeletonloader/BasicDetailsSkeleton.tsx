import { Box, Skeleton, Divider } from "@mui/material";
import CardComponent from "../Card";

export default function BasicDetailsSkeleton() {
  return (
    <CardComponent>
      {/* Title */}
      <Box className="py-2 px-3">
        <Skeleton variant="text" width="30%" height={25} />
      </Box>

      <Divider sx={{ borderColor: '#899000' }} />

      {/* Body */}
      <CardComponent
        p={2}
        sx={{
          boxShadow: "none",
          border: "none",
        }}
      >
        {/* Two-column layout */}
        <Box
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* LEFT COLUMN (5 rows) */}
          <Box className="flex flex-col gap-4">
            {[...Array(3)].map((_, i) => (
              <Box key={i} className="grid grid-cols-2 gap-2 items-center">
                {/* Label */}
                <Skeleton variant="text" width="80%" height={20} />

                {/* Value */}
                <Skeleton variant="text" width="90%" height={22} />
              </Box>
            ))}
          </Box>

          {/* RIGHT COLUMN (4 rows) */}
          <Box className="flex flex-col gap-4">
            {[...Array(3)].map((_, i) => (
              <Box key={i} className="grid grid-cols-2 gap-2 items-center">
                {/* Label */}
                <Skeleton variant="text" width="80%" height={20} />

                {/* Value */}
                <Skeleton variant="text" width="90%" height={22} />
              </Box>
            ))}
          </Box>
        </Box>
      </CardComponent>
    </CardComponent>
  );
}
