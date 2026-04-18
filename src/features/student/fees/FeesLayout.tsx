import React, { useEffect, useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import PendingPaymentTab from "./PendingPaymentTab";
import { apiRequest } from "../../../utils/ApiRequest";
import { ApiRoutes } from "../../../constants/ApiConstants";
import { getValue } from "../../../utils/localStorageUtil";
import FeesDetail from "./Feesdetail";

interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props;

  return (
    <div hidden={value !== index}>
      {value === index && (
        <Box sx={{ mt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function FeesLayout() {
  const student_id = getValue("student_id");

  const [tabValue, setTabValue] = useState(0);

  const [pendingPayment, setPendingPayment] =
    useState<any>(null);

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setTabValue(newValue);
    console.log(event);

  };

  /*
  -----------------------------------------
  Fetch Pending Payment Status
  -----------------------------------------
  */
  const fetchPendingPayment = async () => {
    try {
      const response = await apiRequest({
        url: `${ApiRoutes.GETPEDNINGPAYMENT}/${student_id}/pending-payment`,
        method: "get",
      });

      if (
        response?.workflow_enabled &&
        response?.pending_payment_due
      ) {
        setPendingPayment(response);
      } else {
        setPendingPayment(null);
        setTabValue(0);
      }
    } catch (error) {
      console.error(
        "Pending payment fetch failed",
        error
      );
    }
  };

  useEffect(() => {
    if (student_id) fetchPendingPayment();

    // const interval = setInterval(() => {
    //   if (student_id) fetchPendingPayment();
    // }, 15000);

    // return () => clearInterval(interval);
  }, [student_id]);



  return (
    <Box>
      <Tabs
        value={tabValue}
        onChange={handleChange}
        sx={{ mb: 2 }}
      >
        <Tab label="Fees Details" />
        {/* hide temporary this tab */}
        
        {/* {pendingPayment && (
          <Tab label="Payment Due" />
        )} */}
      </Tabs>

      {/* Fees Details Tab */}

      <TabPanel value={tabValue} index={0}>
        <FeesDetail />
      </TabPanel>

      {/* Pending Payment Tab */}

      {pendingPayment && (
        <TabPanel value={tabValue} index={1}>
          <PendingPaymentTab
            data={pendingPayment}
          />
        </TabPanel>
      )}
    </Box>
  );
}