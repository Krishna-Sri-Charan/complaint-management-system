import { Box, CircularProgress, Typography } from "@mui/material";

function CommonLoader({ message = "Loading..." }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "300px",
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}

export default CommonLoader;