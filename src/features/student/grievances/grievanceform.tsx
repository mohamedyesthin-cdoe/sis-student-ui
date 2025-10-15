import { useRef } from "react";
import {
    Box,
    Typography,
    Grid,
    TextField,
    Button,
    Divider,
    Paper,
} from "@mui/material";

const StudentGrievanceForm = () => {
    const formRef = useRef<HTMLDivElement>(null);

    // ✅ PRINT (in same tab)
    const handlePrint = () => {
        if (!formRef.current) return;
        const printContents = formRef.current.innerHTML;
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); // reload restores React structure
    };

    return (
        <Box className="p-6 flex flex-col items-center bg-gray-50 min-h-screen">
            {/* FORM CONTENT */}
            <Paper
                ref={formRef}
                elevation={3}
                className="w-full p-8 bg-white border border-gray-300"
            >
                <Typography variant="h6" align="center" fontWeight="bold">
                    SRI RAMACHANDRA INSTITUTE OF HIGHER EDUCATION AND RESEARCH
                </Typography>
                <Typography variant="subtitle1" align="center" fontWeight="bold">
                    (Deemed to be University)
                </Typography>
                <Typography
                    variant="subtitle1"
                    align="center"
                    fontWeight="bold"
                    className="mt-4 underline"
                >
                    STUDENT GRIEVANCE FORM
                </Typography>

                <Typography className="text-sm italic mt-2 text-gray-700">
                    This form may be completed by the aggrieved student and given to the
                    appropriate HOD/Principal (OR) dropped in any of the grievance boxes
                    located on campus.
                </Typography>

                {/* Fields */}
                <Grid container spacing={2} className="mt-4">
                    <Grid size={{ xs: 6 }}>
                        <TextField fullWidth label="Name" variant="standard" />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                        <TextField fullWidth label="Department" variant="standard" />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <TextField fullWidth label="Position Title" variant="standard" />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                        <TextField fullWidth label="Telephone Number" variant="standard" />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                        <TextField fullWidth label="Email Address" variant="standard" />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Is your grievance related to Faculty/staff/student?"
                            variant="standard"
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="What date/s did the actions occur?"
                            variant="standard"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Describe the grievance (Please be specific, provide details)"
                            variant="outlined"
                            multiline
                            rows={5}
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <Box className="flex justify-between mt-4">
                            <TextField label="Student Name" variant="standard" className="w-1/3" />
                            <TextField label="Signature" variant="standard" className="w-1/3" />
                            <TextField label="Date" variant="standard" className="w-1/3" />
                        </Box>
                    </Grid>
                </Grid>

                <Divider className="my-6" />
                <Typography variant="subtitle2" fontWeight="bold" className="underline mb-2">
                    For Office Use Only
                </Typography>
                <Typography className="text-sm italic mb-3">
                    This section should be completed by the HOD/Grievance Committee Member
                    who receives the form.
                </Typography>
                <Box className="flex justify-between">
                    <TextField
                        label="Signature of HOD / Grievance Committee Member"
                        variant="standard"
                        className="w-[70%]"
                    />
                    <TextField label="Date Form Received" variant="standard" />
                </Box>
                <TextField
                    label="Actions / Steps Taken"
                    variant="outlined"
                    multiline
                    rows={3}
                    fullWidth
                    className="mt-4"
                />
                <Box className="flex justify-end mt-6">
                    <Typography variant="body2">
                        Signature of Chairman – <b>Grievance Committee</b>
                    </Typography>
                </Box>
                <Typography
                    variant="caption"
                    display="block"
                    align="center"
                    className="mt-4 text-gray-600 italic"
                >
                    Note: The collected grievances are maintained in sealed envelopes with
                    strict confidentiality.
                </Typography>
            </Paper>

            {/* Buttons */}
            <Box className="mt-6 flex gap-4">
                <Button variant="contained" color="primary" onClick={handlePrint}>
                    Print Form
                </Button>
            </Box>
        </Box>
    );
};

export default StudentGrievanceForm;
