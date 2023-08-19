import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import GroupsIcon from "@mui/icons-material/Groups";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Box from "@mui/material/Box";
import {
  Container,
  CssBaseline,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import Navbar from "./Navbar";
import { useLocation } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import PersonIcon from "@mui/icons-material/Person";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { toggle } from "../redux/Sidebar/sidebarSlice";

function AdminSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  let matches = useMediaQuery("(min-width:1400px)");
  const is_open = useSelector((state) => state.sidebar.is_open);
  const user = useSelector((state) => state.auth.user);
  const { pathname } = location;
  const [openSidebar, setOpenSidebar] = useState(matches);

  useEffect(() => {
    setOpenSidebar(matches || (is_open && !matches));
  }, [is_open, matches]);

  useEffect(() => {
    if (!matches) {
      setOpenSidebar(false);
      // matches = !matches;
    }
  }, [matches]);

  const drawerWidth = 240;

  return (
    openSidebar && (
      <Container
        sx={{
          width: drawerWidth,
        }}
      >
        <Box>
          <CssBaseline />
          <Navbar />

          <Drawer
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
                height: "100%",
                // zIndex: "-1",
              },
            }}
            variant="permanent"
            anchor="left"
          >
            <Box
              sx={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                marginTop: 8
              }}
            >
              {!matches && (
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  width="85%"
                >
                  <ListItemButton
                    sx={{ display: "flex", justifyContent: "space-between", width: "207 px" }}
                    component="a"
                    href={"/profile"}
                  >
                    <PersonIcon></PersonIcon>

                    <Typography sx={{ color: "white", marginLeft: "15px" }}>
                      Welcome, {user.firstname}
                    </Typography>
                  </ListItemButton>
                </Stack>
              )}
              <List >
                <ListItem>
                  <ListItemButton
                    component="a"
                    href="/users"
                    sx={{
                      backgroundColor:
                        pathname == "/users" ? "#252525" : "#121212",
                    }}
                    onClick={() => dispatch(toggle())}
                  >
                    <ListItemIcon>
                      <GroupsIcon />
                    </ListItemIcon>
                    <ListItemText primary="USER LIST MANAGEMENT" />
                  </ListItemButton>
                </ListItem>

                <Divider />

                <ListItem>
                  <ListItemButton
                    component="a"
                    href="/projects"
                    sx={{
                      backgroundColor:
                        pathname == "/projects" ? "#252525" : "#121212",
                    }}
                    onClick={() => dispatch(toggle())}
                  >
                    <ListItemIcon>
                      <AssignmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="PROJECT MANAGEMENT" />
                  </ListItemButton>
                </ListItem>
              </List>
            </Box>
          </Drawer>
        </Box>
      </Container>
    )
  );
}

export default AdminSidebar;
