import { Box, Skeleton, Divider } from "@mui/material";
import CardComponent from "../Card";

export default function ProfileSkeleton() {
  return (
    <CardComponent>
    <Box
      sx={{
        width: "100%",
        maxWidth: { xs: "350px", sm: "900px", md: "1300px" },
        mx: "auto",
        p: 0,
      }}
    >
      {/* Cover Image Skeleton */}
      <Skeleton variant="rectangular" width="100%" height={120} />

      <Box
        sx={{
          mx: { xs: 2, sm: 3 },
          pb: 4,
        }}
      >
        {/* Avatar + Name + ID */}
        <Box
          sx={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: -6, // same as avatar lift in real UI
          }}
        >
          {/* Avatar Skeleton */}
          <Skeleton
            variant="circular"
            width={80}
            height={80}
            sx={{ borderRadius: "50%" }}
          />

          {/* Fullname */}
          <Skeleton
            variant="text"
            width="50%"
            sx={{ mt: 1, fontSize: "1.2rem" }}
          />

          {/* Registration No */}
          <Skeleton
            variant="text"
            width="40%"
            sx={{ mb: 2, fontSize: "1rem" }}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mt: 3 }}>
          {/* Personal Info Title */}
          <Skeleton variant="text" width="30%" sx={{ mb: 2 }} />

          {/* Info grid skeleton (5–8 rows) */}
          <Box
            display="grid"
            gridTemplateColumns={{ xs: "1fr", sm: "1fr" }}
            gap={1}
          >
            {/* Repeat 6 rows of label + value skeletons */}
            {[...Array(6)].map((_, i) => (
              <Box
                key={i}
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "flex-start", sm: "center" }}
                py={0.5}
                gap={1}
              >
                {/* Label Skeleton */}
                <Skeleton variant="text" width="40%" />

                {/* Value Skeleton */}
                <Skeleton variant="text" width="60%" />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
    </CardComponent>
  );
}
