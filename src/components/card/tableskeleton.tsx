import { Box, Skeleton } from "@mui/material";

export default function TableSkeleton() {
    return (
        <Box sx={{ width: "100%", mt: 2 }}>
            {/* Table Header */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 2fr 1.5fr 1fr",
                    gap: 2,
                    mb: 2,
                }}
            >
                <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
            </Box>

            {/* Table Rows */}
            {[1, 2, 3, 4, 5].map((row) => (
                <Box
                    key={row}
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 2fr 1.5fr 1fr",
                        gap: 2,
                        mb: 1.6,
                    }}
                >
                    <Skeleton variant="rectangular" height={32} sx={{ borderRadius: 1 }} />
                    <Skeleton variant="rectangular" height={32} sx={{ borderRadius: 1 }} />
                    <Skeleton variant="rectangular" height={32} sx={{ borderRadius: 1 }} />
                    <Skeleton variant="rectangular" height={32} sx={{ borderRadius: 1 }} />
                </Box>
            ))}
        </Box>
    );
}