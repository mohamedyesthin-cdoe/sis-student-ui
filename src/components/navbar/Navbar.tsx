import { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Popover,
  Button,
  Divider,
  TextField,
  InputAdornment,
  Box,
  Tooltip,
} from '@mui/material';
import { Search as SearchIcon, Menu as MenuIcon } from '@mui/icons-material';
import NotificationsDrawer from '../drawer/drawer';
import { useNavigate } from 'react-router-dom';
import { getValue, removeSingleValue } from '../../utils/localStorageUtil';
import maleimage from '/assets/images/male-logo.jpg';
import femaleimage from '/assets/images/female-logo.jpg';
import theme from '../../styles/theme';
import Customtext from '../customtext/Customtext';

type NavbarProps = {
  onHamburgerClick?: () => void; // optional callback
};

export default function Navbar({ onHamburgerClick }: NavbarProps) {
  // const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  // const [languageAnchorEl, setLanguageAnchorEl] = useState(null);
  const [notificationsDrawerOpen, setNotificationsDrawerOpen] = useState(false);
  // const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const navigate = useNavigate();

  // ✅ Auto logout based on token_time
  useEffect(() => {
    const checkTokenExpiration = () => {
      const token_time = getValue('token_time'); // stored expiry time in seconds

      if (!token_time) {
        console.warn('No token_time found — redirecting to login');
        clearLocalStorage();
        return;
      }

      const expiryTime = Number(token_time);
      const currentTime = Math.floor(Date.now() / 1000);
      console.log(expiryTime < currentTime);


      if (expiryTime && expiryTime < currentTime) {
        console.warn('Token expired — logging out');
        clearLocalStorage();
      }
    };

    checkTokenExpiration(); // run immediately

    // 🔄 Recheck every 1 minute
    const interval = setInterval(checkTokenExpiration, 60000);
    return () => clearInterval(interval);
  }, [navigate]);

  const clearLocalStorage = () => {
    removeSingleValue('ACCESS_TOKEN_KEY');
    removeSingleValue('email');
    removeSingleValue('rollid');
    removeSingleValue('username');
    removeSingleValue('student_id');
    removeSingleValue('gender');
    removeSingleValue('token_time');
    navigate('/login');
  };

  const username = getValue('username');
  const email = getValue('email');
  const rollid = Number(getValue('rollid'));
  const gender = getValue('gender');
  const userimage = gender == "Female" ? femaleimage : maleimage;

  const handleProfileClick = (event: any) => setProfileAnchorEl(event.currentTarget);
  const handleProfileClose = () => setProfileAnchorEl(null);
  // const handleNotificationClose = () => setNotificationAnchorEl(null);
  // const handleLanguageClose = () => setLanguageAnchorEl(null);
  // const handleNotificationsDrawerOpen = () => setNotificationsDrawerOpen(true);
  const handleNotificationsDrawerClose = () => setNotificationsDrawerOpen(false);

  // const languages = [
  //   { label: 'Arabic', imgSrc: 'https://flagcdn.com/w40/sa.png' },
  //   { label: 'Germany', imgSrc: 'https://flagcdn.com/w40/de.png' },
  //   { label: 'English', imgSrc: 'https://flagcdn.com/w40/gb.png' },
  //   { label: 'Spanish', imgSrc: 'https://flagcdn.com/w40/es.png' },
  // ];

  return (
    <>
      <AppBar position="static" elevation={2} className="bg-white border-b border-gray-200 shadow-sm">
        <Toolbar className="flex flex-wrap md:flex-nowrap justify-between items-center p-3">
          <Box className="flex items-center w-full md:w-auto space-x-2">
            {/* Hamburger */}
            <IconButton
              onClick={onHamburgerClick}
              color="secondary"
              className="md:hidden bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg"
            >
              <MenuIcon />
            </IconButton>

            {/* Search Box */}
            {rollid === 1 && (
              <Box className="flex-grow md:w-80">
                <TextField
                  placeholder="Search..."
                  size="small"
                  variant="outlined"
                  fullWidth
                  className="bg-gray-50 rounded-lg shadow-sm"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon className="text-gray-400" />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: '10px', backgroundColor: '#f9fafb' },
                  }}
                />
              </Box>
            )}

            {/* Avatar (mobile view) */}
            <div className="md:hidden">
              <IconButton onClick={handleProfileClick} sx={{ p: 0 }}>
                <Avatar
                  alt="User Avatar"
                  src={userimage}
                  sx={{
                    width: 40,
                    height: 40,
                    border: `2px solid ${theme.palette.secondary.main}`,
                  }}
                />
              </IconButton>
            </div>
          </Box>

          {/* Avatar (desktop only) */}
          <Box className="hidden md:flex items-center space-x-3">
            <Tooltip title="Profile" placement="bottom" arrow>
              <IconButton onClick={handleProfileClick} sx={{ p: 0 }}>
                <Avatar
                  alt="User Avatar"
                  src={userimage}
                  sx={{ width: 40, height: 40, border: '2px solid #105c8e' }}
                />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Popover */}
      <Popover
        open={Boolean(profileAnchorEl)}
        anchorEl={profileAnchorEl}
        onClose={handleProfileClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          className: 'rounded-lg shadow-lg w-[300px] border border-gray-300',
        }}
      >
        <Box className="bg-white flex flex-col p-4 space-y-4">
          <Box className="flex items-center space-x-3">
            <Avatar src={userimage} className="w-12 h-12" />
            <Box>
              <Customtext
                fieldName={username}
                sx={{ textTransform: 'capitalize' }}
              />
              <Customtext
                fieldName={email}
                sx={{
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                  color:theme.palette.custom.accent
                }}
              />

            </Box>
          </Box>

          <Divider />
          <Button
            variant="outlined"
            color="error"
            fullWidth
            onClick={() => {
              clearLocalStorage();
              handleProfileClose();
              console.log('User logged out');
            }}
          >
            Logout
          </Button>
        </Box>
      </Popover>

      <NotificationsDrawer open={notificationsDrawerOpen} onClose={handleNotificationsDrawerClose} />
    </>
  );
}
