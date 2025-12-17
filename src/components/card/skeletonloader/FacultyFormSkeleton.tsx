import { Box, Grid, Skeleton } from "@mui/material";
import CardComponent from "../Card"; // adjust path if needed

export default function FacultyFormSkeleton() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <CardComponent sx={{ p: 3 }}>
        {/* Section Title */}
        <Skeleton variant="text" width={220} height={32} sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          {/* Generate skeleton inputs (matches your fields count & layout) */}
          {Array.from({ length: 11 }).map((_, index) => (
            <Grid key={index} size={{ xs: 12, md: 4 }}>
              <Skeleton variant="text" width="40%" height={18} />
              <Skeleton
                variant="rounded"
                height={44}
                sx={{ mt: 1 }}
              />
            </Grid>
          ))}

          {/* Gender Radio Skeleton */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Skeleton variant="text" width={100} height={18} />
            <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
              <Skeleton variant="rounded" width={70} height={32} />
              <Skeleton variant="rounded" width={70} height={32} />
              <Skeleton variant="rounded" width={70} height={32} />
            </Box>
          </Grid>
        </Grid>

        {/* Buttons Skeleton */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            mt: 4,
          }}
        >
          <Skeleton variant="rounded" width={90} height={36} />
          <Skeleton variant="rounded" width={90} height={36} />
          <Skeleton variant="rounded" width={120} height={36} />
        </Box>
      </CardComponent>
    </Box>
  );
}
