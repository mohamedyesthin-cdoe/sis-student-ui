import { Box, Grid, Skeleton } from "@mui/material";
import CardComponent from "../Card";
import theme from "../../../styles/theme";
import Customtext from "../../inputs/customtext/Customtext";

export default function ProgramFeeSkeleton() {
    return (
        <Box className="space-y-3">

            {/* PROGRAM DETAILS */}
            <CardComponent sx={{ p: 3 }}>
                <Customtext fieldName="Program Details" sx={{
                    mb: 2, fontSize: {
                        xs: '0.875rem', // 14px
                        sm: '1rem',     // 16px
                        md: '1.125rem', // 18px
                        lg: '1rem',  // 20px
                        xl: '1.5rem',   // 24px
                    },
                }} />
                <Grid container spacing={3}>
                    {/* Program ID */}
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Skeleton variant="text" width="40%" height={20} />
                        <Skeleton variant="rectangular" height={45} sx={{ borderRadius: 1 }} />
                    </Grid>

                    {/* Program Name */}
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Skeleton variant="text" width="50%" height={20} />
                        <Skeleton variant="rectangular" height={45} sx={{ borderRadius: 1 }} />
                    </Grid>

                    {/* Duration */}
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Skeleton variant="text" width="40%" height={20} />
                        <Skeleton variant="rectangular" height={45} sx={{ borderRadius: 1 }} />
                    </Grid>

                    {/* Faculty */}
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Skeleton variant="text" width="40%" height={20} />
                        <Skeleton variant="rectangular" height={45} sx={{ borderRadius: 1 }} />
                    </Grid>

                    {/* Category */}
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Skeleton variant="text" width="40%" height={20} />
                        <Skeleton variant="rectangular" height={45} sx={{ borderRadius: 1 }} />
                    </Grid>
                </Grid>
            </CardComponent>

            {/* SEMESTER FEE DETAILS */}
            <CardComponent sx={{ p: 3 }}>
                <Customtext fieldName="Semester Fee Details"
                    sx={{
                        fontSize: {
                            xs: '0.875rem', // 14px
                            sm: '1rem',     // 16px
                            md: '1.125rem', // 18px
                            lg: '1rem',  // 20px
                            xl: '1.5rem',   // 24px
                        },
                    }} />

                {/* Repeat for 6 semesters */}
                {[1, 2, 3, 4, 5, 6].map((sem) => (
                    <Box key={sem} className="py-3">
                        <Customtext
                            fieldName={`Semester ${sem}`}
                            sx={{ mb: 2, color: theme.palette.text.primary }}
                        />

                        <Grid container spacing={2}>
                            {/* Application Fee */}
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <Skeleton variant="text" width="50%" height={20} />
                                <Skeleton variant="rectangular" height={45} sx={{ borderRadius: 1 }} />
                            </Grid>

                            {/* Admission Fee */}
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <Skeleton variant="text" width="50%" height={20} />
                                <Skeleton variant="rectangular" height={45} sx={{ borderRadius: 1 }} />
                            </Grid>

                            {/* Tuition Fee */}
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <Skeleton variant="text" width="50%" height={20} />
                                <Skeleton variant="rectangular" height={45} sx={{ borderRadius: 1 }} />
                            </Grid>

                            {/* Exam Fee */}
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <Skeleton variant="text" width="50%" height={20} />
                                <Skeleton variant="rectangular" height={45} sx={{ borderRadius: 1 }} />
                            </Grid>

                            {/* LMS Fee */}
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <Skeleton variant="text" width="50%" height={20} />
                                <Skeleton variant="rectangular" height={45} sx={{ borderRadius: 1 }} />
                            </Grid>

                            {/* Lab Fee */}
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <Skeleton variant="text" width="50%" height={20} />
                                <Skeleton variant="rectangular" height={45} sx={{ borderRadius: 1 }} />
                            </Grid>

                            {/* Total Fee */}
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <Skeleton variant="text" width="40%" height={20} />
                                <Skeleton variant="rectangular" height={45} sx={{ borderRadius: 1 }} />
                            </Grid>
                        </Grid>
                    </Box>
                ))}
            </CardComponent>
        </Box>
    );
}
