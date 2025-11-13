import { Typography } from '@mui/material'
import theme from '../../styles/theme'
import type { SxProps, Theme, TypographyVariant } from '@mui/material'; // 👈 type-only import

interface CustomtextProps {
  fieldName: any,
  sx?: SxProps<Theme>;
  variantName?: TypographyVariant // ✅ custom sx support
}

const Customtext: React.FC<CustomtextProps> = ({ fieldName, sx = {}, variantName }) => {
  return (
    <Typography
      variant={variantName}
      gutterBottom
      sx={{
        color: theme.palette.secondary.main,
        fontWeight: 'bold',
        fontSize: {
          xs: '0.875rem', // 14px
          sm: '1rem',     // 16px
          md: '1.125rem', // 18px
          lg: '0.8rem',  // 20px
          xl: '1.5rem',   // 24px
        },
        ...sx
      }}
    >
      {fieldName}
    </Typography>
  )
}

export default Customtext
