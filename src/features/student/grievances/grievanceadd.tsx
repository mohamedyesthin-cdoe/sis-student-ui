import React, { useEffect } from "react";
import {
    Grid,
    Box,
    Button,
    Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import CardComponent from "../../../components/card/Card";
import { useAlert } from "../../../context/AlertContext";
import { ApiRoutes } from "../../../constants/ApiConstants";
import { apiRequest } from "../../../utils/ApiRequest";
import { useGlobalError } from "../../../context/ErrorContext";
import { useLoader } from "../../../context/LoaderContext";
import GrievanceSkeleton from "../../../components/card/skeletonloader/GrievanceSkeleton";
import CustomInputText from "../../../components/inputs/customtext/CustomInputText";
import Customtext from "../../../components/inputs/customtext/Customtext";
import { getValue } from "../../../utils/localStorageUtil";

// ================= TYPES =================

type GrievanceFormValues = {
    subject: string;
    description: string;
    grievanceFile?: File | null;
};

// ================= VALIDATION =================

const GrievanceSchema: Yup.ObjectSchema<GrievanceFormValues> =
    Yup.object({
        subject: Yup.string()
            .required("Subject is required")
            .max(200, "Subject must be less than 200 characters"),

        description: Yup.string()
            .required("Description is required")
            .max(2000, "Description must be less than 2000 characters"),

        grievanceFile: Yup.mixed<File>()
            .nullable()
            .notRequired()
            .test(
                "fileSize",
                "File size must be less than 10MB",
                (value) => {
                    if (!value) return true;
                    return value.size <= 10 * 1024 * 1024;
                }
            ),
    });

const GrievanceAddEdit: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { showAlert, showConfirm } = useAlert();
    const { clearError } = useGlobalError();
    const { loading } = useLoader();


    const defaultValues: GrievanceFormValues = {
        subject: "",
        description: "",
        grievanceFile: null,
    };

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isDirty },
    } = useForm<GrievanceFormValues>({
        resolver: yupResolver(GrievanceSchema),
        defaultValues,
    });

    const uploadedFile = watch("grievanceFile");
    const studentId = getValue("student_id") || "";
    // ================= FETCH BY ID =================

    useEffect(() => {
        if (!id) return;

        const fetchGrievance = async () => {
            try {
                const res = await apiRequest({
                    url: `${ApiRoutes.GRIEVANCEBYID}/${id}`,
                    method: "get",
                });

                const data = res

                reset({
                    subject: data.subject || "",
                    description: data.description || "",
                    grievanceFile: null,
                });
            } catch (err: any) {
                console.error(
                    "Failed to fetch grievance:",
                    err.response?.data || err.message
                );

                showAlert(
                    err.response?.data?.message ||
                    "Failed to fetch grievance details.",
                    "error"
                );
            }
        };

        fetchGrievance();
    }, [id, reset, showAlert]);

    // ================= BACK =================

    const handleBack = () => {
        if (isDirty) {
            showConfirm(
                "You have unsaved changes. Your changes will be lost if you continue.",
                () => window.history.back(),
                () => { }
            );
        } else {
            window.history.back();
        }
    };

    // ================= SUBMIT =================

    const onSubmit: SubmitHandler<GrievanceFormValues> = async (data) => {
        try {
            const payload = new FormData();

            payload.append("subject", data.subject);
            payload.append("description", data.description);

            payload.append("student_id", String(studentId));

            if (data.grievanceFile instanceof File) {
                payload.append("file", data.grievanceFile);
            }

            const apiUrl = id
                ? `${ApiRoutes.GRIEVANCEUPDATE}/${id}`
                : ApiRoutes.GRIEVANCEADD;

            const method = id ? "put" : "post";

            await apiRequest({
                url: apiUrl,
                method,
                data: payload,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            showAlert(
                id
                    ? "Grievance updated successfully!"
                    : "Grievance submitted successfully!",
                "success"
            );

            clearError();
            navigate("/grievances/list");

        } catch (err: any) {
            showAlert(
                err.response?.data?.message ||
                "Something went wrong. Please try again.",
                "error"
            );
        }
    };

    return (
        <>
            {loading ? (
                <GrievanceSkeleton />
            ) : (
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{
                        width: "100%",
                        maxWidth: {
                            xs: "350px",
                            sm: "900px",
                            md: "900px",
                        },
                        mx: "auto",
                        mt: 3,
                        mb: 5,
                    }}
                >
                    {/* Grievance Details */}

                    <CardComponent sx={{ p: 3 }}>
                        <Customtext
                            fieldName="Grievance Details"
                            sx={{ mb: 2 }}
                        />

                        <Grid container spacing={2}>
                            {/* Subject */}

                            <Grid size={{ xs: 12, md: 6 }} my={1}>
                                <Controller
                                    name="subject"
                                    control={control}
                                    render={({ field }) => (
                                        <CustomInputText
                                            label="Subject"
                                            field={field}
                                            error={!!errors.subject}
                                            helperText={
                                                errors.subject?.message
                                            }
                                        />
                                    )}
                                />
                            </Grid>

                            {/* Description */}

                            <Grid size={{ xs: 12 }} my={1}>
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <CustomInputText
                                            label="Description"
                                            multiline
                                            rows={4}
                                            field={field}
                                            error={!!errors.description}
                                            helperText={
                                                errors.description?.message
                                            }
                                        />
                                    )}
                                />
                            </Grid>

                            {/* File Upload */}

                            <Grid size={{ xs: 12, md: 6 }}>
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
                                            onClick={() =>
                                                document
                                                    .getElementById("file-input")
                                                    ?.click()
                                            }
                                        >
                                            {uploadedFile ? (
                                                <Box
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    gap={1}
                                                >
                                                    <Typography sx={{ fontSize: "0.9rem" }}>
                                                        {uploadedFile.name}
                                                    </Typography>

                                                    <Button
                                                        size="small"
                                                        color="error"
                                                        variant="outlined"
                                                        sx={{
                                                            minWidth: "auto",
                                                            p: "2px 6px",
                                                            fontSize: "0.7rem",
                                                            textTransform: "none",
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();

                                                            field.onChange(null);

                                                            setValue(
                                                                "grievanceFile",
                                                                null,
                                                                { shouldDirty: true }
                                                            );
                                                        }}
                                                    >
                                                        Remove
                                                    </Button>
                                                </Box>
                                            ) : (
                                                <Typography sx={{ fontSize: "0.9rem" }}>
                                                    Click or drag file to upload
                                                </Typography>
                                            )}

                                            <Typography
                                                variant="body2"
                                                color="textSecondary"
                                                sx={{ fontSize: "0.75rem" }}
                                            >
                                                Supported formats: All file types
                                            </Typography>

                                            <input
                                                id="file-input"
                                                type="file"
                                                hidden
                                                onChange={(e) => {
                                                    const file =
                                                        e.target.files?.[0] || null;

                                                    field.onChange(file);

                                                    setValue(
                                                        "grievanceFile",
                                                        file,
                                                        { shouldDirty: true }
                                                    );

                                                    // allow reselect same file
                                                    e.target.value = "";
                                                }}
                                            />
                                        </Box>
                                    )}
                                />

                                {errors.grievanceFile && (
                                    <Typography
                                        variant="caption"
                                        color="error"
                                    >
                                        {errors.grievanceFile.message}
                                    </Typography>
                                )}
                            </Grid>
                        </Grid>
                    </CardComponent>

                    {/* Buttons */}

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
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleBack}
                        >
                            Back
                        </Button>

                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => reset(defaultValues)}
                        >
                            Reset
                        </Button>

                        <Button
                            variant="contained"
                            color="secondary"
                            type="submit"
                        >
                            {id ? "Update" : "Submit"}
                        </Button>
                    </Box>
                </Box>
            )}
        </>
    );
};

export default GrievanceAddEdit;