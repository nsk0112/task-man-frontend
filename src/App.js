import './App.css';
import { Routes, Route } from "react-router-dom";
import Home from './components/Home';
import Login from './components/Login';
import Users from './components/UsersList';
import Projects from './components/Projects';
import Tasks from './components/Tasks';
import UserProjects from './components/UserProjects';
import UserTasks from './components/UserTasks';
import Profile from './components/Profile';


function App() {

  return (
    <div className="App">

      <Routes>
        <Route path="/*" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/users" element={<Users />}></Route>
        <Route path="/projects" element={<Projects />}></Route>
        <Route path="/tasks/:id" element={<Tasks />}></Route>
        <Route path="/projects/:id" element={<UserProjects />}></Route>
        <Route path="/projects/tasks/:projectid/:userid" element={<UserTasks />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
      </Routes>


    </div>
  );
}

export default App;
