import React from "react";
import { Box, Chip, Divider, Grid, Typography } from "@mui/material";
import theme from "../../styles/theme";
import LoopIcon from '@mui/icons-material/Loop';
import userBg from '../../assets/images/bgpanel.jpg';
import dayjs, { Dayjs } from 'dayjs';
import CardComponent from "../../components/card/Card";
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { cardData } from "./cardData";
import AddIcon from '@mui/icons-material/Add';


const Dashboard: React.FC = () => {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-17'));
  return (
    <Box>
      <CardComponent
        sx={{
          backgroundColor: "#2d2d2d",
          color: "white",
          p: 3,
          backgroundImage: `url(${userBg})`,
          backgroundPosition: 'right'
        }}
        className="d-flex align-items-xl-center justify-content-xl-between flex-xl-row flex-column p-4 my-3">

        <Box>
          <Typography variant="h5" fontWeight={600}>
            Welcome Back, Jiya!
          </Typography>
          <Typography variant="body2">Have a Good day at work</Typography>
        </Box>
        <Box>
          <Typography
            variant="caption"
            sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}
          >
            Updated Recently on 15 Jun 2024
          </Typography>
        </Box>
      </CardComponent>

      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} my={4}>
        {cardData.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 6, lg: 3, xl: 3 }} my={1} sx={{ backgroundColor: "white", borderRadius: 3, p: 2, boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center">
                <img
                  src={card.icon}
                  alt={card.title}
                  style={{ width: 50, height: 50, backgroundColor: theme.palette.background.default, borderRadius: 3, padding: 3 }}
                />
                <Box ml={2}>
                  <Typography fontWeight={600} variant="h5">
                    {card.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.title}
                  </Typography>
                </Box>
              </Box>
              <Chip label={card.percentage} sx={{ backgroundColor: card.color, color: theme.palette.background.paper }} />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <Typography variant="body2" color="text.secondary" pr={1}>
                  Active :
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {card.active}
                </Typography>
              </Box>
              <Box display="flex">
                <Typography variant="body2" color="text.secondary" pr={1}>
                  Inactive :
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {card.inactive}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} my={2}>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }}
          sx={{ backgroundColor: "white", borderRadius: 3, p: 2, boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', }}>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }}
          sx={{ backgroundColor: "white", borderRadius: 3, p: 2, boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', }}>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }}
          sx={{ backgroundColor: "white", borderRadius: 3, p: 2, boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DateCalendar']}>
              <DemoItem
                sx={{
                  padding: 0, // remove DemoItem padding
                  '& .MuiTypography-root': { margin: 0, lineHeight: 1 }, // remove label spacing
                }}
                label={
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography fontWeight="bold" variant="body2" lineHeight={1}>
                      Schedules
                    </Typography>
                    <Box display="flex" alignItems="center" sx={{ cursor: 'pointer', color: '#105c8e' }}>
                      <AddIcon fontSize="small" />
                      <Typography ml={0.5} fontWeight="600" variant="body2">Add New</Typography>
                    </Box>
                  </Box>
                }
              >
                <Divider sx={{ my: 0.5 }} />
                <DateCalendar
                  value={value}
                  onChange={(newValue: any) => setValue(newValue)}
                />
              </DemoItem>
            </DemoContainer>
          </LocalizationProvider>
        </Grid>
      </Grid>


      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} my={2}>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }}
          sx={{ backgroundColor: "white", borderRadius: 3, p: 2, boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', }}>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }}
          sx={{ backgroundColor: "white", borderRadius: 3, p: 2, boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', }}>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }}
          sx={{ backgroundColor: "white", borderRadius: 3, p: 2, boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
            <Box sx={{borderLeft:5,p:3}}>

            </Box>
        </Grid>
      </Grid>
    </Box>


  );
};

export default Dashboard;
