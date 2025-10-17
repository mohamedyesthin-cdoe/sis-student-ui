import { Typography } from '@mui/material'
import theme from '../../styles/theme'
import type { SxProps, Theme, TypographyVariant } from '@mui/material'; // 👈 type-only import

interface CustomtextProps {
  fieldName: string,
  sx?: SxProps<Theme>;
  variantName?:TypographyVariant // ✅ custom sx support
}

const Customtext: React.FC<CustomtextProps> = ({ fieldName, sx = {},variantName}) => {
  return (
    <Typography
      variant={variantName}
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

export default Customtext
