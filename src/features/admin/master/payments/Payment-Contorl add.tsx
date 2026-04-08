import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Button,
} from "@mui/material";

import { useLocation, useNavigate, useParams } from "react-router-dom";

import {
  useForm,
  Controller,
} from "react-hook-form";

import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import CardComponent from "../../../../components/card/Card";

import { apiRequest } from "../../../../utils/ApiRequest";
import { ApiRoutes } from "../../../../constants/ApiConstants";

import { useAlert } from "../../../../context/AlertContext";
import { useGlobalError } from "../../../../context/ErrorContext";

import CustomSelect from "../../../../components/inputs/customtext/CustomSelect";
import CustomCheckboxInput from "../../../../components/inputs/customtext/CustomCheckboxInput";

/* ---------------- TYPES ---------------- */

interface FormValues {
  program_id: string;
  batch: string;
  admission_year: string;
  semester: string;
  enabled: boolean;
}

/* ---------------- DEFAULT VALUES ---------------- */

const defaultValues: FormValues = {
  program_id: "",
  batch: "",
  admission_year: "",
  semester: "",
  enabled: true,
};

/* ---------------- VALIDATION ---------------- */

const schema: Yup.ObjectSchema<FormValues> =
  Yup.object({
    program_id:
      Yup.string().required(
        "Program is required"
      ),

    batch:
      Yup.string().required(
        "Batch is required"
      ),

    admission_year:
      Yup.string().required(
        "Admission year is required"
      ),

    semester:
      Yup.string().required(
        "Semester is required"
      ),

    enabled:
      Yup.boolean().required(),
  });

/* ---------------- COMPONENT ---------------- */

