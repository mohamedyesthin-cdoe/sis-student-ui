import { useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Grid,
    IconButton,
    InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import CardComponent from "../../../components/card/Card";
import { useAlert } from "../../../context/AlertContext";
import { apiRequest } from "../../../utils/ApiRequest";
import { ApiRoutes } from "../../../constants/ApiConstants";

// Validation schema
const PasswordSchema = Yup.object().shape({
    oldPassword: Yup.string().required("Old Password is required"),
    newPassword: Yup.string()
        .required("New Password is required")
        .min(8, "Password must be at least 8 characters"),
    confirmPassword: Yup.string()
        .required("Confirm Password is required")
        .oneOf([Yup.ref("newPassword")], "Passwords do not match"),
});

type FormValues = {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
};

const ChangePasswordForm = () => {
    const { showAlert } = useAlert();
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: yupResolver(PasswordSchema),
        mode: "onChange",
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: FormValues) => {
        try {
            await apiRequest({
                url: `${ApiRoutes.CHANGEPASSWORD}`,
                method: "post",
                data: {
                    current_password: data.oldPassword,
                    new_password: data.newPassword,
                },
            });

            showAlert("Password updated successfully!", "success");
            reset();
        } catch (err: any) {
            const message =
                err.response?.data?.message || "Something went wrong. Please try again.";
            showAlert(message, "error");
        }
    };

    return (
        <Box sx={{ maxWidth: 500, mx: "auto", mt: 5 }}>
            <CardComponent sx={{ p: 4, borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                <Typography
                    variant="h5"
                    fontWeight="bold"
                    textAlign="center"
                    mb={3}
                    textTransform="uppercase"
                >
                    Change Password
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                        {/* Old Password */}
                        <Grid size={{ xs: 12, md: 12 }} my={1}>
                            <Controller
                                name="oldPassword"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Old Password"
                                        type={showOldPassword ? "text" : "password"}
                                        fullWidth
                                        size="medium"
                                        error={!!errors.oldPassword}
                                        helperText={errors.oldPassword?.message}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowOldPassword(!showOldPassword)}
                                                        edge="end"
                                                    >
                                                        {showOldPassword ? < Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        {/* New Password */}
                        <Grid size={{ xs: 12, md: 12 }} my={1}>
                            <Controller
                                name="newPassword"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="New Password"
                                        type={showNewPassword ? "text" : "password"}
                                        fullWidth
                                        size="medium"
                                        error={!!errors.newPassword}
                                        helperText={errors.newPassword?.message}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                        edge="end"
                                                    >
                                                        {showNewPassword ? < Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        {/* Confirm Password */}
                        <Grid size={{ xs: 12, md: 12 }} my={1}>
                            <Controller
                                name="confirmPassword"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Confirm Password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        fullWidth
                                        size="medium"
                                        error={!!errors.confirmPassword}
                                        helperText={errors.confirmPassword?.message}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() =>
                                                            setShowConfirmPassword(!showConfirmPassword)
                                                        }
                                                        edge="end" >
                                                        {showConfirmPassword ? < Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>

                    <Box display="flex" justifyContent="space-between" mt={4}>
                        <Button variant="outlined" color="primary" onClick={() => reset()}>
                            Reset
                        </Button>
                        <Button type="submit" variant="contained" color="secondary" disabled={isSubmitting}>
                            {isSubmitting ? "Updating..." : "Update Password"}
                        </Button>
                    </Box>
                </form>
            </CardComponent>
        </Box>
    );
};

export default ChangePasswordForm;
