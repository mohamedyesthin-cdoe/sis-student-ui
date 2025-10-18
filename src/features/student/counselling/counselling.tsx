import { Box, Typography, Divider, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import CardComponent from "../../../components/card/Card"; // adjust path if needed

export default function StudentCounselling() {
    const counsellors = [
        { name: "Ms A. RISHIKULYA", contact: "8825924892" },
        { name: "Ms P. MADHUBALA", contact: "7092024760" },
        { name: "Ms PHILOMENA KIRUBAKARAN", contact: "9629469724" },
    ];

    return (
        <CardComponent>
            <Box sx={{ p: { xs: 2, sm: 4 } }}>
                {/* ===== Title ===== */}
                <Typography variant="h5" fontWeight="bold" mb={2}>
                    Student Counselling Service
                </Typography>

                <Divider sx={{ mb: 3 }} />

                {/* ===== Introduction ===== */}
                <Typography mb={2}>
                    College life can be stressful. If you are feeling overwhelmed by the pressures of being a student or by other stressors, seeking emotional support can help.
                </Typography>

                <Typography mb={2}>
                    Student Counselling Service at Sri Ramachandra Institute of Higher Education and Research (Deemed to be University) is committed to promoting the mental health and well-being of undergraduate and graduate students by providing accessible, quality mental health services.
                </Typography>

                <Typography mb={2}>
                    Student counsellors are available on campus for confidential counselling to all students.
                </Typography>

                <Typography mb={2}>
                    Counsellors will be completely non-judgemental, listen and empathise with you and then help you see new perspectives about the situations you are going through. We believe that you can problem solve and make decisions. Counsellors will help you through this process and provide strategies to make the most of your time at the University.
                </Typography>

                <Typography mb={2}>
                    Counselling will be provided face to face with the fullest confidentiality. There is no cost for students to access the services of the counsellors.
                </Typography>

                {/* ===== Contact Info ===== */}
                <Typography variant="h6" fontWeight="bold" mt={3} mb={1}>
                    Contact information and setting up appointments
                </Typography>

                <Typography mb={2}>
                    Student counsellors may be contacted directly on their numbers below:
                </Typography>

                {/* ===== Counsellor Table ===== */}
                {/* ===== Counsellor Table ===== */}
                <Box sx={{ overflowX: "auto", mb: 2 }}>
                    <Table sx={{ minWidth: 400, border: "1px solid #ddd" }}>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "grey.100" }}>
                                <TableCell sx={{ fontWeight: "bold", border: "1px solid #ddd" }}>S. No.</TableCell>
                                <TableCell sx={{ fontWeight: "bold", border: "1px solid #ddd" }}>Name of the Counsellor</TableCell>
                                <TableCell sx={{ fontWeight: "bold", border: "1px solid #ddd" }}>Contact Number</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {counsellors.map((c, index) => (
                                <TableRow key={index}>
                                    <TableCell align="center" sx={{ border: "1px solid #ddd" }}>{index + 1}</TableCell>
                                    <TableCell sx={{ border: "1px solid #ddd" }}>{c.name}</TableCell>
                                    <TableCell align="center" sx={{ border: "1px solid #ddd" }}>{c.contact}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>

                {/* ===== Additional Note ===== */}
                <Typography mt={2}>
                    You are encouraged to contact a counsellor directly and set up the first appointment to discuss your concerns with the counsellor.
                </Typography>

            </Box>
        </CardComponent>
    );
}
