import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Button,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import CardComponent from "../../../../components/card/Card";

import { apiRequest } from "../../../../utils/ApiRequest";
import { ApiRoutes } from "../../../../constants/ApiConstants";

import { useAlert } from "../../../../context/AlertContext";
import { useGlobalError } from "../../../../context/ErrorContext";

import CustomSelect from "../../../../components/inputs/customtext/CustomSelect";
import CustomInputText from "../../../../components/inputs/customtext/CustomInputText";
import CustomCheckboxInput from "../../../../components/inputs/customtext/CustomCheckboxInput";

/* ---------------- TYPES ---------------- */

interface FormValues {
  academic_year_id: number | "";
  batch_number: number | "";
  batch_name: string;
  start_month: number;
  end_month: number;
  description: string;
  is_active: boolean;
}

/* ---------------- DEFAULT VALUES ---------------- */

const defaultValues: FormValues = {
  academic_year_id: "",
  batch_number: "",
  batch_name: "",
  start_month: 7,
  end_month: 6,
  description: "",
  is_active: true,
};

/* ---------------- VALIDATION ---------------- */

const schema: Yup.ObjectSchema<FormValues> =
  Yup.object({
    academic_year_id:
      Yup.number()
        .typeError(
          "Academic year is required"
        )
        .required(
          "Academic year is required"
        ),

    batch_number:
      Yup.number()
        .typeError(
          "Batch number is required"
        )
        .required(
          "Batch number is required"
        ),

    batch_name:
      Yup.string().required(
        "Batch name is required"
      ),

    start_month: Yup.number()
      .required(
        "Start month is required"
      )
      .min(1)
      .max(12),

    end_month: Yup.number()
      .required(
        "End month is required"
      )
      .min(1)
      .max(12),

    description:
      Yup.string().required(
        "Description is required"
      ),

    is_active:
      Yup.boolean().required(),
  });

export default function BatchAdd() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { showAlert, showConfirm } =
    useAlert();

  const { clearError } =
    useGlobalError();

  const [initialData, setInitialData] =
    useState<FormValues>(
      defaultValues
    );

  const [
    academicYearOptions,
    setAcademicYearOptions,
  ] = useState<any[]>([]);

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

    if (id) {
      fetchBatchById();
    }
  }, [id]);

  const loadDropdowns =
    async () => {
      try {
        const yearRes =
          await apiRequest({
            url:
              ApiRoutes.ACADEMICYEARLIST,
            method: "get",
          });

        setAcademicYearOptions(
          (yearRes || []).map(
            (y: any) => ({
              label:
                y.year_code,
              value: y.id,
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

  const fetchBatchById =
    async () => {
      try {
        const res =
          await apiRequest({
            url: `${ApiRoutes.GETBATCHBYID}/${id}`,
            method: "get",
          });

        const data =
          res || defaultValues;

        setInitialData(data);

        reset(data);
      } catch {
        showAlert(
          "Failed to load batch data",
          "error"
        );
      }
    };

  /* ---------------- SUBMIT ---------------- */

  const onSubmit = async (
    values: FormValues
  ) => {
    try {
      if (id) {
        await apiRequest({
          url: `${ApiRoutes.BATCHUPDATE}/${id}`,
          method: "put",
          data: values,
        });

        showAlert(
          "Batch updated successfully",
          "success"
        );
      } else {
        await apiRequest({
          url:
            ApiRoutes.BATCHADD,
          method: "post",
          data: values,
        });

        showAlert(
          "Batch created successfully",
          "success"
        );
      }

      navigate("/batch/list");
    } catch (err: any) {
      showAlert(
        err.response?.data
          ?.message ||
          "Failed to save batch",
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
          navigate("/batch/list"),
        () => {}
      );
    } else {
      navigate("/batch/list");
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
            {/* Academic Year */}

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="academic_year_id"
                control={control}
                render={({
                  field,
                }) => (
                  <CustomSelect
                    label="Academic Year"
                    options={
                      academicYearOptions
                    }
                    field={field}
                  />
                )}
              />
            </Grid>

            {/* Batch Number */}

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="batch_number"
                control={control}
                render={({
                  field,
                }) => (
                  <CustomInputText
                    label="Batch Number"
                    type="number"
                    field={field}
                  />
                )}
              />
            </Grid>

            {/* Batch Name */}

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="batch_name"
                control={control}
                render={({
                  field,
                }) => (
                  <CustomInputText
                    label="Batch Name"
                    field={field}
                  />
                )}
              />
            </Grid>

            {/* Description */}

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="description"
                control={control}
                render={({
                  field,
                }) => (
                  <CustomInputText
                    label="Description"
                    field={field}
                  />
                )}
              />
            </Grid>

            {/* Start Month */}

            <Grid size={{ xs: 12, md: 3 }}>
              <Controller
                name="start_month"
                control={control}
                render={({ field }) => (
                  <CustomInputText
                    label="Start Month"
                    type="number"
                    field={field}
                  />
                )}
              />
            </Grid>

            {/* End Month */}

            <Grid size={{ xs: 12, md: 3 }}>
              <Controller
                name="end_month"
                control={control}
                render={({ field }) => (
                  <CustomInputText
                    label="End Month"
                    type="number"
                    field={field}
                  />
                )}
              />
            </Grid>

            {/* Active */}

            <Grid size={{ xs: 12 }}>
              <Controller
                name="is_active"
                control={control}
                render={({
                  field,
                }) => (
                  <CustomCheckboxInput
                    label="Active"
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