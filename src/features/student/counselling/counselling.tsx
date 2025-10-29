import { Box, Typography, Divider, Table, TableBody, TableCell, TableHead, TableRow, List, ListItem, ListItemText } from "@mui/material";
import CardComponent from "../../../components/card/Card"; // adjust path if needed

export default function StudentCounselling() {
    const counsellors = [
        { name: "Ms. M. Mary Esther", contact: "mary@sriramachandra.edu.in" },
        { name: "Mr. P. Madhusudhanan", contact: "madhusudhanan@sriramachandra.edu.in" },
    ];

    const services = [
        "Academic guidance and course selection",
        "Career counselling and exploration",
        "Stress management and wellness tips",
        "Personal support and mentoring",
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
                    Welcome to Sri Ramachandra Digilearn! As your counsellors, we are here to support you throughout your academic journey.
                    Our role is to provide guidance on academic matters, career choices, and personal issues.
                    We are committed to helping you achieve your goals and overcome challenges.
                </Typography>

                {/* ===== Support Areas ===== */}
                <Typography mb={1}>
                    Feel free to reach out to us for:
                </Typography>

                <List sx={{ listStyleType: "disc", pl: 4 }}>
                    {services.map((item, index) => (
                        <ListItem key={index} sx={{ display: "list-item", py: 0 }}>
                            <ListItemText primary={item} />
                        </ListItem>
                    ))}
                </List>

                {/* ===== Counsellor Table ===== */}
                <Box sx={{ overflowX: "auto", mt: 2 }}>
                    <Table sx={{ minWidth: 400, border: "1px solid #ddd" }}>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "grey.100" }}>
                                <TableCell sx={{ fontWeight: "bold", border: "1px solid #ddd" }}>S. No.</TableCell>
                                <TableCell sx={{ fontWeight: "bold", border: "1px solid #ddd" }}>Name of the Counsellor</TableCell>
                                <TableCell sx={{ fontWeight: "bold", border: "1px solid #ddd" }}>Email</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {counsellors.map((c, index) => (
                                <TableRow key={index}>
                                    <TableCell align="center" sx={{ border: "1px solid #ddd" }}>
                                        {index + 1}
                                    </TableCell>
                                    <TableCell sx={{ border: "1px solid #ddd" }}>{c.name}</TableCell>
                                    <TableCell sx={{ border: "1px solid #ddd" }}>{c.contact}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </Box>
        </CardComponent>
    );
}
