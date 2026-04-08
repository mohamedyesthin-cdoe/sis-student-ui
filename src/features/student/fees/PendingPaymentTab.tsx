import { Typography, Button, Stack, Box } from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import CardComponent from "../../../components/card/Card";
import { handlePaymentRedirect } from "../../../utils/paymentHandler";

interface Props {
    data: any;
}

export default function PendingPaymentTab({ data }: Props) {
    return (
        <CardComponent
            sx={{
                maxWidth: 600,
                mx: "auto",
                mt: 4,
                p: 4,
            }}
        >
            {/* Header Section - Left Side */}
            <Stack
                direction="row"
                alignItems="center"
                spacing={1.5}
                sx={{ mb: 3 }}
            >
                <PaymentIcon
                    sx={{
                        fontSize: 32,
                        color: "error.main",
                    }}
                />

                <Typography
                    variant="h6"
                    fontWeight={700}
                >
                    Payment Due
                </Typography>
            </Stack>

            {/* Semester and Amount in One Line */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                }}
            >
                <Typography
                    variant="h5"
                    fontWeight={800}
                    color="error.main"
                >
                    ₹{data?.pending_payment_amount} - {data?.semester || "1"}
                </Typography>
            </Box>

            {/* Description */}
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1 }}
            >
               Please complete your payment to continue services.
            </Typography>

            {/* Button */}
            <Button
                variant="contained"
                color="error"
                size="large"
                startIcon={<PaymentIcon />}
                sx={{
                    mt: 4,
                    px: 4,
                    py: 1.2,
                    fontWeight: 700,
                    borderRadius: 2,
                }}
                onClick={() =>
                    handlePaymentRedirect(
                        data?.pending_payment_link
                    )
                }
            >
                Pay Now
            </Button>
        </CardComponent>
    );
}