import { createContext, useState, useContext, type ReactNode } from 'react';
import { Box, Button, Fade, Backdrop, Modal, Snackbar, Alert as MuiAlert } from '@mui/material';
import theme from '../styles/theme';
import Customtext from '../components/inputs/customtext/Customtext';

type AlertType = 'success' | 'error' | 'info';

interface AlertContextProps {
  showAlert: (message: string, type?: AlertType) => void;
  showConfirm: (message: string, onConfirm: () => void, onCancel?: () => void) => void;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error('useAlert must be used within AlertProvider');
  return context;
};

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<AlertType>('info');

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [onConfirmCallback, setOnConfirmCallback] = useState<() => void>(() => { });
  const [onCancelCallback, setOnCancelCallback] = useState<() => void>(() => { });

  // ✅ Alert
  const showAlert = (msg: string, type: AlertType = 'info') => {
    setAlertMessage(msg);
    setAlertType(type);
    setAlertOpen(true);
  };

  // ✅ Confirm
  const showConfirm = (msg: string, onConfirm: () => void, onCancel?: () => void) => {
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

      {/* ✅ Snackbar for alerts (top-right corner) */}
      <Snackbar
        open={alertOpen}
        autoHideDuration={4000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MuiAlert
          onClose={() => setAlertOpen(false)}
          severity={alertType}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {alertMessage}
        </MuiAlert>
      </Snackbar>

      {/* ✅ Confirm modal (centered) */}
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
              position: 'absolute' as const,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: '#fff',
              borderRadius: 3,
              boxShadow: 24,
              p: 3,
              minWidth: 320,
              textAlign: 'center',
            }}
          >
            <Customtext
              fieldName={'Leave this page?'}
              sx={{
                mb: 2, fontSize: {
                  xs: '0.875rem', // 14px
                  sm: '1rem',     // 16px
                  md: '1.125rem', // 18px
                  lg: '1.125rem',  // 20px
                  xl: '1.5rem',   // 24px
                },
                color: theme.palette.text.primary,
              }}
            />
            <Customtext
              fieldName={confirmMessage}
              sx={{
                mb: 3,
                fontSize: {
                  xs: '0.875rem', // 14px
                  sm: '1rem',     // 16px
                  md: '1.125rem', // 18px
                  lg: '1rem',  // 20px
                  xl: '1.5rem',   // 24px
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
                    borderColor: theme.palette.primary.main,
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
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: theme.palette.error.main,
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
