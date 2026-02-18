import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import type { SxProps, Theme } from "@mui/material";

interface CustomDateInputProps {
  label: string;
  field: {
    value: any;
    onChange: (value: any) => void;
    onBlur?: () => void;
    name?: string;
    ref?: any;
  };
  error?: boolean;
  helperText?: string;
  sx?: SxProps<Theme>;
  disabled?: boolean;

  // ✅ NEW OPTIONAL PROPS
  disableFuture?: boolean;
  disablePast?: boolean;
  minDate?: Dayjs | Date | null;
  maxDate?: Dayjs | Date | null;
}

export default function CustomDateInput({
  label,
  field,
  error = false,
  helperText = "",
  sx = {},
  disabled = false,

  disableFuture = false,
  disablePast = false,
  minDate,
  maxDate,
}: CustomDateInputProps) {
  return (
    <DatePicker
      label={label}
      value={field.value ? dayjs(field.value) : null}
      onChange={(val: any) => field.onChange(val ? val.toDate() : null)}
      disabled={disabled}

      // ✅ Optional controls
      disableFuture={disableFuture}
      disablePast={disablePast}
      minDate={minDate ? dayjs(minDate) : undefined}
      maxDate={maxDate ? dayjs(maxDate) : undefined}

      slotProps={{
        textField: {
          fullWidth: true,
          error,
          helperText,
          InputLabelProps: { shrink: true },
          sx: {
            ...sx,
            "& .MuiPickersInputBase-root": {
              height: "45px !important",
            },
            "& .MuiOutlinedInput-input": {
              padding: "0 12px !important",
            },
          },
        },
      }}
    />
  );
}
