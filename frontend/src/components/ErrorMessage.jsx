import { Alert, Box } from "@mui/material";
import { ErrorOutline } from "@mui/icons-material";

function ErrorMessage({ message = "An unexpected processing interrupt occurred." }) {
  return (
    <Box sx={{ my: 3, width: "100%" }}>
      <Alert 
        severity="error"
        icon={<ErrorOutline fontSize="small" />}
        sx={{ 
          borderRadius: "8px", 
          fontWeight: 600,
          fontSize: "0.85rem",
          border: "1px solid #fca5a5",
          bgcolor: "#fef2f2",
          color: "#991b1b"
        }}
      >
        {message}
      </Alert>
    </Box>
  );
}

export default ErrorMessage;