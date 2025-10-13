import React from "react";
import { Box, Chip, Divider, FormControl, Grid, MenuItem, Select, Typography } from "@mui/material";
import theme from "../../styles/theme";
import userBg from '/assets/images/bgpanel.jpg';
import dayjs, { Dayjs } from 'dayjs';
import CardComponent from "../../components/card/Card";
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { cardData, NoticePeriodData, QuickLinksData } from "./cardData";
import { EventData } from "./cardData";
import AddIcon from '@mui/icons-material/Add';
import Chart from "react-apexcharts";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import type { ApexOptions } from "apexcharts";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from "@mui/lab";
import { getValue } from "../../utils/localStorageUtil";
const DashboardAdmin: React.FC = () => {
  const series = [44, 55];

  const options: ApexOptions = {
    labels: ["Collected Fee", "Total Fee"],
    colors: [theme.palette.secondary.main, theme.palette.primary.main],
    legend: {
      position: "bottom", // literal type
      horizontalAlign: "center",
      fontSize: "14px",
      markers: {
        size: 6,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
        },
      },
    },
  }

  const [selectedRange, setSelectedRange] = React.useState("Last 8 Quarter");
  const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-17'));
  const username = getValue('username')
  return (
    <Box>
      <CardComponent
        sx={{
          backgroundColor: theme.palette.text.primary,
          color: "white",
          p: 3,
          backgroundImage: `url(${userBg})`,
          backgroundPosition: 'right'
        }}
        className="d-flex align-items-xl-center justify-content-xl-between flex-xl-row flex-column p-4 my-3">

        <Box>
          <Typography variant="h5" fontWeight={600} sx={{ textTransform: 'capitalize' }}>
            Welcome Back, {username}!
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
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DateCalendar']}>
              <DemoItem
                sx={{
                  padding: 0, // remove DemoItem padding
                  '& .MuiTypography-root': { margin: 0, lineHeight: 1 }, // remove label spacing
                }}
                label={
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography fontWeight="bold" variant="body2" lineHeight={1}>
                      Schedules
                    </Typography>
                    <Box display="flex" alignItems="center" sx={{ cursor: 'pointer', color: theme.palette.secondary.main }}>
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
        <Grid
          size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }}
          sx={{
            backgroundColor: "white",
            borderRadius: 3,
            p: 2,
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Header with title and dropdown */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography fontWeight="bold" variant="body2" lineHeight={1}>
              Fees Collection
            </Typography>
            <FormControl size="small">
              <Select
                value={selectedRange}
                onChange={(e) => setSelectedRange(e.target.value)}
                displayEmpty
                sx={{
                  fontSize: "0.8125rem", // ~13px
                  fontWeight: 'bold',
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  color: theme.palette.secondary.main,
                }}

                renderValue={(value) => (
                  <Box display="flex" alignItems="center">
                    <CalendarTodayIcon sx={{ fontSize: 16, mr: 0.5, color: theme.palette.secondary.main }} />
                    {value}
                  </Box>
                )}
              >
                <MenuItem value="This Month" sx={{ fontSize: "0.75rem" }}>This Month</MenuItem>
                <MenuItem value="This Year" sx={{ fontSize: "0.75rem" }}>This Year</MenuItem>
                <MenuItem value="Last 8 Quarter" sx={{ fontSize: "0.75rem" }}>Last 8 Quarter</MenuItem>
                <MenuItem value="Last 12 Quarter" sx={{ fontSize: "0.75rem" }}>Last 12 Quarter</MenuItem>
                <MenuItem value="Last 16 Quarter" sx={{ fontSize: "0.75rem" }}>Last 16 Quarter</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Divider />

          {/* Centered Donut Chart */}
          <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" mt={2}>
            <Chart options={options} series={series} type="donut" width={320} />

          </Box>
        </Grid>

        <Grid container spacing={2} size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }}>
          <Grid sx={{ width: '100%' }}>
            <Box
              sx={{
                backgroundColor: "white",
                borderRadius: 3,
                p: 2.5,
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Fees Collected
                </Typography>
                <Typography variant="body1" fontWeight="bold" sx={{ color: theme.palette.text.primary }}>
                  $25,000,02
                </Typography>
              </Box>
              <Chip
                icon={<TrendingUpIcon sx={{ fontSize: 16 }} />}
                label="1.2%"
                size="small"
                sx={{
                  backgroundColor: "#e8eff5ff",
                  color: theme.palette.secondary.main,
                  fontWeight: 600,
                }}
              />
            </Box>
          </Grid>

          <Grid sx={{ width: '100%' }}>
            <Box
              sx={{
                backgroundColor: "white",
                borderRadius: 3,
                p: 2.5,
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Fine Collected till date
                </Typography>
                <Typography variant="body1" fontWeight="bold" sx={{ color: theme.palette.text.primary }}>
                  $4,56,64
                </Typography>
              </Box>
              <Chip
                icon={<TrendingUpIcon sx={{ fontSize: 16 }} />}
                label="1.2%"
                size="small"
                sx={{
                  backgroundColor: "#FFEBEE",
                  color: theme.palette.error.main,
                  fontWeight: 600,
                }}
              />
            </Box>
          </Grid>

          <Grid sx={{ width: '100%' }}>
            <Box
              sx={{
                backgroundColor: "white",
                borderRadius: 3,
                p: 2.5,
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Student Not Paid
                </Typography>
                <Typography variant="body1" fontWeight="bold" sx={{ color: theme.palette.text.primary }}>
                  $545
                </Typography>
              </Box>
              <Chip
                icon={<TrendingUpIcon sx={{ fontSize: 16 }} />}
                label="1.2%"
                size="small"
                sx={{
                  backgroundColor: "#E3F2FD",
                  color: theme.palette.info.main,
                  fontWeight: 600,
                }}
              />
            </Box>
          </Grid>

          <Grid sx={{ width: '100%' }}>
            <Box
              sx={{
                backgroundColor: "white",
                borderRadius: 3,
                p: 2.5,
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Outstanding
                </Typography>
                <Typography variant="body1" fontWeight="bold" sx={{ color: theme.palette.text.primary }}>
                  $4,56,64
                </Typography>
              </Box>
              <Chip
                icon={<TrendingUpIcon sx={{ fontSize: 16 }} />}
                label="1.2%"
                size="small"
                sx={{
                  backgroundColor: "#fff5ebff",
                  color: theme.palette.warning.main,
                  fontWeight: 600,
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Grid>


      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} mt={5} mb={3}>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }}
          container
          direction="column"
          spacing={2}
          p={3}
          sx={{ backgroundColor: "white", borderRadius: 3, boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', }}
        >
          <Typography fontWeight="bold" variant="body2" lineHeight={1}>
            Upcoming Events
          </Typography>
          <Divider />

          {/* Cards stacked one by one */}
          {EventData.map((card) => (
            <Grid container spacing={2}>
              <Box
                sx={{
                  backgroundColor: "white",
                  borderRadius: 3,
                  p: 2,
                  width: "100%",
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderLeft: card.bordercolor,
                  mb: 1
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center">
                    {typeof card.icon === "string" ? (
                      <img
                        src={card.icon}
                        alt={card.title}
                        style={{
                          width: 50,
                          height: 50,
                          backgroundColor: theme.palette.background.default,
                          borderRadius: 3,
                          padding: 3,
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {card.icon}
                      </Box>
                    )}

                    <Box ml={2}>
                      <Typography fontWeight={600} variant="body2">
                        {card.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ color: theme.palette.text.primary }}>
                        {card.value}
                      </Typography>
                    </Box>
                  </Box>

                </Box>

                <Divider sx={{ my: 2 }} />

                <Box display="flex" justifyContent="space-between">
                  <Box display="flex">

                    <Typography variant="body2" sx={{ color: theme.palette.text.disabled }} pr={1} display="flex">
                      {typeof card.timeicon === "string" ? (
                        <img
                          src={card.timeicon}
                          alt={card.title}
                          style={{
                            width: 30,
                            height: 10,
                            backgroundColor: theme.palette.background.default,
                            borderRadius: 3,
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 30,
                            height: 10,
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          {card.timeicon}
                        </Box>
                      )}
                      {card.time}
                    </Typography>
                  </Box>
                  <Box display="flex">
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Grid height={450}
          size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }}
          sx={{
            backgroundColor: "white",
            borderRadius: 3,
            p: 3,
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography fontWeight="bold" variant="body2" lineHeight={1}>
              Notice Board
            </Typography>
            <Box
              display="flex"
              alignItems="center"
              sx={{ cursor: "pointer", color: theme.palette.secondary.main }}
            >
              <Typography ml={0.5} fontWeight="600" variant="body2">
                View All
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Timeline UI */}
          <Timeline
            sx={{
              m: 0,
              p: 0,
              "& .MuiTimelineItem-root:before": { flex: 0, padding: 0 },
            }}
          >
            {NoticePeriodData.map((card, index) => (
              <TimelineItem key={index}>
                {/* Left side - custom icon instead of dot */}
                <TimelineSeparator>
                  <TimelineDot
                    sx={{
                      backgroundColor: theme.palette.background.default,
                      width: 40,
                      height: 40,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                    }}
                  >
                    {card.icon}
                  </TimelineDot>

                  {index !== NoticePeriodData.length - 1 && (
                    <TimelineConnector
                      sx={{
                        backgroundColor: theme.palette.divider,
                        width: 2,
                        minHeight: 30,
                        mx: "auto",
                      }}
                    />
                  )}
                </TimelineSeparator>

                {/* Right side - content */}
                <TimelineContent sx={{ pb: 2, position: "relative", p: 0 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      position: "relative",
                    }}
                  >
                    {/* Notice text */}
                    <Box pr={8}> {/* adds spacing so text doesn’t overlap the badge */}
                      <Typography fontWeight={600} variant="body2">
                        {card.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: theme.palette.text.secondary }}
                      >
                        {card.time}
                      </Typography>
                    </Box>

                    {/* Days badge pinned to the far right */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: "50%",
                        right: 8,
                        transform: "translateY(-50%)",
                        minWidth: 60,
                        textAlign: "center",
                        borderRadius: 1,
                        backgroundColor: theme.palette.background.default,
                        px: 1,
                        py: 0.3,
                      }}
                    >
                      <Typography
                        variant="caption"
                        fontWeight={500}
                        sx={{ whiteSpace: "nowrap" }}
                      >
                        {card.days}
                      </Typography>
                    </Box>
                  </Box>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }}
          height={370}
          sx={{ backgroundColor: "white", borderRadius: 3, p: 2, boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography fontWeight="bold" variant="body2" lineHeight={1}>
              Quick Links
            </Typography>
          </Box>

          <Divider sx={{ mb: 2, mt: 3 }} />

          <Grid
            container
            alignItems="center"
            justifyContent="center"
            spacing={6}
            sx={{ mt: 3 }}
          >
            {QuickLinksData.map((card) => (
              <Grid
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                sx={{
                  backgroundColor: "white",
                  borderRadius: 3,
                  p: 2,
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  width: 120
                }}
              >
                {typeof card.icon === "string" ? (
                  <img
                    src={card.icon}
                    alt={card.title}
                    style={{
                      width: 50,
                      height: 50,
                      backgroundColor: theme.palette.background.default,
                      borderRadius: 3,
                      padding: 3,
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {card.icon}
                  </Box>
                )}
                <Typography variant="body2" textAlign="center">
                  {card.title}
                </Typography>
              </Grid>
            ))}
          </Grid>

        </Grid>
      </Grid>
    </Box>


  );
};

export default DashboardAdmin;
