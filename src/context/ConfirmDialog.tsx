import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";

interface CustomDialogProps {
  open: boolean;
  title: string;
  description?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
}

export default function CustomDialog({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onClose,
  onConfirm,
  loading = false,
  maxWidth = "xs",
}: CustomDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
    >
      <DialogTitle
        sx={{
          fontWeight: 600,
          fontSize: "18px",
        }}
      >
        {title}
      </DialogTitle>

      <DialogContent dividers>
        <Box>
          {typeof description === "string" ? (
            <Typography variant="body2">{description}</Typography>
          ) : (
            description
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          disabled={loading}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
