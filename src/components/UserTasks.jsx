import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import dayjs from "dayjs";

function UserTasks() {
  const { projectid, userid } = useParams();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [task, setTask] = useState({});
  const [editDialog, setEditDialog] = useState(false);
  const [users, setUsers] = useState([]);
  const [myTasks, setMyTasks] = useState(false);

  const statusTypes = {
    todo: "To Do",
    inprogress: "In Progress",
    done: "Done",
  };

  useEffect(() => {
    getUsers();
    getTasks();
  }, []);

  const getTasks = async () => {
    const url = `http://localhost:8000/api/project/task/${projectid}`;

    await axios.get(url).then((response) => {
      setTasks(response.data.tasks);
      setAllTasks(response.data.tasks);
    });
  };

  const getUsers = () => {
    let userlist = [];
    tasks.forEach(async (task) => {
      let url = `http://localhost:8000/api/user/${task.user_id}`;
      let user = (await axios.get(url)).data.user;
      userlist.push(user);
    });
    setUsers(userlist);
  };

  const handleEdit = () => {
    const url = `http://localhost:8000/api/project/task/user/${userid}`;

    const data = {
      id: task.id,
      new_status: task.status,
    };

    axios.put(url, data).then((response) => {
      console.log(response);
    });
  };

  useEffect(() => {
    if (myTasks) {
      let filtered = allTasks.filter((task) => task.user_id == userid);
      setTasks(filtered);
    } else {
      setTasks(allTasks);
    }
  }, [myTasks]);

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
      <Container>
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <CssBaseline />
          <Navbar />

          <Grid
            sx={{
              width: "100%",
            }}
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={50}
              sx={{
                marginBottom: "30px",
                marginTop: "25px",
                width: "100%",
              }}
            >
              <Typography variant="h3" gutterBottom>
                Tasks
              </Typography>

              <Stack
                direction="row"
                justifyContent="space-around"
                alignItems="center"
                spacing={2}
              >
                <FormControlLabel
                  value="end"
                  control={
                    <Switch
                      checked={myTasks}
                      onChange={() => {
                        setMyTasks(!myTasks);
                      }}
                    />
                  }
                  label="My Tasks"
                  labelPlacement="end"
                />
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate(`/projects/${userid}`)}
                  sx={{ minWidth: "167px", overflowX: "hidden" }}
                >
                  Back To Projects
                </Button>
              </Stack>
            </Stack>

            <TableContainer component={Paper} sx={{ width: "100%" }}>
              <Table aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Id</TableCell>
                    {/* <TableCell align="center">Username</TableCell> */}
                    <TableCell align="center">Title</TableCell>
                    <TableCell align="center">Description</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Start Date</TableCell>
                    <TableCell align="center">Finish Date</TableCell>
                    <TableCell align="center">Edit</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks &&
                    tasks.map((task) => (
                      <TableRow
                        key={task.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          backgroundColor: "#252525",
                        }}
                      >
                        <TableCell align="center">{task.id}</TableCell>
                        {/* <TableCell align="center">
                          {users.length > 0
                            ? users.find((user) => user.id == task.user_id)
                                .username
                            : ""}
                        </TableCell> */}
                        <TableCell
                          align="center"
                          sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {task.title}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            maxWidth: 200,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {task.description}
                        </TableCell>
                        <TableCell align="center">
                          {statusTypes[task.status]}
                        </TableCell>
                        <TableCell align="center">
                          {dayjs(task.start_date).format("DD/MM/YYYY")}
                        </TableCell>
                        <TableCell align="center">
                          {dayjs(task.finish_date).format("DD/MM/YYYY")}
                        </TableCell>

                        <TableCell align="center">
                          <Button
                            variant="text"
                            onClick={() => {
                              setTask(task);
                              setEditDialog(true);
                            }}
                          >
                            <EditIcon />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Box>

        <Dialog
          open={editDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          component="form"
        >
          <DialogTitle id="alert-dialog-title">{"Edit Task"}</DialogTitle>
          {/* id, title, description, start_date, finish_date, status, user_id, project_id */}
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "400px",
            }}
          >
            <TextField
              autoFocus
              disabled
              margin="normal"
              id="title"
              label="Title"
              type="text"
              fullWidth
              variant="standard"
              value={task.title}
              multiline
            />
            <TextField
              autoFocus
              disabled
              margin="normal"
              id="description"
              label="Description"
              type="text"
              fullWidth
              variant="standard"
              value={task.description}
              multiline
              maxRows={4}
            />

            {userid == task.user_id ? (
              <Box>
                <InputLabel htmlFor="status">Status</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  value={task.status}
                  onChange={(e) => setTask({ ...task, status: e.target.value })}
                  sx={{
                    width: 250,
                  }}
                >
                  <MenuItem key={"todo"} value={"todo"}>
                    Todo
                  </MenuItem>
                  <MenuItem key={"inprogress"} value={"inprogress"}>
                    In progress
                  </MenuItem>
                  <MenuItem key={"done"} value={"done"}>
                    Done
                  </MenuItem>
                </Select>
              </Box>
            ) : (
              <TextField
                label="Status"
                value={statusTypes[task.status]}
                disabled
                autoFocus
                margin="dense"
                id="status"
                type="text"
                fullWidth
                variant="standard"
              />
            )}
          </DialogContent>

          {userid == task.user_id ? (
            <DialogActions>
              <Button onClick={() => setEditDialog(false)}>Cancel</Button>
              <Button type="submit" onClick={() => handleEdit()} autoFocus>
                Save
              </Button>
            </DialogActions>
          ) : (
            <DialogActions>
              <Button
                onClick={() => {
                  setEditDialog(false);
                }}
              >
                OK
              </Button>
            </DialogActions>
          )}
        </Dialog>
      </Container>
    </ThemeProvider>
  );
}

export default UserTasks;
