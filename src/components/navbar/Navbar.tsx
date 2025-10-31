import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Popover,
  Button,
  Typography,
  Divider,
  TextField,
  InputAdornment,
  Box,
} from '@mui/material';
import {
  Search as SearchIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
// import {
//   Notifications as NotificationsIcon,
//   Search as SearchIcon,
//   Menu as MenuIcon,
// } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close'

import NotificationsDrawer from '../drawer/drawer';
import { useNavigate } from 'react-router-dom';
import { getValue, removeSingleValue } from '../../utils/localStorageUtil';
import maleimage from '/assets/images/male-logo.jpg'
import femaleimage from '/assets/images/female-logo.jpg'
import theme from '../../styles/theme';
type NavbarProps = {
  onHamburgerClick?: () => void; // optional callback
};
export default function Navbar({ onHamburgerClick }: NavbarProps) {
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [languageAnchorEl, setLanguageAnchorEl] = useState(null);
  const [notificationsDrawerOpen, setNotificationsDrawerOpen] = useState(false);

  // const handleNotificationClick = (event: any) => setNotificationAnchorEl(event.currentTarget);
  const handleNotificationClose = () => setNotificationAnchorEl(null);

  const handleLanguageClose = () => setLanguageAnchorEl(null);

  const handleNotificationsDrawerOpen = () => setNotificationsDrawerOpen(true);
  const handleNotificationsDrawerClose = () => setNotificationsDrawerOpen(false);

  const notificationPopoverOpen = Boolean(notificationAnchorEl);
  const languagePopoverOpen = Boolean(languageAnchorEl);

  const languages = [
    { label: 'Arabic', imgSrc: 'https://flagcdn.com/w40/sa.png' },
    { label: 'Germany', imgSrc: 'https://flagcdn.com/w40/de.png' },
    { label: 'English', imgSrc: 'https://flagcdn.com/w40/gb.png' },
    { label: 'Spanish', imgSrc: 'https://flagcdn.com/w40/es.png' },
  ];

  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const handleSelectLanguage = (label: any) => {
    setSelectedLanguage(label);
  };


  const [profileAnchorEl, setProfileAnchorEl] = useState(null);

  const handleProfileClick = (event: any) => setProfileAnchorEl(event.currentTarget);
  const handleProfileClose = () => setProfileAnchorEl(null);

  const profilePopoverOpen = Boolean(profileAnchorEl);
  const navigate = useNavigate();
  const clearLocalStorage = () => {
    removeSingleValue('ACCESS_TOKEN_KEY');
    removeSingleValue('email');
    removeSingleValue('rollid');
    removeSingleValue('username');
    removeSingleValue('student_id');
    navigate("/login");
  };
  const username = getValue('username')
  const email = getValue('email')
  const rollid = Number(getValue("rollid"));
  const gender = getValue("gender");

  const userimage = gender == 'Male' ? maleimage :femaleimage

  return (
    <>
      <AppBar position="static" elevation={2} className="bg-white border-b border-gray-200 shadow-sm">
        <Toolbar className="flex flex-wrap md:flex-nowrap justify-between items-center p-3">
          {/* Left Section: Hamburger + Search + Avatar */}
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

            {/* Avatar (mobile view: inside left section) */}
            <div className='md:hidden'>
              <IconButton
                onClick={handleProfileClick}
                sx={{ p: 0 }}
              >
                <Avatar
                  alt="User Avatar"
                  src={userimage}
                  sx={{ width: 40, height: 40, border: `2px solid ${theme.palette.secondary.main}` }}
                />
              </IconButton>
            </div>
          </Box>

          {/* Right Section: Avatar (desktop only) */}
          <Box className="hidden md:flex items-center space-x-3">
            <IconButton onClick={handleProfileClick} sx={{ p: 0 }}>
              <Avatar
                alt="User Avatar"
                src={userimage}
                sx={{ width: 40, height: 40, border: '2px solid #105c8e' }}
              />
            </IconButton>
          </Box>
        </Toolbar>

      </AppBar>


      <Popover
        open={notificationPopoverOpen}
        anchorEl={notificationAnchorEl}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          className: 'rounded-lg shadow-lg w-[340px] border border-gray-300',
        }}
      >
        <Box className="bg-white flex flex-col max-h-[340px]">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            pl={2}
            py={1}
            bgcolor="secondary.main"
            color="white"
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
              Notifications Summary
            </Typography>

            <IconButton onClick={handleNotificationClose} sx={{ color: 'white' }}>
              <CloseIcon fontSize="medium" />
            </IconButton>
          </Box>

          <Divider className="my-2" />

          <Box className="flex-1 overflow-auto p-2">
            {[
              { avatarText: 'AB', message: 'Ashwin requested access to Design File.', extra: '📁 Design brief...', time: '2 mins ago' },
              { avatarText: 'P', message: 'Patrick added a comment.', extra: '', time: '5 mins ago' },
              { avatarText: 'PR', message: 'New version of Project Roadmap uploaded.', extra: '', time: '10 mins ago' },
            ].map((item, index) => (
              <Box key={index} className="flex items-start space-x-3 py-3 px-2 rounded hover:bg-gray-100 transition-colors">
                <Avatar className="w-10 h-10 bg-gray-300 text-gray-600 text-xs">{item.avatarText}</Avatar>
                <Box className="flex-1">
                  <Typography className="font-medium text-gray-800 text-sm">{item.message}</Typography>
                  {item.extra && <Box className="flex items-center text-gray-600 text-xs mt-1">{item.extra}</Box>}
                  <Typography className="text-xs text-gray-400 mt-1">{item.time}</Typography>
                </Box>
              </Box>
            ))}
          </Box>

          <Divider className="my-2" />

          <Box className="text-center p-2 mb-2">
            <Button variant="outlined" color='secondary' size="small" onClick={() => {
              handleNotificationsDrawerOpen();
              handleNotificationClose();
            }}>
              View All Notifications
            </Button>
          </Box>
        </Box>
      </Popover>

      {/* Language Selection Popover */}
      <Popover
        open={languagePopoverOpen}
        anchorEl={languageAnchorEl}
        onClose={handleLanguageClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          className: 'rounded-lg shadow-lg w-[240px] border border-gray-300',
        }}
      >
        <Box className="bg-white flex flex-col p-3 space-y-2">
          {languages.map((item, index) => (
            <Box
              key={index}
              className={`flex items-center space-x-3 p-2 rounded cursor-pointer ${selectedLanguage === item.label ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
              onClick={() => handleSelectLanguage(item.label)}
            >
              <img src={item.imgSrc} alt={item.label} className="w-8 h-8 rounded-full" />
              <Typography className="font-medium text-gray-800">{item.label}</Typography>
            </Box>
          ))}
        </Box>
      </Popover>

      <Popover
        open={profilePopoverOpen}
        anchorEl={profileAnchorEl}
        onClose={handleProfileClose}  // Just close the popover
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
              <Typography className="font-bold text-lg" sx={{ textTransform: 'capitalize' }}>{username}</Typography>
              <Typography
                className="text-gray-500 text-sm"
                sx={{
                  wordBreak: "break-word",
                  whiteSpace: "normal"
                }}
              >
                {email}
              </Typography>

            </Box>
          </Box>

          <Divider />

          {/* {[
                { label: 'Account Settings', icon: '⚙️' },
                { label: 'Upgrade Plan', icon: '📊' },
                { label: 'Daily Activity', icon: '📈' },
                { label: 'Inbox', icon: '💬' },
                { label: 'Email', icon: '✉️' },
              ].map((item, index) => (
                <Box key={index} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-100 cursor-pointer">
                  <span className="text-xl">{item.icon}</span>
                  <Typography className="text-gray-800 font-medium">{item.label}</Typography>
                </Box>
              ))} */}

          <Divider />

          <Button
            variant="outlined"
            color="error"
            fullWidth
            onClick={() => {
              clearLocalStorage();  // Only now log out
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
