import  { useEffect } from "react";
import { Grid, TextField, Box, Button, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import CardComponent from "../../../components/card/Card";
import { useAlert } from "../../../context/AlertContext";
import { ApiRoutes } from "../../../constants/ApiConstants";
import { apiRequest } from "../../../utils/ApiRequest";

// ✅ Validation schema
type ProgramFormValues = {
    subject: string;
    description: string;
    grievanceFile: File | null;
};

const ProgramSchema: Yup.ObjectSchema<ProgramFormValues> = Yup.object().shape({
    subject: Yup.string().required("Subject is required"),
    description: Yup.string().required("Description is required"),
    grievanceFile: Yup.mixed<File>()
        .nullable()
        .required("File is required"),
});

const Grievanceadd = () => {
    const { id } = useParams();
    const { showConfirm, showAlert } = useAlert();

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isDirty },
    } = useForm<ProgramFormValues>({
        resolver: yupResolver(ProgramSchema),
        defaultValues: {
            subject: "",
            description: "",
            grievanceFile: null,
        },
    });

    const uploadedFile = watch("grievanceFile");

    // Prefill if editing
    useEffect(() => {
        if (!id) return;

        const fetchProgram = async () => {
            try {
                const res = await apiRequest({
                    url: `${ApiRoutes.PROGRAMFETCH}/${id}`,
                    method: "get",
                });
                const data = res.data || res;

                reset({
                    subject: data.programe_code || id,
                    description: data.programe || "",
                    grievanceFile: null, // cannot prefill file
                });
            } catch (err: any) {
                console.error(err);
                showAlert(err.response?.data?.message || "Failed to fetch program details.", "error");
            }
        };

        fetchProgram();
    }, [id]);

    const handleBack = () => {
        if (isDirty) {
            showConfirm(
                "You have unsaved changes. Are you sure you want to leave?",
                () => window.history.back(),
                () => { }
            );
        } else {
            window.history.back();
        }
    };

    const onSubmit = async (data: ProgramFormValues) => {
        const payload = new FormData();
        payload.append("programe_code", data.subject);
        payload.append("programe", data.description);
        if (data.grievanceFile) payload.append("grievanceFile", data.grievanceFile);

        const apiUrl = id ? `${ApiRoutes.PROGRAMUPDATE}/${id}` : ApiRoutes.PROGRAMADD;
        const method = id ? "put" : "post";

        try {
            await apiRequest({ url: apiUrl, method, data: payload });
            showAlert(id ? "Program updated successfully!" : "Program added successfully!", "success");
        } catch (err: any) {
            console.error(err);
            showAlert(err.response?.data?.message || "Something went wrong. Please try again.", "error");
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ width: "100%", maxWidth: 1200, mx: "auto", mt: 3, mb: 5 }}
        >
            <CardComponent sx={{ p: 4 }}>
                <Grid container spacing={5}>
                    <Grid size={{ xs: 6, md: 6 }}>
                        <Controller
                            name="subject"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Subject"
                                    fullWidth
                                    size="small"
                                    disabled={!!id}
                                    error={!!errors.subject}
                                    helperText={errors.subject?.message as string}
                                />
                            )}
                        />
                    </Grid>

                    <Grid size={{ xs: 6, md: 6 }}>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Description"
                                    fullWidth
                                    size="small"
                                    error={!!errors.description}
                                    helperText={errors.description?.message as string}
                                />
                            )}
                        />
                    </Grid>

                    {/* Row 2: File Upload */}
                    <Grid size={{ xs: 6, md: 6 }}>
                        <Controller
                            name="grievanceFile"
                            control={control}
                            render={({ field }) => (
                                <Box
                                    sx={{
                                        border: "2px dashed #1976d2",
                                        borderRadius: 2,
                                        py: 2,
                                        px: 1.5,
                                        textAlign: "center",
                                        cursor: "pointer",
                                        "&:hover": { backgroundColor: "#f8f9fa" },
                                    }}
                                    onClick={() => document.getElementById("file-input")?.click()}
                                >
                                    {uploadedFile ? (
                                        <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                                            <Typography sx={{ fontSize: "0.9rem" }}>{uploadedFile.name}</Typography>
                                            <Button
                                                size="small"
                                                color="error"
                                                variant="outlined"
                                                sx={{ minWidth: "auto", p: "2px 6px", fontSize: "0.7rem", textTransform: "none" }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setValue("grievanceFile", null);
                                                }}
                                            >
                                                Remove
                                            </Button>
                                        </Box>
                                    ) : (
                                        <Typography sx={{ fontSize: "0.9rem" }}>Click or drag file to upload</Typography>
                                    )}

                                    <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.75rem" }}>
                                        Supported formats: .xlsx, .xls, .csv, .pdf
                                    </Typography>

                                    <input
                                        id="file-input"
                                        type="file"
                                        accept=".xlsx,.xls,.csv,.pdf"
                                        hidden
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                field.onChange(e.target.files[0]);
                                                e.target.value = ""; // allow re-upload same file
                                            }
                                        }}
                                    />
                                </Box>
                            )}
                        />
                        {errors.grievanceFile && (
                            <Typography variant="caption" color="error">
                                {errors.grievanceFile.message}
                            </Typography>
                        )}
                    </Grid>
                </Grid>

            </CardComponent>

            {/* Action Buttons */}
            <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
                <Button variant="contained" color="primary" onClick={handleBack}>
                    Back
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={() =>
                        reset({
                            subject: "",
                            description: "",
                            grievanceFile: null,
                        })
                    }
                >
                    Reset
                </Button>
                <Button variant="contained" color="secondary" type="submit">
                    {id ? "Update" : "Submit"}
                </Button>
            </Box>
        </Box>
    );
};

export default Grievanceadd;
