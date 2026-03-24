import { useEffect, useState } from "react";
import {
    Grid,
    Box,
    Button,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import CustomInputText from "../../../components/inputs/customtext/CustomInputText";
import { apiRequest } from "../../../utils/ApiRequest";
import { ApiRoutes } from "../../../constants/ApiConstants";
import { useAlert } from "../../../context/AlertContext";
import { useGlobalError } from "../../../context/ErrorContext";

// ---------------- TYPES ----------------
type Mark = {
    course_name: string;
    course_title: string; // 👈 add this
    final_mark: number;
};

type FormValues = {
    student_id: number;
    mark_list: Mark[];
    program_id: number;
};

// ---------------- VALIDATION ----------------
const schema: yup.ObjectSchema<FormValues> = yup.object({
    student_id: yup.number().required(),

    program_id: yup.number().required(),

    mark_list: yup
        .array()
        .of(
            yup.object({
                course_name: yup.string().required(),

                course_title: yup.string().required(),

                final_mark: yup
                    .number()
                    .typeError("Marks must be a number")
                    .min(0)
                    .max(100)
                    .required(),
            })
        )
        .required()
        .min(1),
});

// ---------------- COMPONENT ----------------
const StudentMarksEntry = () => {
    const [students, setStudents] = useState<any[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
    const [, setCourses] = useState<any[]>([]);
    const { showAlert } = useAlert();
    const { clearError } = useGlobalError();
    const [selectedStudent, setSelectedStudent] = useState<any>(null);

    const { control, handleSubmit, setValue, watch } = useForm<FormValues>({
        resolver: yupResolver(schema),
        defaultValues: {
            student_id: 0,
            program_id: 1500038,
            mark_list: [],
        },
    });

    const selectedProgramId = watch("program_id");

    // ---------------- STUDENTS ----------------
    useEffect(() => {
        const fetchStudents = async () => {
            const res = await apiRequest({ url: ApiRoutes.GETSTUDENTSLIST, method: "get" });
            const data = Array.isArray(res) ? res : res.data;

            // only include program_id 1500038 and ignore payments with 2026
            const cutoffDate = new Date("2025-10-16");

            const filtered = data.filter((s: any) => {
                // ✅ Only required program
                if (s.program_id !== 1500038) return false;

                // ✅ If no payments → allow
                if (!s.payments || s.payments.length === 0) return true;

                // ❌ Ignore if ANY payment is after cutoff
                return !s.payments.some((p: any) => {
                    const paymentDate = new Date(p.payment_date);
                    return paymentDate > cutoffDate;
                });
            });

            setStudents(filtered);
        };
        fetchStudents();
    }, []);

    // ---------------- FILTER STUDENTS ----------------
    useEffect(() => {
        if (!selectedProgramId) return;
        const filtered = students.filter((s) => s.program_id === selectedProgramId);
        setFilteredStudents(filtered);
        setSelectedStudent(null);
    }, [selectedProgramId, students]);

    // ---------------- COURSES ----------------
    useEffect(() => {
        const fetchCourses = async () => {
            const res = await apiRequest({ url: ApiRoutes.COURSES, method: "get" });
            const courseList = Array.isArray(res) ? res : res.data;
            setCourses(courseList);

            // set default mark list
            setValue(
                "mark_list",
                courseList.map((c: any) => ({
                    course_name: c.course_code,   // ✅ API expects this
                    course_title: c.course_title, // ✅ UI display
                    final_mark: 0,
                }))
            );
        };
        fetchCourses();
    }, [setValue]);

    // ---------------- SELECT STUDENT ----------------
    const handleStudentSelect = (student: any) => {
        setSelectedStudent(student);
        setValue("student_id", student.id);
    };

    // ---------------- SUBMIT ----------------
    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        console.log(data);

        try {
            const payload = {
                student_id: data.student_id,
                mark_list: data.mark_list.map((m) => ({
                    course_name: m.course_title, // ✅ correct
                    final_mark: m.final_mark,
                })),
            };
            await apiRequest({
                url: ApiRoutes.MARKSADD,
                method: "post",
                data: payload,
            });

            showAlert("Marks added successfully");
            clearError();

        } catch (err: any) {
            showAlert(
                err.response?.data?.message || "Something went wrong. Please try again.",
                "error"
            );
        }
    };
    // ---------------- UI ----------------
    return (
        <Box p={3}>
            <Grid container spacing={3}>
                {/* LEFT SIDE */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" mt={2} mb={2}>Students</Typography>
                        <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
                            {filteredStudents.map((student, index) => (
                                <Box
                                    key={student.id}
                                    onClick={() => handleStudentSelect(student)}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        p: 1.5,
                                        mb: 1,
                                        borderRadius: 2,
                                        cursor: "pointer",
                                        backgroundColor: selectedStudent?.id === student.id ? "#105c8e" : "#f5f5f5",
                                        color: selectedStudent?.id === student.id ? "#fff" : "#000",
                                    }}
                                >
                                    <Box width={30}>{index + 1}.</Box>
                                    <Box>{student.first_name} {student.last_name}</Box>
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Grid>

                {/* RIGHT SIDE */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" mb={2}>
                            {selectedStudent
                                ? `Marks Entry - ${selectedStudent.first_name} ${selectedStudent.last_name}`
                                : "Select a student"}
                        </Typography>

                        {selectedStudent && (
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>S.No</TableCell>
                                                <TableCell>Course</TableCell>
                                                <TableCell>Marks</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {watch("mark_list")?.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>{item.course_title}</TableCell>
                                                    <TableCell>
                                                        <Controller
                                                            name={`mark_list.${index}.final_mark`}
                                                            control={control}
                                                            render={({ field }) => (
                                                                <CustomInputText field={field} type="number" label="" />
                                                            )}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                <Box display="flex" justifyContent="flex-end" mt={2}>
                                    <Button type="submit" variant="contained">Submit Marks</Button>
                                </Box>
                            </form>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default StudentMarksEntry;