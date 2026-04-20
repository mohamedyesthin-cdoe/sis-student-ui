import React, { useEffect, useState } from "react";
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
import { getValue } from "../../../../utils/localStorageUtil";
import { apiRequest } from "../../../../utils/ApiRequest";
import { ApiRoutes } from "../../../../constants/ApiConstants";
import CardComponent from "../../../../components/card/Card";
import Customtext from "../../../../components/inputs/customtext/Customtext";
import CustomInputText from "../../../../components/inputs/customtext/CustomInputText";
import GrievanceSkeleton from "../../../../components/card/skeletonloader/GrievanceSkeleton";
import { useAlert } from "../../../../context/AlertContext";
import { useGlobalError } from "../../../../context/ErrorContext";
import { useLoader } from "../../../../context/LoaderContext";

/* ================= TYPES ================= */

type GrievanceFormValues = {
  subject: string;
  description: string;
  grievanceFile?: File | null;
};

/* ================= CONSTANTS ================= */

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

/* ================= VALIDATION ================= */

const GrievanceSchema: Yup.ObjectSchema<GrievanceFormValues> =
  Yup.object({
    subject: Yup.string()
      .required("Subject is required")
      .max(200),

    description: Yup.string()
      .required("Description is required")
      .max(2000),

    grievanceFile: Yup.mixed<File>()
      .nullable()
      .notRequired()
      .test(
        "fileType",
        "Only image files are allowed (JPG, PNG, GIF, WEBP)",
        (value) => {
          if (!value) return true;
          return ALLOWED_IMAGE_TYPES.includes(value.type);
        }
      )
      .test(
        "fileSize",
        "File size must be less than 10MB",
        (value) => {
          if (!value) return true;
          return value.size <= MAX_FILE_SIZE;
        }
      ),
  });

/* ================= COMPONENT ================= */

const GrievanceAddEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { showAlert, showConfirm } = useAlert();
  const { clearError } = useGlobalError();
  const { loading } = useLoader();

  const [existingAttachment, setExistingAttachment] =
    useState<string | null>(null);

  const [previewFileUrl, setPreviewFileUrl] =
    useState<string | null>(null);

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

  /* ================= FETCH ================= */

  useEffect(() => {
    if (!id) return;

    const fetchGrievance = async () => {
      try {
        const res = await apiRequest({
          url: `${ApiRoutes.GRIEVANCEBYID}/${id}`,
          method: "get",
        });

        const data = res;

        reset({
          subject: data.subject || "",
          description: data.description || "",
          grievanceFile: null,
        });

        setExistingAttachment(
          data.attachment_url || null
        );

      } catch (err: any) {
        showAlert(
          err.response?.data?.message ||
            "Failed to fetch grievance",
          "error"
        );
      }
    };

    fetchGrievance();

  }, [id]);

  /* ================= BACK ================= */

  const handleBack = () => {
    if (isDirty) {
      showConfirm(
        "You have unsaved changes. Continue?",
        () => window.history.back(),
        () => {}
      );
    } else {
      window.history.back();
    }
  };

  /* ================= FILE CHANGE ================= */

  const handleFileChange = (
    file: File | null,
    field: any
  ) => {
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      showAlert(
        "Only image files are allowed",
        "error"
      );
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      showAlert(
        "File size must be less than 10MB",
        "error"
      );
      return;
    }

    field.onChange(file);

    setValue("grievanceFile", file, {
      shouldDirty: true,
    });

    const url = URL.createObjectURL(file);

    setPreviewFileUrl(url);
    setExistingAttachment(null);
  };

  /* ================= SUBMIT ================= */

  const onSubmit: SubmitHandler<
    GrievanceFormValues
  > = async (data) => {
    try {
      const payload = new FormData();

      payload.append(
        "subject",
        data.subject
      );

      payload.append(
        "description",
        data.description
      );

      payload.append(
        "student_id",
        String(studentId)
      );

      if (
        data.grievanceFile instanceof File
      ) {
        payload.append(
          "file",
          data.grievanceFile
        );
      }

      const apiUrl = id
        ? `${ApiRoutes.GRIEVANCEUPDATE}/${id}`
        : ApiRoutes.GRIEVANCEADD;

      const method = id
        ? "put"
        : "post";

      await apiRequest({
        url: apiUrl,
        method,
        data: payload,
        headers: {
          "Content-Type":
            "multipart/form-data",
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
          "Something went wrong",
        "error"
      );
    }
  };

  /* ================= UI ================= */

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
            maxWidth: 900,
            mx: "auto",
            mt: 3,
          }}
        >
          <CardComponent sx={{ p: 3 }}>
            <Customtext
              fieldName="Grievance Details"
              sx={{ mb: 2 }}
            />

            <Grid container spacing={2}>

              <Grid size={{ xs: 12, md: 6 }}>
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

              <Grid size={{ xs: 12 }}>
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

              {/* FILE UPLOAD */}

              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="grievanceFile"
                  control={control}
                  render={({ field }) => (
                    <Box
                      sx={{
                        border:
                          "2px dashed #1976d2",
                        borderRadius: 2,
                        py: 2,
                        textAlign: "center",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        document
                          .getElementById(
                            "file-input"
                          )
                          ?.click()
                      }
                    >
                      {uploadedFile ? (
                        <Typography>
                          {uploadedFile.name}
                        </Typography>
                      ) : (
                        <Typography>
                          Click or drag image to upload
                        </Typography>
                      )}

                      <input
                        id="file-input"
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => {
                          const file =
                            e.target.files?.[0] ||
                            null;

                          handleFileChange(
                            file,
                            field
                          );

                          e.target.value = "";
                        }}
                      />
                    </Box>
                  )}
                />
              </Grid>

            </Grid>

            {/* ATTACHMENT PREVIEW */}

            <Box mt={4}>
              <Typography
                fontWeight={600}
                mb={2}
              >
                Attachment
              </Typography>

              {(previewFileUrl ||
                existingAttachment) ? (
                <Box
                  sx={{
                    width: "100%",
                    height: 420,
                    border:
                      "1px solid #e0e0e0",
                    borderRadius: 2,
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor:
                      "#fafafa",
                  }}
                >
                  <Box
                    component="img"
                    src={
                      previewFileUrl ||
                      existingAttachment!
                    }
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit:
                        "contain",
                    }}
                  />
                </Box>
              ) : (
                <Typography color="text.secondary">
                  No attachment available
                </Typography>
              )}
            </Box>

          </CardComponent>

          {/* BUTTONS */}

          <Box
            mt={4}
            display="flex"
            gap={2}
            justifyContent="flex-end"
          >
            <Button
              variant="contained"
              onClick={handleBack}
            >
              Back
            </Button>

            <Button
              variant="outlined"
              color="error"
              onClick={() =>
                reset(defaultValues)
              }
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