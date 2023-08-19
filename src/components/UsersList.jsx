import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { Navigate } from "react-router-dom";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Collapse,
  IconButton,
  InputAdornment,
  InputLabel,
  Select,
  Snackbar,
  Typography,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import AddIcon from "@mui/icons-material/Add";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AdminSidebar from "./AdminSidebar";
import useMediaQuery from "@mui/material/useMediaQuery";
import SearchIcon from "@mui/icons-material/Search";
import { useSelector } from "react-redux";

function UsersList() {
  const matches = useMediaQuery("(min-width:1400px)");

  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [delDialog, setDelDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [user, setUser] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [addDialog, setAddDialog] = useState(false);
  const [sbOpen, setSbOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const open = Boolean(anchorEl);

  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [search, setSearch] = useState("");

  const token = useSelector((state) => state.auth.token);
  const auth = useSelector((state) => state.auth.user.is_admin);

  const vertical = "bottom";
  const horizontal = "center";

  useEffect(() => {
    getUsers();
  }, []);

  const handleAdd = () => {
    // if (10 > password.length > 6) {
      const data = {
        username: username,
        firstname: firstname,
        lastname: lastname,
        password: password,
        is_admin: isAdmin,
        email: email,
      };

      axios.post("http://localhost:8000/api/user", data).then((response) => {
        setAddDialog(false);
        getUsers();
        if (response.data.success) {
          getUsers();
        } else {
          console.log("error");
        }
      });
    // }

    // else{
    //   setSbOpen(true);
    // }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getUsers = async () => {
    await axios
      .get(`http://localhost:8000/api/user/?token=${token}`)
      .then((res) => {
        setUsers(res.data.users);
        setAllUsers(res.data.users);
      });
  };

  const handleDelete = () => {
    const url = `http://localhost:8000/api/user/${user.id}`;
    axios
      .delete(url)
      .then((response) => {
        console.log(`Deleted user with ID ${user.id}`);
        setDelDialog(false);
        getUsers();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleEdit = () => {
    const url = `http://localhost:8000/api/user/${user.id}`;
    const data = {
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      password: user.password,
      is_admin: user.is_admin,
      email: user.email,
    };
    axios.put(url, data).then((response) => {
      console.log(`Updated user with ID ${user.id}`);
      setEditDialog(false);
      getUsers();
    });
  };

  const handleSearch = (e) => {
    if (e !== "") {
      let filter = allUsers.filter(
        (user) =>
          user.id.toString().includes(e) ||
          user.firstname.includes(e) ||
          user.lastname.includes(e) ||
          user.username.includes(e) ||
          user.email.includes(e)
      );
      setUsers(filter);
    } else {
      setUsers(allUsers);
    }
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
      {auth ? (
        <Container
          component="main"
          sx={{
            margin: 0,
            marginLeft: matches ? "240px" : "0",
            minWidth: "700px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflowY: "hidden",
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
            }}
          >
            <CssBaseline />
            <Navbar />

            <Grid
              sx={{
                width: "90%",
                minWidth: "800px",
              }}
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <AdminSidebar />

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={50}
                sx={{
                  marginBottom: "20px",
                  marginTop: "25px",
                  width: "100%",
                }}
              >
                <Typography variant="h3" gutterBottom>
                  Users
                </Typography>
                <Stack
                  direction="row"
                  justifyContent="space-around"
                  alignItems="center"
                  spacing={2}
                >
                  <Button
                    onClick={() => setChecked(!checked)}
                    variant="outlined"
                  >
                    <SearchIcon />
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => setAddDialog(true)}
                    sx={{ minWidth: "167px", overflowX: "hidden" }}
                  >
                    Add New User
                  </Button>
                </Stack>
              </Stack>

              <Collapse in={checked} fullWidth sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  sx={{ marginBottom: "20px", width: "100%" }}
                  placeholder="Search"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value.toLowerCase());
                    handleSearch(e.target.value.toLowerCase());
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                ></TextField>
              </Collapse>

              <TableContainer
                component={Paper}
                sx={{ width: "100%", maxHeight: checked ? "490px" : "550px" }}
              >
                <Table aria-label="sticky table" stickyHeader>
                  <TableHead sx={{ backgroundColor: "#222" }}>
                    <TableRow>
                      <TableCell
                        align="center"
                        sx={{ backgroundColor: "#5C445B" }}
                      >
                        Id
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ backgroundColor: "#5C445B" }}
                      >
                        Username
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ backgroundColor: "#5C445B" }}
                      >
                        Name
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ backgroundColor: "#5C445B" }}
                      >
                        Last Name
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ backgroundColor: "#5C445B" }}
                      >
                        Mail
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ backgroundColor: "#5C445B" }}
                      >
                        Role
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ backgroundColor: "#5C445B" }}
                      >
                        Edit
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users ? (
                      users.map((user) => (
                        <TableRow
                          key={user.id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                            backgroundColor: "#252525",
                            height: 80.8,
                          }}
                        >
                          <TableCell align="center">{user.id}</TableCell>
                          <TableCell align="center">{user.username}</TableCell>
                          <TableCell align="center">{user.firstname}</TableCell>
                          <TableCell align="center">{user.lastname}</TableCell>
                          <TableCell align="center">{user.email}</TableCell>
                          {user.is_admin ? (
                            <TableCell align="center">Admin</TableCell>
                          ) : (
                            <TableCell align="center">User</TableCell>
                          )}

                          {user.username == "admin" ? (
                            <TableCell align="center"></TableCell>
                          ) : (
                            <TableCell align="center">
                              <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{ mr: 2 }}
                                onClick={() => {
                                  setEditDialog(true);
                                  setUser(user);
                                }}
                              >
                                <EditIcon />
                              </IconButton>

                              <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{ mr: 2 }}
                                onClick={() => {
                                  setDelDialog(true);
                                  setUser(user);
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          )}
                        </TableRow>
                      ))
                    ) : (
                      <Navigate to="/login" replace={true} />
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Box>

          {/* Delete dialog */}
          <Dialog
            open={delDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Delete User"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are sure you want to delete user '{user.username}'?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDelDialog(false)}>No</Button>
              <Button onClick={() => handleDelete()} autoFocus>
                Yes
              </Button>
            </DialogActions>
          </Dialog>

          {/* Edit dialog */}
          <Dialog
            open={editDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Edit User"}</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="username"
                label="Username"
                type="text"
                fullWidth
                variant="standard"
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                value={user.username}
              />
              <TextField
                autoFocus
                margin="dense"
                id="firstname"
                label="First Name"
                type="text"
                fullWidth
                variant="standard"
                onChange={(e) =>
                  setUser({ ...user, firstname: e.target.value })
                }
                value={user.firstname}
              />
              <TextField
                autoFocus
                margin="dense"
                id="lastname"
                label="Last Name"
                type="text"
                fullWidth
                variant="standard"
                onChange={(e) => setUser({ ...user, lastname: e.target.value })}
                value={user.lastname}
              />
              {/* <TextField
                autoFocus
                margin="dense"
                id="password"
                label="Password"
                type="password"
                fullWidth
                variant="standard"
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                value={user.password}
              /> */}
              <Typography>Is Admin?</Typography>
              <Button
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                label="Is Admin"
                variant="outlined"
                endIcon={<KeyboardArrowDownIcon />}
              >
                {user.is_admin ? "Yes" : "No"}
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem
                  onClick={() => {
                    setUser({ ...user, is_admin: true });
                    handleClose();
                  }}
                >
                  Yes
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setUser({ ...user, is_admin: false });
                    handleClose();
                  }}
                >
                  No
                </MenuItem>
              </Menu>
              <TextField
                autoFocus
                margin="dense"
                id="email"
                label="Email Address"
                type="email"
                fullWidth
                variant="standard"
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                value={user.email}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditDialog(false)}>Cancel</Button>
              <Button onClick={() => handleEdit()} autoFocus>
                Save
              </Button>
            </DialogActions>
          </Dialog>

          {/* Add dialog */}
          <Dialog
            open={addDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            component="form"
            onSubmit={handleAdd}
          >
            <DialogTitle id="alert-dialog-title">{"Add User"}</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="username"
                label="Username"
                type="text"
                fullWidth
                variant="standard"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />
              <TextField
                autoFocus
                margin="dense"
                id="firstname"
                label="First Name"
                type="text"
                fullWidth
                variant="standard"
                onChange={(e) => setFirstname(e.target.value)}
                value={firstname}
              />
              <TextField
                autoFocus
                margin="dense"
                id="lastname"
                label="Last Name"
                type="text"
                fullWidth
                variant="standard"
                onChange={(e) => setLastname(e.target.value)}
                value={lastname}
              />
              <TextField
                autoFocus
                margin="dense"
                id="password"
                label="Password"
                type="password"
                fullWidth
                variant="standard"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />

              <InputLabel id="demo-simple-select-label">Is admin?</InputLabel>
              <Select
                value={isAdmin}
                onChange={(e) => setIsAdmin(e.target.value)}
                labelId="demo-simple-select-label"
                id="is_admin"
              >
                <MenuItem value={true}>Yes</MenuItem>
                <MenuItem value={false}>No</MenuItem>
              </Select>
              <TextField
                autoFocus
                margin="dense"
                id="email"
                label="Email Address"
                type="email"
                fullWidth
                variant="standard"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setAddDialog(false)}>Cancel</Button>
              <Button type="submit" onClick={() => handleAdd()} autoFocus>
                Save
              </Button>
            </DialogActions>
            <Snackbar
              autoHideDuration={5000}
              open={sbOpen}
              onClose={handleClose}
              message="Invalid credentials. Please try again."
              anchorOrigin={{ vertical, horizontal }}
            />
          </Dialog>
        </Container>
      ) : (
        <Container>
          <Box>
            <Navbar />
            <Typography variant="h2" sx={{ color: "white" }}>
              401 Unauthorized
            </Typography>
            <Typography variant="h4" sx={{ color: "white" }}>
              You are not authorized to view this page.
            </Typography>
          </Box>
        </Container>
      )}
    </ThemeProvider>
  );
}

export default UsersList;
