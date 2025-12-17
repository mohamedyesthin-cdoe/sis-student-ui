import { createContext, useState, useContext, type ReactNode } from "react";
import {
  Box,
  Typography,
  Modal,
  Fade,
  Backdrop,
  Button,
  Slide,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import theme from "../styles/theme";
import Customtext from "../components/inputs/customtext/Customtext";

type AlertType = "success" | "error" | "info";

interface AlertContextProps {
  showAlert: (message: string, type?: AlertType) => void;
  showConfirm: (
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => void;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error("useAlert must be used within AlertProvider");
  return context;
};

// Icon Map
const iconMap = {
  success: (
    <CheckCircleIcon sx={{ fontSize: 28, color: "#2ecc71", flexShrink: 0 }} />
  ),
  error: (
    <ErrorIcon sx={{ fontSize: 28, color: "#e74c3c", flexShrink: 0 }} />
  ),
  info: <InfoIcon sx={{ fontSize: 28, color: "#3498db", flexShrink: 0 }} />,
};

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<AlertType>("info");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [onConfirmCallback, setOnConfirmCallback] = useState<() => void>(
    () => { }
  );
  const [onCancelCallback, setOnCancelCallback] = useState<() => void>(
    () => { }
  );

  // 🔔 Show Alert
  const showAlert = (msg: string, type: AlertType = "info") => {
    setAlertMessage(msg);
    setAlertType(type);
    setAlertOpen(true);

    setTimeout(() => setAlertOpen(false), 3500);
  };

  // ❗ Show Confirm Dialog
  const showConfirm = (
    msg: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => {
    setConfirmMessage(msg);
    setOnConfirmCallback(() => onConfirm);
    setOnCancelCallback(() => onCancel || (() => { }));
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    onConfirmCallback();
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    onCancelCallback();
  };

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm }}>
      {children}

      {/* 🌟 Modern Glass Toast Notification */}
      <Slide direction="left" in={alertOpen} mountOnEnter unmountOnExit>
        <Box
          sx={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 9999,
            display: "flex",
            gap: 2,
            alignItems: "center",
            bgcolor: "rgba(255, 255, 255, 0.18)",
            backdropFilter: "blur(12px)",
            borderRadius: 2,
            px: 2.8,
            py: 1.8,
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.25)",
            border: "1px solid rgba(255, 255, 255, 0.25)",
            minWidth: "260px",
            animation: "fadeUp 0.35s ease",
          }}
        >
          {iconMap[alertType]}

          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "0.95rem",
              lineHeight: 1.3,
              color:
                alertType === "success"
                  ? theme.palette.success.main
                  : alertType === "error"
                    ? theme.palette.error.main
                    : theme.palette.info.main,
            }}
          >
            {alertMessage}
          </Typography>

        </Box>
      </Slide>

      {/* ❗ Confirm Modal (unchanged) */}
      <Modal
        open={confirmOpen}
        onClose={handleCancel}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 300 } }}
      >
        <Fade in={confirmOpen}>
          <Box
            sx={{
              position: "absolute" as const,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "#fff",
              borderRadius: 3,
              boxShadow: 24,
              p: 3,
              minWidth: 320,
              textAlign: "center",
            }}
          >
            <Customtext
              fieldName={"Leave this page?"}
              sx={{
                mb: 2,
                fontSize: {
                  xs: "0.875rem",
                  sm: "1rem",
                  md: "1.125rem",
                  lg: "1.125rem",
                  xl: "1.5rem",
                },
                color: theme.palette.text.primary,
              }}
            />

            <Customtext
              fieldName={confirmMessage}
              sx={{
                mb: 3,
                fontSize: {
                  xs: "0.875rem",
                  sm: "1rem",
                  md: "1.125rem",
                  lg: "1rem",
                  xl: "1.5rem",
                },
                color: theme.palette.grey[500],
              }}
            />

            <Box display="flex" justifyContent="center" gap={2}>
              <Button
                variant="outlined"
                onClick={handleCancel}
                sx={{
                  color: theme.palette.primary.main,
                  borderColor: theme.palette.primary.main,
                  "&:hover": {
                    backgroundColor: theme.palette.primary.main,
                    color: "#fff",
                  },
                }}
              >
                No
              </Button>

              <Button
                variant="contained"
                onClick={handleConfirm}
                sx={{
                  backgroundColor: theme.palette.error.main,
                  "&:hover": {
                    backgroundColor: theme.palette.error.dark,
                    color: "#fff",
                  },
                }}
              >
                Yes
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </AlertContext.Provider>
  );
};
