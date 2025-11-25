import { Box } from "@mui/material";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import Customtext from "../../customtext/Customtext";
import theme from "../../../styles/theme";

export function ComingSoonUI() {
    return (
        <Box
            sx={{
                textAlign: "center",
                py: 5,
                animation: "pulse 2s infinite",
                "@keyframes pulse": {
                    "0%": { transform: "scale(1)" },
                    "50%": { transform: "scale(1.05)" },
                    "100%": { transform: "scale(1)" },
                },
            }}
        >
            <AccessTimeFilledIcon
                sx={{ fontSize: 80, color: "grey.600", mb: 2 }}
            />

            <Customtext
                fieldName="Coming Soon"
                sx={{
                    fontSize: { xs: "1rem", md: "1.4rem" },
                    fontWeight: 600,
                }}
            />
            <Customtext
                fieldName="We’re working hard to bring this feature to you!"
                sx={{
                    fontSize: { xs: "0.8rem", md: "1rem" },
                    fontWeight: 400,
                    color: theme.palette.text.secondary
                }}
            />
        </Box>
    );
}

