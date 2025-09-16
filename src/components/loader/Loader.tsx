import './Loader.css';
import { Box } from '@mui/material'
export default function Loader() {
  return (
    <Box className="loader-overlay">
      <Box className="lava-lamp">
        <Box className="bubble"></Box>
        <Box className="bubble1"></Box>
        <Box className="bubble2"></Box>
        <Box className="bubble3"></Box>
      </Box>
    </Box>
  );
}
