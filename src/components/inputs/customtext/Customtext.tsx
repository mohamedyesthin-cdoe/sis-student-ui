import { Typography } from "@mui/material";
import type { SxProps, Theme, TypographyVariant } from "@mui/material";

interface CustomtextProps {
  fieldName: any;
  sx?: SxProps<Theme>;
  variantName?: TypographyVariant;
}

const Customtext: React.FC<CustomtextProps> = ({
  fieldName,
  sx = {},
  variantName = "body2",
}) => {
  return (
    <Typography
      variant={variantName}
      sx={{
        /* ✅ RESPONSIVE FONT SCALE */
        fontSize: {
          xs: "0.85rem",     // mobile
          sm: "0.9rem",      // tablets
          md: "1rem",        // laptops
          lg: "1.05rem",     // 1470
          xl: "1.15rem",     // 1854
          xxl: "1.25rem",    // 2560
        },

        /* optional for readability */
        lineHeight: 1.5,
        fontWeight: 'bold',
        ...sx,
      }}
    >
      {fieldName || "-"}
    </Typography>
  );
};

export default Customtext;
