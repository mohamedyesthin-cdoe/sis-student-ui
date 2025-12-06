import { useEffect, useState } from "react";
import {
    Box,
    Grid,
    Button,
    CircularProgress,
} from "@mui/material";

import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import { useNavigate, useParams } from "react-router-dom";

import { useAlert } from "../../../../context/AlertContext";
import { useLoader } from "../../../../context/LoaderContext";
import { useGlobalError } from "../../../../context/ErrorContext";
import { apiRequest } from "../../../../utils/ApiRequest";
import { ApiRoutes } from "../../../../constants/ApiConstants";

import CustomInputText from "../../../../components/inputs/customtext/CustomInputText";
import CardComponent from "../../../../components/card/Card";
import ProgramFeeSkeleton from "../../../../components/card/skeletonloader/ProgramFeeSkeleton";
import CustomAutoComplete from "../../../../components/inputs/customtext/CustomAutoComplete";
import AddButtonWithDialog from "./AddButtonWithDialog";

// Dropdown options
const semesterOptions = ["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6", "Semester 7", "Semester 8"];

const defaultValues = {
    course_code_id: "",
    course_title_id: "",
    course_category_id: "",
    semester: "",
    credits: "",
    tutorial_hours: 0,
    lecture_hours: 0,
    practical_hours: 0,
    total_hours: 0,
    cia: 0,
    esa: 0,
    total_marks: 0,
};

const schema = Yup.object().shape({
    course_code_id: Yup.string().required("Course code required"),
    course_title_id: Yup.string().required("Course title required"),
    course_category_id: Yup.string().required("Category required"),
    semester: Yup.string().required("Semester required"),
    credits: Yup.number().min(0).required("Required"),
    tutorial_hours: Yup.number().min(0).required("Required"),
    lecture_hours: Yup.number().min(0).required("Required"),
    practical_hours: Yup.number().min(0).required("Required"),
    total_hours: Yup.number().min(0).required("Required"),
    cia: Yup.number().min(0).required("Required"),
    esa: Yup.number().min(0).required("Required"),
    total_marks: Yup.number().min(0).required("Required"),
});

