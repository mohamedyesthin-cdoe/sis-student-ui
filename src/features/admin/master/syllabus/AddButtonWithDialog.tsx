import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
} from "@mui/material";

interface AddButtonWithDialogProps {
  label: string;
  onAdd: (value: string) => void;
}

export default function AddButtonWithDialog({
  label,
  onAdd,
}: AddButtonWithDialogProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (!value.trim()) return;
    onAdd(value.trim());
    setValue("");
    setOpen(false);
  };

  return (
    <>
      <Tooltip title={`Add ${label}`}>
        <Button
          variant="outlined"
          size="small"
          sx={{
            ml: 1,
            mt: "6px",
            height: "32px",
            textTransform: "none",
            px: 2,
            minWidth: "50px",
          }}
          onClick={() => setOpen(true)}
        >
          Add
        </Button>
      </Tooltip>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        PaperProps={{
          sx: {
            p: 1,            // ⭐ Add padding around entire dialog
            borderRadius: "10px",
          },
        }}
      >
        <DialogTitle sx={{ p: "10px" }}>Add {label}</DialogTitle>

        <DialogContent sx={{ p: "10px" }}>
          <TextField
            fullWidth
            label={label}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
            InputProps={{
              sx: {
                height: 45,
                display: "flex",
                alignItems: "center",
              },
            }}
            InputLabelProps={{
              sx: {
                lineHeight: "1.2em",
                transform: "translate(14px, 12px) scale(1)",
                "&.MuiInputLabel-shrink": {
                  transform: "translate(14px, -3px) scale(0.75)",
                },
              },
            }}
          />
        </DialogContent>

        <DialogActions sx={{ p: "10px" }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>

    </>
  );
}
