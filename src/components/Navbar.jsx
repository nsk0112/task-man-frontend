import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggle } from "../redux/Sidebar/sidebarSlice";
import { logout } from "../redux/Login/authSlice";
import { useEffect, useState } from "react";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import { Button, ListItemButton, Stack } from "@mui/material";
import { Link } from "react-router-dom";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const matches = useMediaQuery("(min-width:1400px)");
  const is_open = useSelector((state) => state.sidebar.is_open);
  const user = useSelector((state) => state.auth.user);

  // const [anchorEl, setAnchorEl] = useState(null);

  const token = useSelector((state) => state.auth.token);
  // const token = window.localStorage.getItem("user-token");
  const is_admin = window.localStorage.getItem("is_admin");

  const handleLogout = (event) => {
    localStorage.clear();
    dispatch(logout());
    navigate("/login");
  };

  const defaultTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#a78295",
      },
      secondary: {
        main: "#f50057",
      },
      background: {
        default: "#2f1b29",
      },
    },
  });

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            {user.is_admin && !matches && (
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={() => dispatch(toggle())}
              >
                <MenuIcon />
              </IconButton>
            )}
            {((user.firstname && matches && user.is_admin) ||
              (user.firstname && !user.is_admin)) && (
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <ListItemButton
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  component={Link}
                  to="/profile"
                >
                  <PersonIcon></PersonIcon>
                  <Typography sx={{ color: "white", marginLeft: "15px" }}>
                    Welcome, {user.firstname}
                  </Typography>
                </ListItemButton>
              </Stack>
            )}
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Project Management
            </Typography>
            {token && (
              <div>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleLogout}
                  color="inherit"
                >
                  <LogoutIcon />
                </IconButton>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </ThemeProvider>
  );
}

export default Navbar;
