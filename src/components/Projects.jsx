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
  Alert,
  Collapse,
  FormControl,
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
import MenuItem from "@mui/material/MenuItem";
import AdminSidebar from "./AdminSidebar";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";

import useMediaQuery from "@mui/material/useMediaQuery";
import { useSelector } from "react-redux";

function Projects() {
  const matches = useMediaQuery("(min-width:1400px)");

  const [projects, setProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [delDialog, setDelDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [addDialog, setAddDialog] = useState(false);
  const [project, setProject] = useState({});
  const [users, setUsers] = useState([]);
  const [addUser, setAddUser] = useState({});
  const [projectUsers, setProjectUsers] = useState([]);
  const [projectUsersAdd, setProjectUsersAdd] = useState([]);
  const [projectUsersDelete, setProjectUsersDelete] = useState([]);
  const [sbOpen, setSbOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [checked, setChecked] = useState(false);

  // const [pId, setPId] = useState();
  const [pTitle, setPTitle] = useState("");
  const [pDescription, setPDescription] = useState("");

  // const token2 = useSelector((state) => state.auth.token);
  // const is_admin2 = useSelector((state) => state.auth.is_admin);
  // const is_admin = window.localStorage.getItem("is_admin");
  // const token = window.localStorage.getItem("user-token");

  const token = useSelector((state) => state.auth.token);

  let selectedUsers = [];
  let x = [];

  const navigate = useNavigate();

  useEffect(() => {
    getProjects();
    getUsers();
  }, []);

  const getProjects = async () => {
    const projectsRes = await axios.get(
      `http://localhost:8000/api/projects/?token=${token}`
    );

    setProjects(projectsRes.data.projects);
    setAllProjects(projectsRes.data.projects);
  };

  const getUsers = async () => {
    await axios
      .get(`http://localhost:8000/api/user/?token=${token}`)
      .then((res) => {
        setUsers(res.data.users);
      })
      .then(() => {
        selectedUsers.forEach((project) => {
          let person = users.filter((user) => user.id == project.user_id);
          // console.log(person);
          if (!x.includes(person[0])) x.push(person[0]);
        });
        setProjectUsers(x);
      });
  };

  const getProjectsUsers = async (project2) => {
    const url = `http://localhost:8000/api/projects/${project2}`;
    selectedUsers = [];
    x = [];

    await axios.get(url).then((response) => {
      // if (response) {
      //   // selectedUsers(response.data.users)
      // }
      response.data.users.forEach((user) => {
        if (!selectedUsers.includes(user)) {
          selectedUsers.push(user);
          // setEditUsers((result) => [...result, user]);
        }
      });
    });

    // console.log(selectedUsers);

    await getUsers();
  };

  const handleDelete = () => {
    const url = `http://localhost:8000/api/projects/${project.id}`;

    // console.log(project);
    axios
      .delete(url)
      .then((response) => {
        console.log(`Deleted project with ID ${project.id}`);
        setDelDialog(false);
        getProjects();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleMenu = (event) => {
    setAddUser(event.target.value);
    // console.log(addUser);
  };

  const handleEdit = async () => {
    const editurl = `http://localhost:8000/api/projects/${project.id}`;

    const data = {
      title: project.title,
      description: project.description,
    };

    await axios.put(editurl, data).then((response) => {
      setEditDialog(false);
      getProjects();
    });

    console.log(projectUsersAdd);

    projectUsersAdd.forEach(async (user) => {
      await axios
        .post(editurl, { user_id: user.id })
        .then((res) => console.log(res));
    });

    projectUsersDelete.forEach((user) => {
      let deleteurl = `http://localhost:8000/api/projects/user/${user.id}`;

      axios
        .delete(deleteurl, { data: { project_id: project.id } })
        .then((res) => console.log(res));
    });
  };

  const handleAddUser = async (user) => {
    if (!projectUsers.includes(user)) {
      setProjectUsers([...projectUsers, user]);
    }
    if (!projectUsersAdd.includes(user)) {
      setProjectUsersAdd([...projectUsersAdd, addUser]);
    }
  };

  const handleAdd = async () => {
    const url = "http://localhost:8000/api/projects";

    let data = {
      // id: pId,
      title: pTitle,
      description: pDescription,
    };

    await axios.post(url, data).then((response) => {
      // console.log(response);
      if (response.data.message == "Project saved successfully") {
        getProjects();
        setAddDialog(false);
        // console.log("add user", addUser);
        axios.post(
          `http://localhost:8000/api/projects/${response.data.project.id}`,
          {
            user_id: addUser,
          }
        );
      } else if (response.data.message == "Project already exists") {
        setSbOpen(true);
      }
    });
  };

  const handleSearch = (e) => {
    if (e !== "") {
      let filter = allProjects.filter(
        (project) =>
          project.id.toString().includes(e) ||
          project.title.toString().includes(e) ||
          project.description.includes(e)
      );
      setProjects(filter);
    } else {
      setProjects(allProjects);
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
      <Container
        component="main"
        sx={{
          margin: 0,
          marginLeft: matches ? "240px !important" : "0",
          minWidth: "700px",
          display: "flex",
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
                Projects
              </Typography>
              <Stack
                direction="row"
                justifyContent="space-around"
                alignItems="center"
                spacing={2}
              >
                <Button onClick={() => setChecked(!checked)} variant="outlined">
                  <SearchIcon />
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setAddDialog(true)}
                  sx={{ minWidth: "167px", overflowX: "hidden" }}
                >
                  Add New Project
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
              <Table stickyHeader aria-label="sticky table">
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
                      Title
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ backgroundColor: "#5C445B" }}
                    >
                      Description
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ backgroundColor: "#5C445B" }}
                    >
                      Details
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ backgroundColor: "#5C445B" }}
                    >
                      Edit
                    </TableCell>
                    {/*<TableCell align="center">Role</TableCell>
                    <TableCell align="center">Edit</TableCell>*/}
                  </TableRow>
                </TableHead>
                {projects && (
                  <TableBody>
                    {projects.map((project) => (
                      <TableRow
                        key={project.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          backgroundColor: "#252525",
                        }}
                      >
                        <TableCell align="center">{project.id}</TableCell>
                        <TableCell align="center">{project.title}</TableCell>
                        <TableCell align="center">
                          {project.description}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            variant="text"
                            onClick={() => {
                              setProject(project);
                              navigate(`/tasks/${project.id}`);
                            }}
                          >
                            <FindInPageIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            variant="text"
                            onClick={() => {
                              getProjectsUsers(project.id);
                              setEditDialog(true);
                              setProject(project);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            variant="text"
                            onClick={() => {
                              setDelDialog(true);
                              setProject(project);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                )}
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
          <DialogTitle id="alert-dialog-title">{"Delete Project"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are sure you want to delete this project?
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
          <DialogTitle id="alert-dialog-title">{"Edit Project"}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="id"
              label="Title"
              type="text"
              fullWidth
              variant="standard"
              onChange={(e) =>
                setProject({ ...project, title: e.target.value })
              }
              value={project.title}
            />
            <TextField
              autoFocus
              margin="dense"
              id="description"
              label="Description"
              type="text"
              fullWidth
              variant="standard"
              onChange={(e) =>
                setProject({ ...project, description: e.target.value })
              }
              value={project.description}
            />
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
              sx={{ margin: "15px 0" }}
            >
              <InputLabel id="add-user-label">Select a user</InputLabel>
              <Select
                value={addUser}
                onChange={handleMenu}
                labelId="add-user-label"
                label="add-user-label"
                sx={{
                  width: 250,
                }}
              >
                {users?.map((user) => (
                  <MenuItem key={user.id} value={user}>
                    {user.firstname}
                  </MenuItem>
                ))}
              </Select>
              <Button
                variant="outlined"
                onClick={() => {
                  // setProject(project);
                  handleAddUser(addUser);
                  setAddUser({});
                }}
              >
                <AddIcon />
              </Button>
            </Stack>

            <TableContainer component={Paper} sx={{ maxHeight: "300px" }}>
              <Table aria-label="sticky table" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Id</TableCell>
                    <TableCell align="center">Name</TableCell>
                    <TableCell align="center">Delete</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {projectUsers.length > 0 &&
                    projectUsers.map((user) => (
                      <TableRow
                        key={user.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align="center">{user.id}</TableCell>
                        <TableCell align="center">{user.username}</TableCell>

                        <TableCell align="center">
                          <Button
                            variant="text"
                            onClick={() => {
                              setProjectUsers(
                                projectUsers.filter(
                                  (projectuser) => user.id != projectuser.id
                                )
                              );
                              setProjectUsersDelete([
                                ...projectUsersDelete,
                                user,
                              ]);
                            }}
                          >
                            <DeleteIcon />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
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
        >
          <DialogTitle id="alert-dialog-title">{"Add Project"}</DialogTitle>
          <DialogContent>
            {/* <TextField
              autoFocus
              margin="dense"
              id="id"
              label="Id"
              type="text"
              fullWidth
              variant="standard"
              onChange={(e) => setPId(e.target.value)}
            /> */}
            <TextField
              autoFocus
              margin="dense"
              id="title"
              label="Title"
              type="text"
              fullWidth
              variant="standard"
              onChange={(e) => setPTitle(e.target.value)}
            />
            <TextField
              autoFocus
              margin="dense"
              id="description"
              label="Description"
              type="text"
              fullWidth
              variant="standard"
              onChange={(e) => setPDescription(e.target.value)}
            />

            <FormControl
              sx={{
                marginTop: "20px",
              }}
            >
              <InputLabel id="demo-simple-select-helper-label">
                Add a user
              </InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                value={addUser}
                onChange={handleMenu}
                sx={{
                  width: 250,
                }}
              >
                {users?.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.firstname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {sbOpen && (
              <Alert
                onClose={() => {
                  setSbOpen(false);
                }}
                open={sbOpen}
                autoHideDuration={5000}
                severity="error"
                sx={{ width: "100%" }}
                variant="outlined"
              >
                This project already exists!
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddDialog(false)}>Cancel</Button>
            <Button onClick={() => handleAdd()} autoFocus>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
}

export default Projects;
