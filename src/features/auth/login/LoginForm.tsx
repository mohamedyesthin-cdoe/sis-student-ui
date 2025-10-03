import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Mail } from 'lucide-react';
import { setUser } from "../../../redux/slices/AuthSlice";
import { ApiRoutes } from "../../../constants/ApiConstants";
import { apiRequest } from "../../../utils/ApiRequest";
import { encryptPassword } from "../../../utils/encryption";
import { Button, TextField, Typography, Checkbox, FormControlLabel, Link, Paper, Box, useTheme } from '@mui/material'
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useAlert } from "../../../context/AlertContext";
import { jwtDecode } from 'jwt-decode'
import { setValue } from "../../../utils/localStorageUtil";

function LoginPage() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const theme = useTheme()

  // useEffect(() => {
  //   showAlert('Alert system is working!', 'info');
  // }, []);

  interface JwtPayload {
    username: string;
    exp?: number;
    iat?: number;
    [key: string]: any;
  }

  const handleData = async (data: any) => {
    try {
      const encryptedPassword = encryptPassword(data.password);
      const userName = data.username;

      const result = await apiRequest({
        url: ApiRoutes.LOGIN,
        method: 'post',
        data: {
          username: userName,
          password: encryptedPassword,
          is_encrypted: true,
        },
      });

      setValue('ACCESS_TOKEN_KEY', result.access_token);

      const user = jwtDecode<JwtPayload>(result.access_token);
      dispatch(setUser({ userName: user.username }));
      // showAlert('Login successful!', 'info');
      navigate("/dashboard");

    } catch (error) {
      console.error('Login error:', error);
      showAlert('Login failed, please check your credentials.', 'error');
    }
  };





  let schema = Yup.object().shape({
    username: Yup.string()
      .email()
      .required("Email is Required")
      .matches(/^[a-zA-Z0-9]+@[a-z]{3,6}\.[a-z]{2,4}$/, "Enter a valid Email"),
    password: Yup.string().required("Password is Required")
  });

  let { register, handleSubmit, formState: { errors }, } = useForm({
    resolver: yupResolver(schema),
  });


  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <Box className="min-h-screen flex items-center justify-end bg-gray-100 relative px-4 sm:px-6 lg:px-12">

      {/* Logo */}
      <img
        src="https://sriramachandradigilearn.edu.in/wp-content/uploads/2025/06/CDOE-logo-1.png"
        alt="Logo"
        className="absolute top-6 left-6 w-60 sm:w-60 md:w-80"
      />

      {/* Illustrations - only shown on xl screens */}
      <Box className="hidden xl:block absolute inset-0">
        <img
          src="https://demos.pixinvent.com/vuexy-html-admin-template/assets/img/illustrations/auth-login-illustration-light.png"
          alt="auth-login-cover"
          className="absolute top-1/6 left-[15%] max-w-md"
        />
        <img
          src="https://demos.pixinvent.com/vuexy-html-admin-template/assets/img/illustrations/bg-shape-image-light.png"
          alt="platform-bg"
          className="absolute bottom-0 left-0 w-full h-80"
        />
      </Box>

      {/* Right Aligned Form Card */}
      <Box className="w-full max-w-md mr-2">
        <Paper elevation={6} className="p-8" component="form"
          onSubmit={handleSubmit(handleData)}>
          <Typography variant="h5" fontWeight="500" gutterBottom>
            Welcome to SIS! 👋
          </Typography>

          <Typography variant="body1" sx={{color:theme.palette.custom.accent}}>
            Please sign-in to your account and start the adventure
          </Typography>

          <Box className="relative mb-4 mt-3">
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              {...register("username")}
              error={!!errors.username}
              helperText={errors.username?.message}
            />
            <Mail className="absolute right-3 top-3 w-5 h-5 text-muted pointer-events-none" />
          </Box>


          <Box className="relative mb-4">
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            {showPassword ? (
              <FiEyeOff
                className="absolute right-3 top-3 w-5 h-5 text-muted cursor-pointer"
                onClick={togglePassword}
              />
            ) : (
              <FiEye
                className="absolute right-3 top-3 w-5 h-5 text-muted cursor-pointer"
                onClick={togglePassword}
              />
            )}
          </Box>

          <Box className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <FormControlLabel control={<Checkbox />} label="Remember Me" />
            <Link href="#" underline="hover" className="mt-2 sm:mt-0">
              Forgot Password?
            </Link>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: (theme) => theme.palette.secondary.main, 
              textTransform: 'none',
              py: 1.5,
              fontWeight: 600,
              '&:hover': {
                backgroundColor: (theme) => theme.palette.primary.dark, 
              },
            }}
          >
            Sign in
          </Button>

        </Paper>
      </Box>
    </Box>

  );
}

export default LoginPage;
