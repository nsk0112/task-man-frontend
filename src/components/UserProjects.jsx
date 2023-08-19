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
import { Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function UserProjects() {
  // const token = window.localStorage.getItem("user-token");
  const token = useSelector((state) => state.auth.token);
  const { id } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    getProjects();
  }, []);

  const getProjects = async () => {
    const projectsRes = await axios.get(
      `http://localhost:8000/api/projects/?token=${token}`
    );

    setProjects(projectsRes.data.projects);
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
        // sx={{
        //   margin: 0,
        //   display: "flex",
        //   justifyContent: "center",
        //   alignItems: "center",
        //   width: "100%",
        // }}
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
                Projects
              </Typography>
            </Stack>

            <TableContainer component={Paper} sx={{ width: "100%" }}>
              <Table aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Id</TableCell>
                    <TableCell align="center">Title</TableCell>
                    <TableCell align="center">Description</TableCell>
                    <TableCell align="center">Details</TableCell>
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
                          <Button
                            variant="text"
                            onClick={() => {
                              navigate(`/projects/tasks/${project.id}/${id}`);
                            }}
                          >
                            <FindInPageIcon />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default UserProjects;
