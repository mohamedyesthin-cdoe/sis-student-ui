import { Box, Grid, Skeleton, Divider } from "@mui/material";
import CardComponent from "../Card";

export default function GrievanceSkeletonAdmin() {
  return (
    <Box sx={{ p: 3 }}>
      <CardComponent
        sx={{
          p: 4,
          borderRadius: 3,
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Skeleton variant="text" width={220} height={40} />
          <Skeleton
            variant="rounded"
            width={120}
            height={32}
            sx={{ borderRadius: 5 }}
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          {/* LEFT CONTENT */}
          <Grid size={{ xs: 12, md: 7 }}>
            {/* STUDENT INFO ROW */}
            <Grid container spacing={3} mb={2}>
              <Grid size={6}>
                <Skeleton variant="text" width={140} />
                <Skeleton variant="text" width={180} height={28} />
              </Grid>

              <Grid size={6}>
                <Skeleton variant="text" width={180} />
                <Skeleton variant="text" width={160} height={28} />
              </Grid>
            </Grid>

            <Divider sx={{ mb: 3 }} />

            {/* SUBJECT */}
            <Box mb={3}>
              <Skeleton variant="text" width={100} />
              <Skeleton variant="text" width="70%" height={32} />
            </Box>

            {/* DESCRIPTION */}
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: "#f8f9fa",
                border: "1px solid #e0e0e0",
                mb: 3,
              }}
            >
              <Skeleton variant="text" width={120} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="95%" />
              <Skeleton variant="text" width="90%" />
              <Skeleton variant="text" width="85%" />
            </Box>
          </Grid>

          {/* RIGHT ATTACHMENT */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Skeleton
              variant="text"
              width={140}
              sx={{ mb: 2 }}
            />

            {/* Attachment Preview */}
            <Skeleton
              variant="rounded"
              width="100%"
              height={520}
              sx={{
                borderRadius: 2,
                mb: 2,
              }}
            />

            {/* Download Button */}
            <Skeleton
              variant="rounded"
              width="100%"
              height={40}
            />
          </Grid>
        </Grid>

        {/* BACK BUTTON */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 4,
          }}
        >
          <Skeleton
            variant="rounded"
            width={100}
            height={40}
          />
        </Box>
      </CardComponent>
    </Box>
  );
}