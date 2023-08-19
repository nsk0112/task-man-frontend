import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import {
  Box,
  Button,
  Collapse,
  Container,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import AdminSidebar from "./AdminSidebar";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";
import dayjs from "dayjs";
import { trTR } from "@mui/x-date-pickers/locales";
import SearchIcon from "@mui/icons-material/Search";
import { useSelector } from "react-redux";

var updateLocale = require("dayjs/plugin/updateLocale");
dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  week: {
    dow: 1,
  },
});

function Tasks() {
  const { id } = useParams();
  const navigate = useNavigate();
  const matches = useMediaQuery("(min-width:1400px)");

  dayjs.locale("tr");

  const [tasks, setTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [addDialog, setAddDialog] = useState(false);
  const [delDialog, setDelDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  // const [taskId, setTaskId] = useState();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(dayjs());
  const [finishDate, setFinishDate] = useState(dayjs());
  const [status, setStatus] = useState();
  // const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const [selectUser, setSelectUser] = useState();
  const [task, setTask] = useState({});
  const [checked, setChecked] = useState(false);

  const statusTypes = {
    todo: "To Do",
    inprogress: "In Progress",
    done: "Done",
  };

  // const token = window.localStorage.getItem("user-token");
  const token = useSelector((state) => state.auth.token);
  // const is_admin = window.localStorage.getItem("is_admin");

  useEffect(() => {
    getTasks();
    getUsers();
  }, []);

  const getTasks = () => {
    const url = `http://localhost:8000/api/project/task/${id}`;

    axios
      .get(url)
      .then((response) => {
        setTasks(response.data.tasks);
        setAllTasks(response.data.tasks);
      })
      .then(async () => {
        await axios
          .get(`http://localhost:8000/api/user/?token=${token}`)
          .then((response) => {});
      });
  };

  const getUsers = async () => {
    const url = `http://localhost:8000/api/projects/${id}`;
    const usersUrl = `http://localhost:8000/api/user/?token=${token}`;
    let user_ids = [];

    const base = (await axios.get(url)).data.users;
    const allUsers = (await axios.get(usersUrl)).data.users;

    base.forEach((element) => {
      user_ids.push(allUsers.filter((user) => user.id == element.user_id)[0]);
    });

    setUsers(user_ids);
  };

  const handleAdd = () => {
    const data = {
      // id: taskId,
      title: title,
      description: description,
      start_date: startDate,
      finish_date: finishDate,
      status: status,
      user_id: selectUser,
      project_id: id,
    };

    const url = `http://localhost:8000/api/project/task`;

    axios.post(url, data);
  };

  const handleDelete = () => {
    const url = `http://localhost:8000/api/project/task/${task.id}`;

    axios.delete(url).then((response) => {
      // console.log(response);
      setDelDialog(false);
      getTasks();
    });
  };

  const handleEdit = () => {
    const url = `http://localhost:8000/api/project/task/${task.id}`;

    const data = {
      id: task.id,
      title: task.title,
      description: task.description,
      start_date: task.startDate,
      finish_date: task.finishDate,
      status: task.status,
      user_id: selectUser,
      project_id: id,
    };

    axios.put(url, data).then((response) => {
      setEditDialog(false);
      getTasks();
    });
  };

  const handleSearch = (e) => {
    if (e !== "") {
      let filter = allTasks.filter(
        (task) =>
          task.id.toString().includes(e) ||
          task.title.includes(e) ||
          task.description.includes(e) ||
          task.status.includes(e)
      );
      setTasks(filter);
    } else {
      setTasks(allTasks);
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
          marginLeft: matches ? "240px" : "0",
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
                <Button onClick={() => setChecked(!checked)} variant="outlined">
                  <SearchIcon />
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setAddDialog(true);
                    getUsers();
                  }}
                  sx={{ minWidth: "167px", overflowX: "hidden" }}
                >
                  Add New Task
                </Button>
              </Stack>
            </Stack>

            <Collapse in={checked} fullWidth sx={{ width: "100%" }}>
              <TextField
                fullWidth
                sx={{ marginBottom: "20px", width: "100%" }}
                placeholder="Search"
                // value={search}
                onChange={(e) => {
                  // setSearch(e.target.value.toLowerCase());
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
                      Username
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
                      Status
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ backgroundColor: "#5C445B" }}
                    >
                      Start Date
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ backgroundColor: "#5C445B" }}
                    >
                      Finish Date
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
                  {tasks ? (
                    tasks.map((task) => (
                      <TableRow
                        key={task.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          backgroundColor: "#252525",
                        }}
                      >
                        <TableCell align="center">{task.id}</TableCell>
                        <TableCell align="center">
                          {users?.length > 0
                            ? users.find((user) => user.id == task.user_id)
                                .username
                            : ""}
                        </TableCell>
                        <TableCell align="center">{task.title}</TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            maxWidth: 180,
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
                          <IconButton
                            variant="text"
                            onClick={() => {
                              getUsers();
                              setTask(task);
                              setEditDialog(true);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            variant="text"
                            onClick={() => {
                              setTask(task);
                              setDelDialog(true);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <></>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Box>

        {/* Add Dialog */}
        <Dialog
          open={addDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          component="form"
        >
          <DialogTitle id="alert-dialog-title">{"Add Task"}</DialogTitle>
          {/* id, title, description, start_date, finish_date, status, user_id, project_id */}
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "400px",
            }}
          >
            {/* <TextField
              autoFocus
              margin="dense"
              id="id"
              label="Id"
              type="text"
              fullWidth
              variant="standard"
              onChange={(e) => setTaskId(e.target.value)}
              value={taskId}
            /> */}
            <TextField
              autoFocus
              margin="dense"
              id="title"
              label="Title"
              type="text"
              fullWidth
              variant="standard"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
            <TextField
              autoFocus
              margin="dense"
              id="description"
              label="Description"
              type="Description"
              fullWidth
              variant="standard"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  inputFormat="DD/MM/YYYY"
                />
              </DemoContainer>
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Finish Date"
                  value={finishDate}
                  onChange={(newValue) => setFinishDate(newValue)}
                  inputFormat="DD/MM/YYYY"
                />
              </DemoContainer>
            </LocalizationProvider>

            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              label="Status"
              value={"todo"}
              onChange={(e) => setStatus(e.target.value)}
              fullWidth
              disabled
            >
              <MenuItem key={"todo"} value={"todo"}>
                Todo
              </MenuItem>
              {/* <MenuItem key={"inprogress"} value={"inprogress"}>
                In progress
              </MenuItem>
              <MenuItem key={"done"} value={"done"}>
                Done
              </MenuItem> */}
            </Select>

            <InputLabel id="user-label">User</InputLabel>
            <Select
              labelId="user-label"
              //   label="User"
              value={selectUser}
              onChange={(e) => setSelectUser(e.target.value)}
              fullWidth
            >
              {users?.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.firstname}
                </MenuItem>
              ))}
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddDialog(false)}>Cancel</Button>
            <Button type="submit" onClick={() => handleAdd()} autoFocus>
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog
          open={delDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Delete Task"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are sure you want to delete task?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDelDialog(false)}>No</Button>
            <Button onClick={() => handleDelete()} autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Dialog */}
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
            {/* <TextField
              autoFocus
              margin="dense"
              id="id"
              label="Id"
              type="text"
              fullWidth
              variant="standard"
              onChange={(e) => setTaskId(e.target.value)}
              value={task.id}
            /> */}
            <TextField
              autoFocus
              margin="dense"
              id="title"
              label="Title"
              type="text"
              fullWidth
              variant="standard"
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              value={task.title}
            />
            <TextField
              autoFocus
              margin="dense"
              id="description"
              label="Description"
              type="text"
              fullWidth
              multiline
              maxRows={4}
              variant="standard"
              onChange={(e) =>
                setTask({ ...task, description: e.target.value })
              }
              value={task.description}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Start Date"
                  // value={dayjs(task.startDate)}
                  value={dayjs(task.finishDate)}
                  defaultValue={dayjs("10.10.2023")}
                  onChange={(newValue) =>
                    setTask({ ...task, startDate: newValue })
                  }
                />
              </DemoContainer>
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Finish Date"
                  value={task.finishDate}
                  defaultValue={dayjs(task.finishDate)}
                  onChange={(newValue) =>
                    setTask({ ...task, finishDate: newValue })
                  }
                />
              </DemoContainer>
            </LocalizationProvider>

            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              label="Status"
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
                {"In progress"}
              </MenuItem>
              <MenuItem key={"done"} value={"done"}>
                Done
              </MenuItem>
            </Select>

            <InputLabel id="user-label">User</InputLabel>
            <Select
              labelId="user-label"
              label="User"
              value={selectUser}
              defaultValue={selectUser}
              onChange={(e) => setSelectUser(e.target.value)}
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
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialog(false)}>Cancel</Button>
            <Button type="submit" onClick={() => handleEdit()} autoFocus>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
}

export default Tasks;
