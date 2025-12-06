import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
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
}

export default function CustomDateInput({
    label,
    field,
    error = false,
    helperText = "",
    sx = {},
    disabled = false,
}: CustomDateInputProps) {
    return (
        <DatePicker
            label={label}
            value={field.value ? dayjs(field.value) : null}
            onChange={(val:any) => field.onChange(val ? val.toDate() : null)}
            disabled={disabled}
            slotProps={{
                textField: {
                    fullWidth: true,
                    error,
                    helperText,
                    InputLabelProps: { shrink: true }, // 👈 fix
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
