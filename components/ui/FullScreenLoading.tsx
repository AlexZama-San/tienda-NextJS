import { Box, CircularProgress, Typography } from "@mui/material"

export const FullScreenLoading = () => {
  return (
    <Box sx={{display: 'flex', flexDirection: {xs: 'column', sm: 'row'}}} justifyContent='center' alignItems='center' height='calc(100vh - 200px)' >
        <CircularProgress thickness={2} />
    </Box>
  )
}
