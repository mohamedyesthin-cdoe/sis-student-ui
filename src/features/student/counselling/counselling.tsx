import { Box, Divider, List, ListItem, ListItemText } from "@mui/material";
import CardComponent from "../../../components/card/Card";
import ReusableTable from "../../../components/table/table";
import theme from "../../../styles/theme";
import Customtext from "../../../components/inputs/customtext/Customtext";

export default function StudentCounselling() {

    const counsellors = [
        { name: "Ms. M. Mary Esther", email: "mary@sriramachandra.edu.in" },
        { name: "Mr. P. Madhusudhanan", email: "madhusudhanan@sriramachandra.edu.in" },
    ];

    const services = [
        "Academic guidance and course selection",
        "Career counselling and exploration",
        "Stress management and wellness tips",
        "Personal support and mentoring",
    ];

    return (
        <>
            {
                <CardComponent
                    sx={{
                        width: "100%",
                        maxWidth: { xs: "350px", sm: "900px", md: "1300px" },
                        mx: "auto",
                        p: { xs: 3, sm: 4 },
                        mt: 3,
                    }}
                >
                    <Box mb={2}>
                        {/* ===== Title ===== */}
                        <Customtext fieldName={'Student Counselling Service'} sx={{ fontSize: '1.5rem', color: theme.palette.text.primary }} />

                        <Divider sx={{ mb: 3 }} />

                        {/* ===== Introduction ===== */}
                        <Customtext fieldName={'Welcome to Sri Ramachandra Digilearn! As your counsellors, we are here to support you throughout your academic journey.Our role is to provide guidance on academic matters, career choices, and personal issues.We are committed to helping you achieve your goals and overcome challenges.'}
                            sx={{ fontSize: '1rem', color: theme.palette.text.primary, fontWeight: '400' }} />

                        {/* ===== Support Areas ===== */}
                        <Customtext fieldName={'Feel free to reach out to us for:'}
                            sx={{ fontSize: '1rem', color: theme.palette.text.primary, mb: 1, fontWeight: '400' }} />

                        <List sx={{ listStyleType: "disc", pl: 4 }}>
                            {services.map((item, index) => (
                                <ListItem key={index} sx={{ display: "list-item", py: 0 }}>
                                    <ListItemText primary={item} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                    {/* TableData */}
                    <ReusableTable
                        columns={[
                            { key: "name", label: "Name of the Counsellor" },
                            { key: "email", label: "Email" }
                        ]}
                        data={counsellors}
                    />
                </CardComponent>
            }
        </>
    );
}

