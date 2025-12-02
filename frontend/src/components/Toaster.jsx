import React from "react";
import { Toaster as HotToaster } from "react-hot-toast";
import { useTheme } from "@mui/material/styles";

const Toaster = () => {
  const theme = useTheme();

  return (
    <HotToaster
      position="top-center"
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          padding: "12px 16px",
          borderRadius: "8px",
          fontSize: "0.9375rem",
          boxShadow: theme.shadows[3],
          maxWidth: "500px",
        },

        // SUCCESS TOAST
        success: {
          duration: 3000,
          style: {
            background: theme.palette.success.main,
            color: theme.palette.success.contrastText,
          },
          iconTheme: {
            primary: theme.palette.success.contrastText,
            secondary: theme.palette.success.main,
          },
        },

        // ERROR TOAST
        error: {
          duration: 5000,
          style: {
            background: theme.palette.error.main,
            color: theme.palette.error.contrastText,
          },
          iconTheme: {
            primary: theme.palette.error.contrastText,
            secondary: theme.palette.error.main,
          },
        },

        // LOADING TOAST
        loading: {
          style: {
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
            boxShadow: theme.shadows[3],
          },
        },
      }}
    />
  );
};

export default Toaster;
