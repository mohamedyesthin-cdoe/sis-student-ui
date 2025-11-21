import { Box, Skeleton } from "@mui/material";

export default function IDCardSkeleton() {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        mx: 3,
        my: 6,
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
        {/* TOP HEADER */}
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
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            padding: "24px",
            gap: { xs: 3, md: 0 },
          }}
        >
          {/* PROFILE IMAGE */}
          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "center", md: "flex-start" },
              mr: { md: 3 },
            }}
          >
            <Skeleton
              variant="rectangular"
              width={120}
              height={150}
              sx={{
                borderRadius: "12px",
              }}
            />
          </Box>

          {/* TEXT LINES */}
          <Box
            sx={{
              flexGrow: 1,
              mt: { xs: 1, md: 0 },
            }}
          >
            {/* 4 ROWS */}
            {[40, 50, 70, 35].map((width, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 1.5,
                }}
              >
                {/* LABEL (small width) */}
                <Box sx={{ width: { xs: "35%", md: "20%" }, mr: 2 }}>
                  <Skeleton width="100%" height={22} />
                </Box>

                {/* VALUE (dynamic width) */}
                <Box sx={{ width: { xs: "65%", md: `${width}%` } }}>
                  <Skeleton width="100%" height={22} />
                </Box>
              </Box>
            ))}
          </Box>

          {/* SIGNATURE SECTION */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: { xs: "center", md: "flex-end" },
              mt: { xs: 2, md: 0 },
            }}
          >
            <Skeleton width={70} height={40} sx={{ mb: 1 }} />
            <Skeleton width={100} height={18} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
