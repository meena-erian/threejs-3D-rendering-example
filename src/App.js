import './App.css';
//import ThreeDView from './components/ThreeDView';
import View3D from "./components/View3D";
import {
  PointLight,
} from 'three';
import { useState, useEffect } from 'react';
import ThreeDObject from './components/ThreeDObject';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
//import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
//import MenuItem from '@mui/material/MenuItem';
//import Menu from '@mui/material/Menu';
//import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';




var lights = [
  new PointLight(0xAAAAAA, 1, 0),
  new PointLight(0xAAAAAA, 1, 0),
  new PointLight(0xAAAAAA, 1, 0),
  new PointLight(0xAAAAAA, 1, 0),
  new PointLight(0xAAAAAA, 1, 0),
  new PointLight(0xAAAAAA, 1, 0),
];
lights[0].position.set(1000, 0, 0);
lights[1].position.set(-1000, 0, 0);
lights[2].position.set(0, 1000, 0);
lights[3].position.set(0, -1000, 0);
lights[4].position.set(0, 0, 1000);
lights[5].position.set(0, 0, -1000);



function App() {
  const [loading, setLoading] = useState(true);
  const [objects, setObjects] = useState([...lights]);
  const [gender, setGender] = useState("man")
  useEffect(() => {
    (async () => {
      const man = await ThreeDObject('man/man.gltf');
      const woman = await ThreeDObject('woman/woman.gltf');
      const child = await ThreeDObject('child/child.gltf');
      window.models = { man, woman, child };
      setLoading(false);
      //setObjects([...lights, window.models[gender].scene]);
    })();
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (!loading)
      setObjects([...lights, window.models[gender].scene]);
  }, [gender, loading])

  const handleGenderChange = (e) => {
    setGender(e.target.value)
  }

  return (
    <div className="App">
      <View3D width={window.innerWidth - 2} height={window.innerHeight - 2} objects={objects} />
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          ><MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            Body Map
          </Typography>
          {/* <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search> */}
          <Select
            value={gender}
            label="Age"
            onChange={handleGenderChange}
          >
            <MenuItem value={"man"}>Man</MenuItem>
            <MenuItem value={"woman"}>Woman</MenuItem>
            <MenuItem value={"child"}>Child</MenuItem>
          </Select>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton size="large" aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              //aria-controls={menuId}
              aria-haspopup="true"
              //onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              //aria-controls={mobileMenuId}
              aria-haspopup="true"
              //onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </div >
  );
}

export default App;
