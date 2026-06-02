import { Alert, Box } from "@mui/material";

function ErrorMessage({
  message = "Something went wrong.",
}) {
  return (
    <Box sx={{ my: 2 }}>
      <Alert severity="error">
        {message}
      </Alert>
    </Box>
  );
}

export default ErrorMessage;