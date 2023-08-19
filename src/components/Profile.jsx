import { ThemeProvider } from "@emotion/react";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  InputLabel,
  Stack,
  TextField,
  Typography,
  createTheme,
} from "@mui/material";
import Navbar from "./Navbar";
import { useDispatch, useSelector } from "react-redux";
import AdminSidebar from "./AdminSidebar";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";

function Profile() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  let matches = useMediaQuery("(min-width:1400px)");
  const vertical = "bottom";
  const horizontal = "center";

  const [password, setPassword] = useState("xxxxxxxxxx");
  const [sbOpen, setSbOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSbOpen(false);
  };

  const changePassword = () => {
    const url = `http://localhost:8000/api/user/password/${user.id}`;
    const data = { password: password };

    console.log(data);

    axios.put(url, data).then((response) => {
      console.log("Password updated successfully.");
      if(response.data.success){
        setMessage("Password updated successfully.")
      }
      else{
        setMessage("An error occured while updating password. Please try again.")
      }
    });

    setSbOpen(true);

    // dispatch(changePassword({password}));
  };

  const defaultTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#A78295",
      },
      secondary: {
        main: "#f50057",
      },
      background: {
        default: "#3F2E3E",
      },
    },
  });
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container
        component="main"
        sx={{
          margin: 0,
          marginTop: 8,
          marginLeft: user.is_admin && matches ? "270px" : "50px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          //   width: "100%",
        }}
      >
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            // justifyContent: "center",
          }}
        >
          <CssBaseline />
          <Navbar />

          {user.is_admin && <AdminSidebar />}

          <Typography variant="h3" sx={{ marginBottom: "20px" }}>
            Profile
          </Typography>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Box
              component="img"
              sx={{
                height: 250,
                width: 250,
                borderRadius: "50%",
                marginRight: "50px",
              }}
              alt="Profile icon"
              src="https://static.vecteezy.com/system/resources/previews/008/442/086/original/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
            />
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
              sx={{ width: "100%" }}
            >
              <Grid item xs={6} sm={6} md={6} sx={{ width: "100%" }}>
                <InputLabel id="username-label">Username</InputLabel>
                <TextField
                  disabled
                  fullWidth
                  value={user.username}
                  labelId="username-label"
                ></TextField>
              </Grid>
              <Grid item xs={6} sm={6} md={6}>
                <InputLabel id="lastname-label">Email</InputLabel>
                <TextField
                  disabled
                  fullWidth
                  value={user.email}
                  labelId="lastname-label"
                ></TextField>
              </Grid>
              <Grid item xs={6} sm={6} md={6}>
                <InputLabel id="firstname-label">First Name</InputLabel>
                <TextField
                  disabled
                  fullWidth
                  value={user.firstname}
                  labelId="firstname-label"
                ></TextField>
              </Grid>
              <Grid item xs={6} sm={6} md={6}>
                <InputLabel id="lastname-label">Last Name</InputLabel>
                <TextField
                  disabled
                  fullWidth
                  value={user.lastname}
                  labelId="lastname-label"
                ></TextField>
              </Grid>

              <Grid item xs={6} sm={6} md={6}>
                <InputLabel id="password-label">Password</InputLabel>
                <TextField
                  type="password"
                  fullWidth
                  value={password}
                  labelId="lastname-label"
                  onChange={(e) => setPassword(e.target.value)}
                ></TextField>
              </Grid>
              <Grid
                item
                xs={6}
                sm={6}
                md={6}
                sx={{ fontSize: "20px", display: "flex", alignItems: "center" }}
              >
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => changePassword()}
                  sx={{marginTop: "23px", height: "56px"}}
                >
                  Change Password
                </Button>
              </Grid>
            </Grid>
            <Snackbar
              autoHideDuration={5000}
              open={sbOpen}
              onClose={handleClose}
              message={message}
              anchorOrigin={{ vertical, horizontal }}
            />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Profile;
