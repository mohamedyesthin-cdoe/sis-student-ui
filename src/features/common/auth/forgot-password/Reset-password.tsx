import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress,
  Link,
  useTheme,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockResetIcon from "@mui/icons-material/LockReset";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAlert } from "../../../../context/AlertContext";
import { apiRequest } from "../../../../utils/ApiRequest";
import { ApiRoutes } from "../../../../constants/ApiConstants";

export default function ResetPassword() {
  const theme = useTheme();
  const [token, setToken] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { showAlert } = useAlert();

  // Read token from URL
  useEffect(() => {
    const urlToken = searchParams.get("token");
    if (urlToken) {
      setToken(urlToken);
    }
  }, [searchParams]);

  const validatePassword = () => {
    if (!newPassword || !confirmPassword) {
      showAlert("Please fill all fields", "error");
      return false;
    }

    if (newPassword.length < 6) {
      showAlert("Password must be at least 6 characters", "error");
      return false;
    }

    if (newPassword !== confirmPassword) {
      showAlert("Passwords do not match", "error");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      showAlert("Invalid or expired reset link", "error");
      return;
    }

    if (!validatePassword()) return;

    try {
      setLoading(true);

      await apiRequest({
        url: ApiRoutes.RESETPASSWORD,
        method: "post",
        data: {
          token: token,
          new_password: newPassword,
        },
      });

      showAlert("Password reset successfully!", "success");

      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error: any) {
      console.error(error);

      showAlert(
        error?.response?.data?.message || "Failed to reset password",
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
          <Box textAlign="center" mb={2}>
            <LockResetIcon
              sx={{
                fontSize: 40,
                color: theme.palette.secondary.main,
                mb: 1,
              }}
            />

            <Typography variant="h5" fontWeight="500" gutterBottom>
              Reset Password 🔑
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: theme.palette.custom.accent, mb: 3 }}
            >
              Enter your new password to continue
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            {/* Hidden token */}
            <TextField
              value={token}
              sx={{ display: "none" }}
              InputProps={{ readOnly: true }}
            />

            <TextField
              fullWidth
              label="New Password"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ mb: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{ mb: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
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
              {loading ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>

          <Box textAlign="center" mt={3}>
            <Link
              component="button"
              onClick={() => navigate("/login")}
              underline="hover"
              sx={{ fontSize: 14 }}
            >
              Back to Login
            </Link>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}