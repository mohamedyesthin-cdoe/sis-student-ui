import { useEffect, useState } from "react";
import {
    Box,
    Grid,
    Button,
    CircularProgress
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
import CustomInputText from "../../../../components/inputs/customtext/CustomInputText";
import CustomSelect from "../../../../components/inputs/customtext/CustomSelect";
import CustomRadioInput from "../../../../components/inputs/customtext/CustomRadioInput";

interface FormValues {
    scheme_id: number | "";
    semester_id: number | "";
    exam_name: string;
    exam_type: string;
    month_year: string;
    is_published: boolean;
}

interface OptionType {
    label: string;
    value: number;
}

const defaultValues: FormValues = {
    scheme_id: "",
    semester_id: "",
    exam_name: "",
    exam_type: "",
    month_year: "",
    is_published: true,
};

const schema: Yup.ObjectSchema<FormValues> = Yup.object({
    scheme_id: Yup.number()
        .typeError("Scheme is required")
        .required("Scheme is required"),

    semester_id: Yup.number()
        .typeError("Semester is required")
        .required("Semester is required"),

    exam_name: Yup.string().required("Exam Name is required"),
    exam_type: Yup.string().required("Exam Type is required"),
    month_year: Yup.string().required("Month & Year is required"),
    is_published: Yup.boolean().required().default(true),
});

export default function ExamAdd() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { showAlert, showConfirm } = useAlert();
    const { loading } = useLoader();
    const { clearError } = useGlobalError();

    const [initialData, setInitialData] = useState<FormValues | null>(null);
    const [schemeList, setSchemeList] = useState<OptionType[]>([]);
    const [semesterList, setSemesterList] = useState<OptionType[]>([]);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<FormValues>({
        resolver: yupResolver(schema),
        defaultValues,
    });

  useEffect(() => {
    clearError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);


    // ===============================
    // Load Dropdown Data
    // ===============================
    useEffect(() => {
        const loadDropdowns = async () => {
            try {
                const schemeRes = await apiRequest({
                    url: ApiRoutes.SCHEMES,
                    method: "get",
                });

                const semesterRes = await apiRequest({
                    url: ApiRoutes.SEMESTERS,
                    method: "get",
                });

                const schemes = (schemeRes?.data || schemeRes).map((item: any) => ({
                    label: item.program_pattern,
                    value: item.id,
                }));

                const semesters = (semesterRes?.data || semesterRes).map((item: any) => ({
                    label: item.semester_name,
                    value: item.id,
                }));

                setSchemeList(schemes);
                setSemesterList(semesters);
            } catch (err) {
                showAlert("Failed to load dropdown data", "error");
            }
        };

        loadDropdowns();
    }, [showAlert]);

    // ===============================
    // Load Edit Data
    // ===============================
    useEffect(() => {
        if (!id) return;

        (async () => {
            try {
                const res = await apiRequest({
                    url: `${ApiRoutes.EXAMS}/${id}`,
                    method: "get",
                });

                const data = res?.data || res;

                const formattedData: FormValues = {
                    scheme_id: data.scheme_id ?? "",
                    semester_id: data.semester_id ?? "",
                    exam_name: data.exam_name ?? "",
                    exam_type: data.exam_type ?? "",
                    month_year: data.month_year ?? "",
                    is_published: data.is_published ?? true,
                };

                setInitialData(formattedData);
                reset(formattedData);
            } catch (err) {
                showAlert("Failed to load exam data", "error");
            }
        })();
    }, [id, reset, showAlert]);

    const handleBack = () => {
        if (isDirty) {
            showConfirm(
                "You have unsaved changes. Continue?",
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
            showAlert("Restored original data", "info");
        } else {
            reset(defaultValues);
            showAlert("Form cleared", "info");
        }
    };

    const onSubmit = async (formData: FormValues) => {
        try {
            const payload = {
                ...formData,
                scheme_id: Number(formData.scheme_id),
                semester_id: Number(formData.semester_id),
            };

            if (id) {
                await apiRequest({
                    url: `${ApiRoutes.EXAMS}/${id}`,
                    method: "put",
                    data: payload,
                });
                showAlert("Exam updated", "success");
            } else {
                await apiRequest({
                    url: ApiRoutes.EXAMS,
                    method: "post",
                    data: payload,
                });
                showAlert("Exam created", "success");
            }

            clearError();
            navigate("/exam/list");
        } catch (err: any) {
            console.error(err);
            showAlert(err?.detail || "Failed to save", "error");
        }
    };

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
                                        options={schemeList}
                                        error={!!errors.scheme_id}
                                        helperText={errors.scheme_id?.message}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Semester */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Controller
                                name="semester_id"
                                control={control}
                                render={({ field }) => (
                                    <CustomSelect
                                        label="Semester"
                                        field={field}
                                        options={semesterList}
                                        error={!!errors.semester_id}
                                        helperText={errors.semester_id?.message}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Exam Name */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Controller
                                name="exam_name"
                                control={control}
                                render={({ field }) => (
                                    <CustomInputText
                                        label="Exam Name"
                                        field={field}
                                        error={!!errors.exam_name}
                                        helperText={errors.exam_name?.message}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Exam Type */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Controller
                                name="exam_type"
                                control={control}
                                render={({ field }) => (
                                    <CustomInputText
                                        label="Exam Type"
                                        field={field}
                                        error={!!errors.exam_type}
                                        helperText={errors.exam_type?.message}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Month Year */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Controller
                                name="month_year"
                                control={control}
                                render={({ field }) => (
                                    <CustomInputText
                                        label="Month & Year (e.g. APR-2026)"
                                        field={field}
                                        error={!!errors.month_year}
                                        helperText={errors.month_year?.message}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Is Published */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Controller
                                name="is_published"
                                control={control}
                                render={({ field }) => (
                                    <CustomRadioInput
                                        label="Is Published"
                                        field={{
                                            ...field,
                                            value: field.value ? "true" : "false",
                                            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                                                field.onChange(e.target.value === "true"),
                                        }}
                                        options={[
                                            { label: "Yes", value: "true" },
                                            { label: "No", value: "false" },
                                        ]}
                                        error={!!errors.is_published}
                                        helperText={errors.is_published?.message}
                                    />
                                )}
                            />
                        </Grid>

                    </Grid>

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
                            ) : id ? "Update" : "Submit"}
                        </Button>
                    </Box>
                </CardComponent>
            </form>
        </Box>
    );
}
