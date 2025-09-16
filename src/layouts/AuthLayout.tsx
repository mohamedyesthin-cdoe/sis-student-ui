import { Box } from "@mui/material"

const AuthLayout = ({ children }:any) => (
  <Box className="auth-layout">
    <Box className="auth-container">{children}</Box>
  </Box>
)

export default AuthLayout
