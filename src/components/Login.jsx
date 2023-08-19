import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/Login/authSlice";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Snackbar from "@mui/material/Snackbar";
import { createTheme, ThemeProvider } from "@mui/material/styles";

function Login() {
  const [sbOpen, setSbOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const {token, is_admin} = useSelector((state) => state.auth);
  const vertical = "bottom";
  const horizontal = "center";

  const x = useSelector((state) => state.auth.is_admin);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSbOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: (values) => {
      axios
        .post("http://localhost:8000/login", {
          username: values.username,
          password: values.password,
        })

        .then((response) => {
          if (!response.data.success) {
            setSbOpen(true);
          } else {
            // window.localStorage.setItem("user-token", response.data.token);
            // window.localStorage.setItem(
            //   "is_admin",
            //   response.data.user.is_admin
            // );

            const usertoken = response.data.token;
            const is_admin = response.data.user.is_admin;
            const user = response.data.user;

            let date = new Date();
            date.setHours(date.getHours(), date.getMinutes()+1, 0, 0);

            dispatch(
              login({ is_admin: is_admin, token: usertoken, user: user, autoLogout: date })
            );

            const id = response.data.user.id;



            if (is_admin) navigate("/users");
            else navigate(`/projects/${id}`);
          }
        });
    },
  });

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
        maxWidth="xs"
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CssBaseline />
          <Navbar />

          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>

            <Snackbar
              autoHideDuration={5000}
              open={sbOpen}
              onClose={handleClose}
              message="Invalid credentials. Please try again."
              anchorOrigin={{ vertical, horizontal }}
            />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Login;
