import { Box, Grid, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import * as React from "react";
import * as Yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useAlert } from "../../../../context/AlertContext";
import { useGlobalError } from "../../../../context/ErrorContext";

import { apiRequest } from "../../../../utils/ApiRequest";
import { ApiRoutes } from "../../../../constants/ApiConstants";

import CardComponent from "../../../../components/card/Card";
import CustomInputText from "../../../../components/inputs/customtext/CustomInputText";
import CustomCheckboxInput from "../../../../components/inputs/customtext/CustomCheckboxInput";

/* ----------------------------- TYPES ----------------------------- */

interface FormValues {
  year_code: string;
  start_year: number;
  end_year: number;
  start_month: number;
  end_month: number;
  is_active: boolean;
  description: string;
}

/* ------------------------- DEFAULT VALUES ------------------------- */

const defaultValues: FormValues = {
  year_code: "",
  start_year: new Date().getFullYear(),
  end_year: new Date().getFullYear() + 1,
  start_month: 7,
  end_month: 6,
  is_active: false,
  description: "",
};

/* --------------------------- VALIDATION --------------------------- */

const validationSchema: Yup.ObjectSchema<FormValues> = Yup.object({
  year_code: Yup.string().required("Year code is required"),
  start_year: Yup.number()
    .required("Start year is required")
    .min(2000, "Invalid year"),
  end_year: Yup.number()
    .required("End year is required")
    .moreThan(
      Yup.ref("start_year"),
      "End year must be greater than start year"
    ),
  start_month: Yup.number()
    .required("Start month is required")
    .min(1)
    .max(12),
  end_month: Yup.number()
    .required("End month is required")
    .min(1)
    .max(12),
  is_active: Yup.boolean().required(),
  description: Yup.string().required("Description is required"),
});

/* ------------------------------ UI ------------------------------ */

export default function YearAdd() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { showAlert, showConfirm } = useAlert();
  const { clearError } = useGlobalError();

  const isEditMode = Boolean(id);

  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty },
  } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  /* ---------------------- FETCH EDIT DATA ---------------------- */

  React.useEffect(() => {
    if (!id) return;

    const fetchYear = async () => {
      try {
        const res = await apiRequest({
          method: "get",
          url: `${ApiRoutes.GETACADEMICYEARBYID}/${id}`,
        });

        if (res) {
          reset({
            year_code: res.year_code,
            start_year: res.start_year,
            end_year: res.end_year,
            start_month: res.start_month,
            end_month: res.end_month,
            is_active: res.is_active,
            description: res.description,
          });
        }
      } catch (error: any) {
        showAlert(
          error.response?.data?.message ||
            "Failed to load year details",
          "error"
        );
      }
    };

    fetchYear();
  }, [id, reset]);

  /* ----------------------------- SUBMIT ----------------------------- */

  const onSubmit = async (data: FormValues) => {
    try {
      if (isEditMode) {
        await apiRequest({
          method: "put",
          url: `${ApiRoutes.ACADEMICUPDATE}/${id}`,
          data,
        });

        showAlert("Year updated successfully!", "success");
      } else {
        await apiRequest({
          method: "post",
          url: ApiRoutes.ACADEMICADD,
          data,
        });

        showAlert("Year created successfully!", "success");
      }

      navigate("/year/list");
    } catch (error: any) {
      showAlert(
        error.response?.data?.message ||
          "Failed to save year",
        "error"
      );
    }
  };

  /* ------------------------------ BACK ------------------------------ */

  const handleBack = () => {
    if (isDirty) {
      showConfirm(
        "You have unsaved changes. Are you sure you want to leave?",
        () => navigate("/year/list"),
        () => {}
      );
    } else {
      navigate("/year/list");
    }
  };

  /* ------------------------------ RESET ------------------------------ */

  const handleReset = () => {
    if (isEditMode) {
      window.location.reload();
    } else {
      reset(defaultValues);
    }

    clearError();
  };

  return (
    <Box p={2}>
      <CardComponent sx={{ p: 4 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="year_code"
                control={control}
                render={({ field }) => (
                  <CustomInputText
                    label="Year Code"
                    field={field}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <CustomInputText
                    label="Description"
                    field={field}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <Controller
                name="start_year"
                control={control}
                render={({ field }) => (
                  <CustomInputText
                    label="Start Year"
                    type="number"
                    field={field}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <Controller
                name="end_year"
                control={control}
                render={({ field }) => (
                  <CustomInputText
                    label="End Year"
                    type="number"
                    field={field}
                  />
                )}
              />
            </Grid>

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

            <Grid size={{ xs: 12 }}>
              <Controller
                name="is_active"
                control={control}
                render={({ field }) => (
                  <CustomCheckboxInput
                    label="Is Active"
                    field={field}
                  />
                )}
              />
            </Grid>

            <Grid
              size={{ xs: 12 }}
              display="flex"
              justifyContent="flex-end"
              gap={2}
              mt={2}
            >
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleBack}
              >
                Back
              </Button>

              <Button
                variant="outlined"
                color="warning"
                onClick={handleReset}
              >
                Reset
              </Button>

              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                {isEditMode ? "Update" : "Save"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardComponent>
    </Box>
  );
}