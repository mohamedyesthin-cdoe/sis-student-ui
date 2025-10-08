import React from "react";
import { Box, Chip, Container, Divider, FormControl, Grid, IconButton, MenuItem, Select, Typography } from "@mui/material";
import theme from "../../styles/theme";
import userBg from '/assets/images/bgpanel.jpg';
import dayjs, { Dayjs } from 'dayjs';
import CardComponent from "../../components/card/Card";
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { FaclitiesData, FeesData, NoticePeriodData, QuickLinksData } from "./cardData";
import { EventData } from "./cardData";
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from "@mui/lab";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useRef } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
const Dashboard: React.FC = () => {

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300; // adjust scroll distance
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const [selectedRange, setSelectedRange] = React.useState("1st Quarter");
  const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-17'));


  // const [selectedRangeChart, setSelectedRangeChart] = React.useState("1st Quarter");

  // Sample data
  const subjects = ["Mat", "Phy", "Che", "Eng", "Sci"];
  const marks = [50, 92, 90, 82, 90];

  return (
    <Container>
      <CardComponent
        sx={{
          backgroundColor: theme.palette.text.primary,
          color: "white",
          p: 3,
          backgroundImage: `url(${userBg})`,
          backgroundPosition: 'right',
          my: 3
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

      <CardComponent p={2} sx={{ mb: 3, mt: 4, boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography fontWeight="bold" variant="body2" lineHeight={1}>
            Class Faculties
          </Typography>

          {/* Scroll buttons only for large screens */}
          <Box
            display={{ xs: 'none', md: 'flex' }}
            alignItems="center"
            gap={1}
          >
            <IconButton
              size="small"
              onClick={() => scroll("left")}
              sx={{
                color: theme.palette.secondary.main,
                backgroundColor: theme.palette.action.hover,
                "&:hover": { backgroundColor: theme.palette.action.selected },
              }}
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => scroll("right")}
              sx={{
                color: theme.palette.secondary.main,
                backgroundColor: theme.palette.action.hover,
                "&:hover": { backgroundColor: theme.palette.action.selected },
              }}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Responsive card container */}
        <Box
          ref={scrollRef}
          sx={{
            display: 'flex',
            flexWrap: { xs: 'wrap', md: 'nowrap' }, // wrap on small screens, no-wrap on desktop
            overflowX: { xs: 'visible', md: 'auto' }, // scroll only on desktop
            scrollBehavior: 'smooth',
            gap: 2,
            pb: 1,
            "&::-webkit-scrollbar": { display: 'none' },
          }}
        >
          {FaclitiesData.map((card, index) => (
            <CardComponent
              key={index}
              p={2}
              sx={{
                minWidth: { xs: '100%', sm: 260 }, // full width on mobile, fixed on tablet+
                flex: { xs: '1 1 100%', md: '0 0 auto' }, // responsive flex
                backgroundColor: 'white',
                borderRadius: 3,
                border: `2px solid ${theme.palette.background.default}`,
                boxShadow: 'none',
              }}
            >
              {/* Card content */}
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center">
                  <img
                    src={card.icon}
                    alt={card.title}
                    style={{
                      width: 50,
                      height: 50,
                      backgroundColor: theme.palette.background.default,
                      borderRadius: 5,
                    }}
                  />
                  <Box ml={2}>
                    <Typography fontWeight={600} variant="body2">
                      {card.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {card.subject}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={1}>
                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  sx={{
                    border: `1px solid ${theme.palette.background.default}`,
                    p: 1,
                    borderRadius: 1,
                    flex: '1 1 45%', // wrap actions nicely on small screens
                  }}
                >
                  {card.icon1}
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {card.action1}
                  </Typography>
                </Box>

                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  sx={{
                    border: `1px solid ${theme.palette.background.default}`,
                    p: 1,
                    borderRadius: 1,
                    flex: '1 1 45%',
                  }}
                >
                  {card.icon2}
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {card.action2}
                  </Typography>
                </Box>
              </Box>
            </CardComponent>
          ))}
        </Box>
      </CardComponent>


      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }} my={2}
          sx={{ backgroundColor: "white", borderRadius: 3, p: 2, boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
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
        <Grid spacing={2} size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }} my={2}
          sx={{
            backgroundColor: "white",
            borderRadius: 3,
            p: 2,
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          }}>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography fontWeight="bold" variant="body2" lineHeight={1}>
              Exam Result
            </Typography>
            <FormControl size="small">
              <Select
                value={selectedRange}
                onChange={(e) => setSelectedRange(e.target.value)}
                displayEmpty
                sx={{
                  fontSize: "0.8125rem",
                  fontWeight: "bold",
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                  color: theme.palette.secondary.main,
                }}
                renderValue={(value) => (
                  <Box display="flex" alignItems="center">
                    <CalendarTodayIcon
                      sx={{ fontSize: 16, mr: 0.5, color: theme.palette.secondary.main }}
                    />
                    {value}
                  </Box>
                )}
              >
                <MenuItem value="1st Quarter" sx={{ fontSize: "0.75rem" }}>
                  1st Quarter
                </MenuItem>
                <MenuItem value="2nd Quarter" sx={{ fontSize: "0.75rem" }}>
                  2nd Quarter
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Divider />

          {/* Chart */}
          <Box mt={2} width="100%">
            {/* Bar Chart */}
            <BarChart
              xAxis={[
                {
                  data: subjects,
                  scaleType: "band",
                  tickLabelStyle: { fontSize: 12 },
                },
              ]}
              series={[
                {
                  data: marks,
                  color: "#3b82f6",
                  valueFormatter: (value) => `${value}%`,
                },
              ]}
              margin={{ top: 20, right: 10, bottom: 5, left: -10 }}
              height={300}
              sx={{
                width: "100%", // full width
                "& .MuiChartsAxis-tickLabel": { fontSize: 12, fill: "#555" },
                "& .MuiChartsAxis-line": { stroke: "#ccc" },
              }}
            />
          </Box>

        </Grid>

        <Grid container spacing={2} size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }} my={2}>
          <Grid sx={{ width: '100%', backgroundColor: 'white', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', p: 2.5, borderRadius: 3 }} >
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography fontWeight="bold" variant="body2" lineHeight={1}>
                Fees Reminder
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
            <Box mt={5}>
              {FeesData.map((card) => (
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Box display="flex">
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
                    <Box ml={1}>
                      <Typography fontWeight={600} variant="body2">
                        {card.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ color: theme.palette.text.primary }}>
                        {card.value}
                      </Typography>
                    </Box>
                  </Box>
                  <Box textAlign="end">
                    <Typography fontWeight={600} variant="body2">
                      Last Date
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ color: theme.palette.text.primary }}>
                      {card.date}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }} my={2}
          container
          direction="column"
          spacing={2}
          p={3}
          sx={{ backgroundColor: "white", borderRadius: 3, boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', }}
        >
          <Typography fontWeight="bold" variant="body2" lineHeight={1}>
            Upcoming Exams
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
                  mb: 1
                }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography fontWeight={600} variant="body2">
                    {card.title}
                  </Typography>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{
                      color:
                        'white', p: 1, backgroundColor: theme.palette.primary.main, borderRadius: 3
                    }}>
                      {card.titleday}
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                  <Typography fontWeight={600} variant="body2">
                    {card.subtitle}
                  </Typography>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {card.subtitleday}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" justifyContent="space-between" my={1}>
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
                    <Typography variant="caption" fontWeight='bold'>
                      Room No : {card.roomno}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Grid
          size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }}
          sx={{
            backgroundColor: "white",
            borderRadius: 3,
            p: 2,
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          }} my={2}
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

        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }} my={2}
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
            sx={{ mt: 8 }}
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
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
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
    </Container>


  );
};

export default Dashboard;
