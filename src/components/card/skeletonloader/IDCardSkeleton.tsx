import { Box, Skeleton } from "@mui/material";

export default function IDCardSkeleton() {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        mx:3,
        my:6
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", sm: "90%", md: "70%" },
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
          overflow: "hidden",
          p: 0,
        }}
      >
        {/* TOP BLUE HEADER */}
        <Box
          sx={{
            height: "80px",
            backgroundColor: "#0A314F",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 3,
          }}
        >
          <Skeleton
            variant="rectangular"
            width="60%"
            height={30}
            sx={{ bgcolor: "rgba(255,255,255,0.3)", borderRadius: 1 }}
          />
        </Box>

        {/* CONTENT SECTION */}
        <Box sx={{ display: "flex", padding: "24px" }}>
          {/* PROFILE IMAGE */}
          <Skeleton
            variant="rectangular"
            width={120}
            height={150}
            sx={{
              borderRadius: "12px",
              mr: 3,
            }}
          />

          {/* TEXT LINES */}
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
              <Skeleton width="20%" height={22} sx={{ mr: 2 }} />
              <Skeleton width="40%" height={22} />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
              <Skeleton width="20%" height={22} sx={{ mr: 2 }} />
              <Skeleton width="50%" height={22} />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
              <Skeleton width="20%" height={22} sx={{ mr: 2 }} />
              <Skeleton width="70%" height={22} />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
              <Skeleton width="20%" height={22} sx={{ mr: 2 }} />
              <Skeleton width="35%" height={22} />
            </Box>
          </Box>

          {/* SIGNATURE */}
          <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            <Skeleton width={70} height={40} sx={{ mb: 1 }} />
            <Skeleton width={100} height={18} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
