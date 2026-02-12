import  { useEffect, useState } from "react";
import {
  Box,
  Card,
  Grid,
  MenuItem,
  Select,
  Typography,
  Button,
  FormControl,
  InputLabel,
  TextField,
  Stack,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { motion } from "framer-motion";
import TablePagination from "../../../../components/tablepagination/tablepagination";
import { useAlert } from "../../../../context/AlertContext";
import { useGlobalError } from "../../../../context/ErrorContext";
import apiClient from "../../../../services/ApiClient";
import { ApiRoutes } from "../../../../constants/ApiConstants";

/* ---------------- TYPES ---------------- */
interface Student {
  reg_no: string;
  name: string;
}

interface Program {
  id: number;
  programe: string;
  short_name: string | null;
}

/* ---------------- MOCK DATA ---------------- */
const YEARS = ["2023", "2024", "2025", "2026"];
const BATCHES = [
  { label: "January", value: "JAN" },
  { label: "June", value: "JUNE" },
];
const SEMESTERS = Array.from({ length: 8 }, (_, i) => `Semester ${i + 1}`);
const COURSES = ["Maths", "Physics", "Chemistry", "Computer Science"];

const STUDENTS: Student[] = [
  { reg_no: "REG2023001", name: "Arun Kumar" },
  { reg_no: "REG2023002", name: "Suresh M" },
  { reg_no: "REG2023003", name: "Divya R" },
  { reg_no: "REG2023004", name: "Rahul P" },
  { reg_no: "REG2023005", name: "Meena K" },
];

/* ---------------- COMPONENT ---------------- */
export default function MarksEntryScreen() {
  const { clearError } = useGlobalError();
  const { showConfirm } = useAlert();

  const [programs, setPrograms] = useState<Program[]>([]);
  const [viewClicked, setViewClicked] = useState(false);

  const [filters, setFilters] = useState({
    program: "",
    year: "",
    batch: "",
    semester: "",
    course: "",
  });

  const [marksData, setMarksData] = useState<
    Record<string, { marks: string; attendance: string }>
  >({});

  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  /* ---------------- PAGINATION ---------------- */
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  /* ---------------- API ---------------- */
  useEffect(() => {
    clearError();
    apiClient
      .get(ApiRoutes.GETPROGRAMLIST)
      .then((res) => setPrograms(res.data))
      .catch((err) => console.error(err));
  }, []);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleInputChange = (
    regNo: string,
    field: "marks" | "attendance",
    value: string
  ) => {
    if (isSaved || isSubmitted) return;

    setMarksData((prev) => ({
      ...prev,
      [regNo]: { ...prev[regNo], [field]: value },
    }));
  };

  const handleSave = () => setIsSaved(true);

  const handleEdit = () => {
    if (!isSubmitted) setIsSaved(false);
  };

  const handlePreview = () => {
    console.log("Preview:", marksData);
  };

  const handleSubmit = () => {
    showConfirm(
      "Once submitted, marks cannot be edited. Continue?",
      () => {
        setIsSubmitted(true);
        setIsSaved(true);
      }
    );
  };

  const isViewEnabled = Object.values(filters).every(Boolean);

  const paginatedStudents = STUDENTS.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  /* ---------------- UI ---------------- */
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f4f6f8", p: 4 }}>
      <Box sx={{ maxWidth: 1400, mx: "auto" }}>
        {/* FILTER CARD */}
        <Card
          component={motion.div}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          sx={{ p: 3, borderRadius: 3 }}
        >
          <Typography variant="h6" mb={2}>
            Program Filter
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Program</InputLabel>
                <Select
                  value={filters.program}
                  label="Program"
                  onChange={(e) =>
                    handleChange("program", e.target.value)
                  }
                >
                  {programs.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.short_name ?? p.programe}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Year</InputLabel>
                <Select
                  value={filters.year}
                  label="Year"
                  onChange={(e) => handleChange("year", e.target.value)}
                >
                  {YEARS.map((y) => (
                    <MenuItem key={y} value={y}>
                      {y}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Batch</InputLabel>
                <Select
                  value={filters.batch}
                  label="Batch"
                  onChange={(e) => handleChange("batch", e.target.value)}
                >
                  {BATCHES.map((b) => (
                    <MenuItem key={b.value} value={b.value}>
                      {b.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Semester</InputLabel>
                <Select
                  value={filters.semester}
                  label="Semester"
                  onChange={(e) =>
                    handleChange("semester", e.target.value)
                  }
                >
                  {SEMESTERS.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Course</InputLabel>
                <Select
                  value={filters.course}
                  label="Course"
                  onChange={(e) =>
                    handleChange("course", e.target.value)
                  }
                >
                  {COURSES.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }} display="flex" alignItems="center">
              <Button
                variant="contained"
                disabled={!isViewEnabled}
                onClick={() => setViewClicked(true)}
              >
                View Students
              </Button>
            </Grid>
          </Grid>
        </Card>

        {/* TABLE */}
        {viewClicked && (
          <Card sx={{ mt: 4, p: 3 }}>
            <Typography variant="h6" mb={2}>
              Student Mark Entry
            </Typography>

            <Alert severity="info" sx={{ mb: 2 }}>
              Max Marks: <b>50</b> | Attendance: <b>100</b>
            </Alert>

            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Reg No</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Marks</TableCell>
                    <TableCell>Attendance</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paginatedStudents.map((s) => {
                    const marks =
                      Number(marksData[s.reg_no]?.marks) || 0;

                    return (
                      <TableRow key={s.reg_no}>
                        <TableCell>{s.reg_no}</TableCell>
                        <TableCell>{s.name}</TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="number"
                            disabled={isSaved || isSubmitted}
                            value={marksData[s.reg_no]?.marks || ""}
                            onChange={(e) =>
                              handleInputChange(
                                s.reg_no,
                                "marks",
                                e.target.value
                              )
                            }
                            error={marks > 0 && marks < 30}
                            helperText={
                              marks > 0 && marks < 30
                                ? "Below 30 is FAIL"
                                : ""
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="number"
                            disabled={isSaved || isSubmitted}
                            value={
                              marksData[s.reg_no]?.attendance || ""
                            }
                            onChange={(e) =>
                              handleInputChange(
                                s.reg_no,
                                "attendance",
                                e.target.value
                              )
                            }
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              <TablePagination
                page={page}
                rowsPerPage={rowsPerPage}
                totalCount={STUDENTS.length}
                onPageChange={setPage}
                sx={{ p: 2,pt:0 }}
              />
            </TableContainer>

            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
              <Button variant="outlined" onClick={handlePreview}>
                Preview
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={isSubmitted}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                onClick={handleEdit}
                disabled={isSubmitted}
              >
                Edit
              </Button>
              <Button
                color="error"
                variant="contained"
                onClick={handleSubmit}
                disabled={isSubmitted}
              >
                Submit
              </Button>
            </Stack>
          </Card>
        )}
      </Box>
    </Box>
  );
}