export default function PaymentWorkflowAdd() {
  const navigate = useNavigate();

  const { id } = useParams();

  const isEditMode = Boolean(id);

  const location = useLocation();

  const rowData = location.state;

  const { showAlert, showConfirm } =
    useAlert();

  const { clearError } =
    useGlobalError();

  const [initialData, setInitialData] =
    useState<FormValues>(
      defaultValues
    );

  const [programOptions, setProgramOptions] =
    useState<any[]>([]);

  const [batchOptions, setBatchOptions] =
    useState<any[]>([]);

  const [yearOptions, setYearOptions] =
    useState<any[]>([]);

  const [semesterOptions, setSemesterOptions] =
    useState<any[]>([]);

  const SEMESTER_LIST = [
    { label: "SEMESTER 1", value: 'Semester 1' },
    { label: "SEMESTER 2", value: 'Semester 2' },
    { label: "SEMESTER 3", value: 'Semester 3' },
    { label: "SEMESTER 4", value: 'Semester 4' },
    { label: "SEMESTER 5", value: 'Semester 5' },
    { label: "SEMESTER 6", value: 'Semester 6' },
    { label: "SEMESTER 7", value: 'Semester 7' },
    { label: "SEMESTER 8", value: 'Semester 8' }
  ];

  const {
    handleSubmit,
    control,
    reset,
    formState: {
      isDirty,
    },
  } = useForm<FormValues>({
    resolver:
      yupResolver(schema),
    defaultValues,
  });

  /* ---------------- LOAD DROPDOWNS ---------------- */

  useEffect(() => {
    clearError();

    loadDropdowns();

    if (rowData) {
      fetchWorkflowById();
    }
  }, [rowData]);

  const loadDropdowns =
    async () => {
      try {
        const [
          programRes,
          batchRes,
          yearRes,
        ] = await Promise.all([
          apiRequest({
            url:
              ApiRoutes.GETPROGRAMLIST,
            method: "get",
          }),

          apiRequest({
            url:
              ApiRoutes.BATCHLIST,
            method: "get",
          }),

          apiRequest({
            url:
              ApiRoutes.ACADEMICYEARLIST,
            method: "get",
          }),
        ]);

        setProgramOptions(
          (programRes || []).map(
            (p: any) => ({
              label:
                p.programe,
              value: p.id,
            })
          )
        );

        setBatchOptions(
          (batchRes || []).map(
            (b: any) => ({
              label:
                b.batch_name,
              value:
                b.batch_name,
            })
          )
        );

        setYearOptions(
          (yearRes || []).map(
            (y: any) => ({
              label:
                y.year_code,
              value:
                y.year_code,
            })
          )
        );

        setSemesterOptions(
          (SEMESTER_LIST || []).map(
            (s: any) => ({
              label:
                s.label,
              value:
                s.value,
            })
          )
        );
      } catch {
        showAlert(
          "Failed to load dropdown data",
          "error"
        );
      }
    };

  /* ---------------- FETCH EDIT DATA ---------------- */

  const fetchWorkflowById = async () => {
    try {
      if (!rowData) return;

      const {
        program_id,
        batch,
        admission_year,
        semester,
      } = rowData;

      const res = await apiRequest({
        url: `${ApiRoutes.PAYMENTCONTROL}/${program_id}/pending-payment-workflow`,
        method: "get",
        params: {
          batch,
          admission_year,
          semester,
        },
      });

      const data =
        res || defaultValues;

      setInitialData(data);

      reset(data);
    } catch {
      showAlert(
        "Failed to load workflow data",
        "error"
      );
    }
  };

  /* ---------------- SUBMIT ---------------- */

  const onSubmit = async (values: any) => {
    try {
      const programId =
        rowData?.program_id || values.program_id;

      await apiRequest({
        url: `${ApiRoutes.PAYMENTCONTROL}/${programId}/pending-payment-workflow`,
        method: "put",
        data: {
          batch: values.batch,
          admission_year: values.admission_year,
          semester: values.semester,
          enabled: values.enabled,
        },
      });

      showAlert(
        isEditMode
          ? "Workflow updated successfully"
          : "Workflow created successfully",
        "success"
      );

      navigate("/payment-control/list");

    } catch (error) {
      showAlert(
        "Failed to save workflow",
        "error"
      );
    }
  };


  /* ---------------- RESET ---------------- */

  const handleReset = () => {
    reset(initialData);
  };

  /* ---------------- BACK ---------------- */

  const handleBack = () => {
    if (isDirty) {
      showConfirm(
        "You have unsaved changes. Are you sure you want to leave?",
        () =>
          navigate(
            "/payment-control/list"
          ),
        () => { }
      );
    } else {
      navigate(
        "/payment-control/list"
      );
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <Box p={3}>
      <CardComponent sx={{ p: 4 }}>
        <form
          onSubmit={handleSubmit(
            onSubmit
          )}
        >
          <Grid
            container
            spacing={3}
          >
            {/* Program */}

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="program_id"
                control={control}
                render={({
                  field,
                }) => (
                  <CustomSelect
                    label="Program"
                    options={
                      programOptions
                    }
                    field={field}
                  />
                )}
              />
            </Grid>

            {/* Batch */}

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="batch"
                control={control}
                render={({
                  field,
                }) => (
                  <CustomSelect
                    label="Batch"
                    options={
                      batchOptions
                    }
                    field={field}
                  />
                )}
              />
            </Grid>

            {/* Admission Year */}

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="admission_year"
                control={control}
                render={({
                  field,
                }) => (
                  <CustomSelect
                    label="Admission Year"
                    options={
                      yearOptions
                    }
                    field={field}
                  />
                )}
              />
            </Grid>

            {/* Semester */}

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="semester"
                control={control}
                render={({
                  field,
                }) => (
                  <CustomSelect
                    label="Semester"
                    options={
                      semesterOptions
                    }
                    field={field}
                  />
                )}
              />
            </Grid>

            {/* Enabled */}

            <Grid size={{ xs: 12 }}>
              <Controller
                name="enabled"
                control={control}
                render={({
                  field,
                }) => (
                  <CustomCheckboxInput
                    label="Enable Workflow"
                    field={field}
                  />
                )}
              />
            </Grid>
          </Grid>

          {/* Buttons */}

          <Box
            display="flex"
            justifyContent="flex-end"
            gap={2}
            mt={4}
          >
            <Button
              variant="outlined"
              onClick={
                handleBack
              }
            >
              Back
            </Button>

            <Button
              variant="outlined"
              onClick={
                handleReset
              }
            >
              Reset
            </Button>

            <Button
              type="submit"
              variant="contained"
            >
              {id
                ? "Update"
                : "Save"}
            </Button>
          </Box>
        </form>
      </CardComponent>
    </Box>
  );
}