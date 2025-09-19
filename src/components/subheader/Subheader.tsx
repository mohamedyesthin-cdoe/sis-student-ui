import { Typography } from '@mui/material'
import theme from '../../styles/theme'
import type { SxProps, Theme } from '@mui/material'; // 👈 type-only import

interface SubheaderProps {
  fieldName: string,
  sx?: SxProps<Theme>; // ✅ custom sx support
}

const Subheader: React.FC<SubheaderProps> = ({ fieldName, sx = {},}) => {
  return (
    <Typography
      variant="subtitle1"
      gutterBottom
      sx={{
        color: theme.palette.secondary.main,
        fontWeight: 'bold',
        fontSize: '0.95rem',
        ...sx
      }}
    >
      {fieldName}
    </Typography>
  )
}

export default Subheader
