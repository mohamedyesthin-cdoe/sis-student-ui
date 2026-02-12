import { useEffect, useState } from "react";
import {
    Box,
    Grid,
    Button,
    CircularProgress,
} from "@mui/material";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import { useNavigate, useParams } from "react-router-dom";
import { useAlert } from "../../../../context/AlertContext";
import { useLoader } from "../../../../context/LoaderContext";
import { useGlobalError } from "../../../../context/ErrorContext";
import { apiRequest } from "../../../../utils/ApiRequest";
import { ApiRoutes } from "../../../../constants/ApiConstants";

import CardComponent from "../../../../components/card/Card";
import CustomSelect from "../../../../components/inputs/customtext/CustomSelect";
import CustomInputText from "../../../../components/inputs/customtext/CustomInputText";
import CustomNumberInput from "../../../../components/inputs/customtext/CustomNumberInput";
import apiClient from "../../../../services/ApiClient";

/* -------------------------------- types -------------------------------- */

interface FormValues {
    scheme_id: string;
    semester_no: number;
    semester_name: string;
}

const defaultValues: FormValues = {
    scheme_id: "",
    semester_no: 0,
    semester_name: "",
};

/* ----------------------------- validation ------------------------------- */

const schema = Yup.object().shape({
    scheme_id: Yup.string().required("Scheme is required"),
    semester_no: Yup.number()
        .min(1, "Semester No must be greater than 0")
        .required("Semester No is required"),
    semester_name: Yup.string().required("Semester Name is required"),
});

/* ----------------------------- component -------------------------------- */

export default function SemestersAdd() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { showAlert, showConfirm } = useAlert();
    const { loading } = useLoader();
    const { clearError } = useGlobalError();

    const [initialData, setInitialData] = useState<FormValues | null>(null);
    const [schemes, setSchemes] = useState<
        { value: string; label: string }[]
    >([]);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<FormValues>({
        resolver: yupResolver(schema),
        defaultValues,
    });

    /* -------------------------- fetch schemes ------------------------------ */

    useEffect(() => {
        clearError();

        const fetchSchemes = async () => {
            try {
                const res = await apiClient.get(ApiRoutes.SCHEMES);

                const mappedSchemes = (res.data || []).map((s: any) => ({
                    value: String(s.id),
                    label: `${s.program_pattern} - ${s.program_pattern_no} (${s.regulation_year})`,
                }));

                setSchemes(mappedSchemes);
            } catch (error) {
                showAlert("Failed to load schemes list", "error");
            }
        };

        fetchSchemes();
    }, []);

    /* --------------------------- edit mode -------------------------------- */

    useEffect(() => {
        if (!id || schemes.length === 0) return;

        const semesterId = Number(id);
        if (!semesterId) return;

        const fetchSemester = async () => {
            try {
                const res = await apiClient.get(
                    `${ApiRoutes.SEMESTERS}/${semesterId}`
                );

                const data = res.data;

                const formattedData: FormValues = {
                    scheme_id: String(data.scheme_id),
                    semester_no: data.semester_no,
                    semester_name: data.semester_name,
                };

                setInitialData(formattedData);
                reset(formattedData);
            } catch (error: any) {
                console.error(error);
                showAlert(
                    error?.response?.data?.detail ||
                    "Failed to load semester details",
                    "error"
                );
            }
        };

        fetchSemester();
    }, [id, schemes.length]);

    /* ----------------------------- handlers -------------------------------- */

    const handleBack = () => {
        if (isDirty) {
            showConfirm(
                "You have unsaved changes. Your changes will be lost.",
                () => navigate(-1),
                () => { }
            );
        } else {
            navigate(-1);
        }
    };

    const handleReset = () => {
        if (id && initialData) {
            reset(initialData);
            showAlert("Original values restored", "info");
        } else {
            reset(defaultValues);
            showAlert("Form cleared", "info");
        }
    };

    const onSubmit = async (data: FormValues) => {
        try {
            const payload = {
                scheme_id: Number(data.scheme_id),
                semester_no: Number(data.semester_no),
                semester_name: data.semester_name,
            };

            if (id) {
                await apiRequest({
                    url: `${ApiRoutes.SEMESTERS}/${Number(id)}`,
                    method: "put",
                    data: payload,
                });
                showAlert("Semester updated successfully", "success");
            } else {
                await apiRequest({
                    url: ApiRoutes.SEMESTERS,
                    method: "post",
                    data: payload,
                });
                showAlert("Semester created successfully", "success");
            }

            navigate("/semesters/list");
        } catch (error: any) {
            showAlert(error?.detail || "Failed to save semester", "error");
        }
    };

    /* ------------------------------- UI ----------------------------------- */

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardComponent sx={{ p: 4 }}>
                    <Grid container spacing={3}>

                        {/* Scheme */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Controller
                                name="scheme_id"
                                control={control}
                                render={({ field }) => (
                                    <CustomSelect
                                        label="Scheme"
                                        field={field}
                                        options={schemes}
                                        error={errors.scheme_id}
                                        helperText={errors.scheme_id?.message}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Semester No */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Controller
                                name="semester_no"
                                control={control}
                                render={({ field }) => (
                                    <CustomNumberInput
                                        label="Semester No"
                                        value={field.value ?? ""}
                                        error={!!errors.semester_no}
                                        helperText={errors.semester_no?.message}
                                        onChange={(val) => field.onChange(val)}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Semester Name */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Controller
                                name="semester_name"
                                control={control}
                                render={({ field }) => (
                                    <CustomInputText
                                        label="Semester Name"
                                        field={field}
                                        error={!!errors.semester_name}
                                        helperText={errors.semester_name?.message}
                                    />
                                )}
                            />
                        </Grid>

                    </Grid>

                    {/* Actions */}
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            mt: 4,
                            justifyContent: "flex-end",
                        }}
                    >
                        <Button variant="contained" onClick={handleBack}>
                            Back
                        </Button>

                        <Button variant="outlined" color="error" onClick={handleReset}>
                            Reset
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            color="secondary"
                            disabled={loading}
                        >
                            {loading ? (
                                <CircularProgress size={20} />
                            ) : id ? (
                                "Update"
                            ) : (
                                "Submit"
                            )}
                        </Button>
                    </Box>
                </CardComponent>
            </form>
        </Box>
    );
}
