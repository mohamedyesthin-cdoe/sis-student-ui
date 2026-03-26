import { Box, Button, Paper, TextField, Typography, useTheme } from "@mui/material";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAlert } from "../../../../context/AlertContext";
import { apiRequest } from "../../../../utils/ApiRequest";
import { useState } from "react";
import { ApiRoutes } from "../../../../constants/ApiConstants";

interface FormValues {
  email: string;
}

function ForgotPassword() {
  const theme = useTheme();
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);

  const schema = Yup.object().shape({
    email: Yup.string()
      .email("Enter a valid email")
      .required("Email is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);

      await apiRequest({
        url: ApiRoutes.FORGOTPASSWORD,
        method: "post",
        data: {
          email: data.email,
        },
      });

      showAlert(
        "Password reset link has been sent to your email",
        "success"
      );
    } catch (error) {
      console.error(error);

      showAlert(
        "Unable to process request. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Box className="w-full max-w-md">
        <Paper elevation={6} className="p-8">
          <Typography variant="h5" fontWeight="500" gutterBottom>
            Forgot Password 🔐
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: theme.palette.custom.accent, mb: 3 }}
          >
            Enter your email to receive a password reset link
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                backgroundColor: theme.palette.secondary.main,
                textTransform: "none",
                py: 1.5,
                fontWeight: 600,
              }}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        </Paper>
      </Box>
    </Box>
  );
}

export default ForgotPassword;