export default function SyllabusAdd() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { showAlert, showConfirm } = useAlert();
    const { loading } = useLoader();
    const { error } = useGlobalError();
    const [initialData, setInitialData] = useState(null);

    // Dynamic dropdowns
    const [courseCodeOptions, setCourseCodeOptions] = useState([]);
    const [courseTitleOptions, setCourseTitleOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isDirty },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues,
    });

    const credits = useWatch({ control, name: "credits" });
    const cia = useWatch({ control, name: "cia" });
    const esa = useWatch({ control, name: "esa" });

    // Update total hours
    useEffect(() => {
        const val = Number(credits) || 0;
        setValue("total_hours", val * 30);
    }, [credits, setValue]);

    // Update total marks
    useEffect(() => {
        const total = (Number(cia) || 0) + (Number(esa) || 0);
        setValue("total_marks", total);
    }, [cia, esa, setValue]);

    // Load data if editing
    useEffect(() => {
        if (!id) return;

        (async () => {
            try {
                const res = await apiRequest({
                    url: `${ApiRoutes.SYLLABUSADD}/${id}`,
                    method: "get",
                });

                const data = res?.data || res;
                setInitialData(data);
                reset(data);
            } catch (err) {
                console.error(err);
                showAlert("Failed to load syllabus data", "error");
            }
        })();
    }, [id, reset, showAlert]);

    // Fetch dropdown options from API
    useEffect(() => {
        const fetchDropdowns = async () => {
            try {
                // Fetch all three lists sequentially (or can use Promise.all)
                const codeRes = await apiRequest({ url: ApiRoutes.COURSECODELIST, method: "get" });
                setCourseCodeOptions((codeRes[0].data || []).map(item => ({
                    value: item.id || item.code,
                    label: item.code,
                })));

                const titleRes = await apiRequest({ url: ApiRoutes.COURSETITLELIST, method: "get" });
                setCourseTitleOptions((titleRes[0].data || []).map(item => ({
                    value: item.id || item.title,
                    label: item.title,
                })));

                const catRes = await apiRequest({ url: ApiRoutes.COURSECATEGORYLIST, method: "get" });
                console.log(catRes[0].data);

                setCategoryOptions((catRes[0].data || []).map(item => ({
                    value: item.id || item.name,
                    label: item.name,
                })));
            } catch (err) {
                console.error(err);
                showAlert("Failed to load dropdown options", "error");
            }
        };

        fetchDropdowns();
    }, []); // ✅ Empty dependency array → runs only once on mount


    const handleBack = () => {
        if (isDirty) {
            showConfirm(
                "You have unsaved changes. Your changes will be lost if you continue.",
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

    const onSubmit = async (formData) => {
        try {
            const payload = {
                ...formData,
                course_code_id: Number(formData.course_code_id),
                course_category_id: Number(formData.course_category_id),
                course_title_id: Number(formData.course_title_id),

                semester: formData.semester, // string

                credits: Number(formData.credits),
                tutorial_hours: Number(formData.tutorial_hours),
                lecture_hours: Number(formData.lecture_hours),
                practical_hours: Number(formData.practical_hours),
                total_hours: Number(formData.total_hours),

                cia: Number(formData.cia),
                esa: Number(formData.esa),
                total_marks: Number(formData.total_marks),
            };

            if (id) {
                await apiRequest({
                    url: `${ApiRoutes.SYLLABUSADD}/${id}`,
                    method: "put",
                    data: payload,
                });
                showAlert("Syllabus updated", "success");
            } else {
                await apiRequest({
                    url: ApiRoutes.SYLLABUSADD,
                    method: "post",
                    data: payload,
                });
                showAlert("Syllabus created", "success");
            }

        } catch (err) {
            console.error(err);
            showAlert("Save failed", "error");
        }
    };


    return (
        <>
            {error.type === "NONE" &&
                (loading ? (
                    <ProgramFeeSkeleton />
                ) : (
                    <Box sx={{ p: { xs: 2, md: 4 } }}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <CardComponent sx={{ p: 4 }}>
                                <Grid container spacing={3}>
                                    {/* COURSE CODE */}
                                    <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex", alignItems: "center" }}>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Controller
                                                name="course_code_id"
                                                control={control}
                                                render={({ field }) => (
                                                    <CustomAutoComplete
                                                        label="Course Code"
                                                        field={field}
                                                        options={courseCodeOptions}
                                                        error={errors.course_code_id}
                                                        helperText={errors.course_code_id?.message}
                                                    />
                                                )}
                                            />
                                        </Box>
                                        <AddButtonWithDialog
                                            label="Course Code"
                                            onAdd={async (newValue) => {
                                                const res = await apiRequest({
                                                    url: ApiRoutes.COURSECODEADD,
                                                    method: "post",
                                                    data: { code: newValue },
                                                });

                                                const saved = res?.data || res;

                                                // Refresh list from API
                                                const list = await apiRequest({ url: ApiRoutes.COURSECODELIST, method: "get" });
                                                setCourseCodeOptions((list[0].data || []).map(item => ({
                                                    value: item.id,
                                                    label: item.code,
                                                })));

                                                setValue("course_code_id", saved.id); // select added value
                                            }}
                                        />

                                    </Grid>

                                    {/* COURSE TITLE */}
                                    <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex", alignItems: "center" }}>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Controller
                                                name="course_title_id"
                                                control={control}
                                                render={({ field }) => (
                                                    <CustomAutoComplete
                                                        label="Course Title"
                                                        field={field}
                                                        options={courseTitleOptions}
                                                        error={errors.course_title_id}
                                                        helperText={errors.course_title_id?.message}
                                                    />
                                                )}
                                            />
                                        </Box>
                                        <AddButtonWithDialog
                                            label="Course Title"
                                            onAdd={async (newValue) => {
                                                const res = await apiRequest({
                                                    url: ApiRoutes.COURSETITLEADD,
                                                    method: "post",
                                                    data: { title: newValue },
                                                });

                                                const saved = res?.data || res;

                                                const list = await apiRequest({ url: ApiRoutes.COURSETITLELIST, method: "get" });
                                                setCourseTitleOptions((list[0].data || []).map(item => ({
                                                    value: item.id,
                                                    label: item.title,
                                                })));

                                                setValue("course_title_id", saved.id);
                                            }}
                                        />

                                    </Grid>

                                    {/* CATEGORY */}
                                    <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex", alignItems: "center" }}>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Controller
                                                name="course_category_id"
                                                control={control}
                                                render={({ field }) => (
                                                    <CustomAutoComplete
                                                        label="Category"
                                                        field={field}
                                                        options={categoryOptions}
                                                        error={errors.course_category_id}
                                                        helperText={errors.course_category_id?.message}
                                                    />
                                                )}
                                            />
                                        </Box>
                                        <AddButtonWithDialog
                                            label="Category"
                                            onAdd={async (newValue) => {

                                                const res = await apiRequest({
                                                    url: ApiRoutes.COURSECATEGORYADD,
                                                    method: "post",
                                                    data: { name: newValue },
                                                });

                                                const saved = res?.data || res;

                                                const list = await apiRequest({ url: ApiRoutes.COURSECATEGORYLIST, method: "get" });
                                                setCategoryOptions((list[0].data || []).map(item => ({
                                                    value: item.id,
                                                    label: item.name,
                                                })));

                                                setValue("course_category_id", saved.id);
                                            }}
                                        />

                                    </Grid>

                                    {/* SEMESTER */}
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Controller
                                            name="semester"
                                            control={control}
                                            render={({ field }) => (
                                                <CustomAutoComplete
                                                    label="Semester"
                                                    field={field}
                                                    options={semesterOptions.map(s => ({ value: s, label: s }))}
                                                    error={errors.semester}
                                                    helperText={errors.semester?.message}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    {/* CREDITS */}
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Controller
                                            name="credits"
                                            control={control}
                                            render={({ field }) => (
                                                <CustomInputText
                                                    label="Credits"
                                                    field={field}
                                                    type="number"
                                                    error={!!errors.credits}
                                                    helperText={errors.credits?.message}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    {/* HOURS */}
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Controller
                                            name="tutorial_hours"
                                            control={control}
                                            render={({ field }) => (
                                                <CustomInputText
                                                    label="Tutorial Hours"
                                                    field={field}
                                                    type="number"
                                                    error={!!errors.tutorial_hours}
                                                    helperText={errors.tutorial_hours?.message}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Controller
                                            name="lecture_hours"
                                            control={control}
                                            render={({ field }) => (
                                                <CustomInputText
                                                    label="Lecture Hours"
                                                    field={field}
                                                    type="number"
                                                    error={!!errors.lecture_hours}
                                                    helperText={errors.lecture_hours?.message}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Controller
                                            name="practical_hours"
                                            control={control}
                                            render={({ field }) => (
                                                <CustomInputText
                                                    label="Practical Hours"
                                                    field={field}
                                                    type="number"
                                                    error={!!errors.practical_hours}
                                                    helperText={errors.practical_hours?.message}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    {/* TOTAL HOURS */}
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Controller
                                            name="total_hours"
                                            control={control}
                                            render={({ field }) => (
                                                <CustomInputText
                                                    label="Total Hours (Auto)"
                                                    field={field}
                                                    type="number"
                                                    disabled
                                                    helperText="Calculated: Credits × 30"
                                                    error={!!errors.total_hours}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    {/* CIA */}
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Controller
                                            name="cia"
                                            control={control}
                                            render={({ field }) => (
                                                <CustomInputText
                                                    label="CIA"
                                                    field={field}
                                                    type="number"
                                                    error={!!errors.cia}
                                                    helperText={errors.cia?.message}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    {/* ESA */}
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Controller
                                            name="esa"
                                            control={control}
                                            render={({ field }) => (
                                                <CustomInputText
                                                    label="ESA"
                                                    field={field}
                                                    type="number"
                                                    error={!!errors.esa}
                                                    helperText={errors.esa?.message}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    {/* TOTAL MARKS */}
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Controller
                                            name="total_marks"
                                            control={control}
                                            render={({ field }) => (
                                                <CustomInputText
                                                    label="Total Marks (Auto)"
                                                    field={field}
                                                    type="number"
                                                    disabled
                                                    helperText="Calculated: CIA + ESA"
                                                    error={!!errors.total_marks}
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>

                                {/* Buttons */}
                                <Box sx={{ display: "flex", gap: 2, mt: 4, justifyContent: "flex-end" }}>
                                    <Button variant="contained" onClick={handleBack}>
                                        Back
                                    </Button>

                                    <Button variant="outlined" color="error" onClick={handleReset}>
                                        Reset
                                    </Button>

                                    <Button type="submit" variant="contained" color="secondary" disabled={loading}>
                                        {loading ? <CircularProgress size={20} /> : id ? "Update" : "Submit"}
                                    </Button>
                                </Box>
                            </CardComponent>
                        </form>
                    </Box>
                ))}
        </>
    );
}
