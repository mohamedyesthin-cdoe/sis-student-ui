import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  description?: string;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

const ConfirmDialog = ({
  open,
  title = "Confirm Delete",
  description = "Are you sure you want to delete this record?",
  onClose,
  onConfirm,
  loading = false,
}: ConfirmDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>
        {title}
      </DialogTitle>

      <DialogContent dividers>
        <Box display="flex" alignItems="center" gap={2}>
          <WarningAmberIcon color="error" />
          <Typography variant="body2">
            {description}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" disabled={loading}>
          Cancel
        </Button>

        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={loading}
          startIcon={
            loading ? <CircularProgress size={18} color="inherit" /> : null
          }
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
