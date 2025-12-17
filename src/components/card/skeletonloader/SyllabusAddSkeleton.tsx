import { Box, Grid, Skeleton } from "@mui/material";
import CardComponent from "../Card"; // adjust path if needed

export default function SyllabusAddSkeleton() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <CardComponent sx={{ p: 4 }}>
        <Grid container spacing={3}>
          {/* Autocomplete + Add Button rows */}
          {[1, 2, 3].map((_, index) => (
            <Grid
              key={index}
              size={{ xs: 12, md: 6 }}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Skeleton variant="text" width="40%" height={18} />
                <Skeleton variant="rounded" height={44} sx={{ mt: 1 }} />
              </Box>
              <Skeleton
                variant="rounded"
                width={42}
                height={42}
                sx={{ mt: 3 }}
              />
            </Grid>
          ))}

          {/* Remaining fields (Semester + numeric inputs) */}
          {Array.from({ length: 7 }).map((_, index) => (
            <Grid key={index} size={{ xs: 12, md: 6 }}>
              <Skeleton variant="text" width="35%" height={18} />
              <Skeleton variant="rounded" height={44} sx={{ mt: 1 }} />
            </Grid>
          ))}
        </Grid>

        {/* Action Buttons */}
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
