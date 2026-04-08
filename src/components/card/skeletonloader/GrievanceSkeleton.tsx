import { Box, Grid, Skeleton } from "@mui/material";
import CardComponent from "../Card";
import Customtext from "../../inputs/customtext/Customtext";

export default function GrievanceSkeleton() {
    return (
        <Box className="space-y-3">

            {/* GRIEVANCE DETAILS */}

            <CardComponent sx={{ p: 3 }}>
                <Customtext
                    fieldName="Grievance Details"
                    sx={{
                        mb: 2,
                        fontSize: {
                            xs: "0.875rem",
                            sm: "1rem",
                            md: "1.125rem",
                            lg: "1rem",
                            xl: "1.5rem",
                        },
                    }}
                />

                <Grid container spacing={2}>

                    {/* SUBJECT */}

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Skeleton
                            variant="text"
                            width="40%"
                            height={20}
                        />

                        <Skeleton
                            variant="rectangular"
                            height={45}
                            sx={{ borderRadius: 1 }}
                        />
                    </Grid>

                    {/* DESCRIPTION */}

                    <Grid size={{ xs: 12 }}>
                        <Skeleton
                            variant="text"
                            width="40%"
                            height={20}
                        />

                        <Skeleton
                            variant="rectangular"
                            height={100}
                            sx={{ borderRadius: 1 }}
                        />
                    </Grid>

                    {/* FILE UPLOAD */}

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Skeleton
                            variant="rectangular"
                            height={90}
                            sx={{
                                borderRadius: 2,
                            }}
                        />

                        <Skeleton
                            variant="text"
                            width="60%"
                            height={18}
                            sx={{ mt: 1 }}
                        />
                    </Grid>

                </Grid>
            </CardComponent>

            {/* BUTTONS */}

            <Box
                mt={4}
                display="flex"
                gap={2}
                sx={{
                    justifyContent: {
                        xs: "center",
                        sm: "flex-end",
                    },
                }}
            >
                <Skeleton
                    variant="rectangular"
                    width={90}
                    height={40}
                    sx={{ borderRadius: 1 }}
                />

                <Skeleton
                    variant="rectangular"
                    width={90}
                    height={40}
                    sx={{ borderRadius: 1 }}
                />

                <Skeleton
                    variant="rectangular"
                    width={110}
                    height={40}
                    sx={{ borderRadius: 1 }}
                />
            </Box>

        </Box>
    );
}