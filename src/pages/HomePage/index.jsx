import * as React from "react";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { NavLink, Outlet, useLoaderData, useNavigate } from "react-router-dom";
import { AccountBox, Dashboard, Favorite, Group, Home,  Logout,  Public, RecentActors } from "@mui/icons-material";
import { getAuth, signOut } from "firebase/auth";
import app from "../../firebase/config";

const drawerWidth = 240;



const auth = getAuth(app)
function HomePage() {
  const user = useLoaderData() 
  const navigate = useNavigate();

  // const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const disconnectUser = async () => {
    setAnchorElUser(null);
    await signOut(auth);
    navigate('/')
    

}
  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const drawer = (
    <div style={{ backgroundColor: "f5f5f5" }}>
      <Toolbar
        sx={{
          backgroundColor: "skyblue",
          borderColor: "blue",
          borderWidth: "3px",
        }}
      >
        BLOG-PRO
      </Toolbar>
      <Divider />
      <List>
        <NavLink
          to={""}
          style={({ isActive, isPending, isTransitioning }) => {
            return {
              fontWeight: isActive ? "bold" : "small",
              border: isActive ? "1px solid black" : "",
              backgroundColor: isActive? 'whiteSmoke': 'white',
              color: isPending ? "red" : "black",
              display: "block",
              viewTransitionName: isTransitioning ? "slide" : "",
            };
          }}
        >
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText primary="Acceuil" />
            </ListItemButton>
          </ListItem>
        </NavLink>

        <NavLink
          to={"posts"}
          style={({ isActive, isPending, isTransitioning }) => {
            return {
              border: isActive ? "2px solid gray" : "",

              display: "block",
              textDecoration: "none",
              viewTransitionName: isTransitioning ? "slide" : "",
            };
          }}
        >
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <Public />
              </ListItemIcon>
              <ListItemText primary="Tous les Posts" />
            </ListItemButton>
          </ListItem>
        </NavLink>

        <NavLink
          to={"dashboard"}
          style={({ isActive, isPending, isTransitioning }) => {
            return {
              fontWeight: isActive ? "bold" : "small",
              border: isActive ? "2px solid gray" : "",
              textDecoration: "none",
              display: "block",
              viewTransitionName: isTransitioning ? "slide" : "",
            };
          }}
        >
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <Dashboard />
              </ListItemIcon>
              <ListItemText primary="Tableau de bord" />
            </ListItemButton>
          </ListItem>
        </NavLink>
       
      </List>
      <Divider />
      <List>
  

        <NavLink
          to={"favorite"}
          style={({ isActive, isPending, isTransitioning }) => {
            return {
              fontWeight: isActive ? "bold" : "small",
              border: isActive ? "2px solid gray" : "",
              textDecoration: "none",
              display: "block",
              viewTransitionName: isTransitioning ? "slide" : "",
            };
          }}
        >
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <Favorite />
              </ListItemIcon>
              <ListItemText primary="Vos Favoris" />
            </ListItemButton>
          </ListItem>
        </NavLink>

        <NavLink
          to={"friends"}
          style={({ isActive, isPending, isTransitioning }) => {
            return {
              fontWeight: isActive ? "bold" : "small",
              border: isActive ? "2px solid gray" : "",
              textDecoration: "none",
              display: "block",
              viewTransitionName: isTransitioning ? "slide" : "",
            };
          }}
        >
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <Group />
              </ListItemIcon>
              <ListItemText primary="Vos Amis" />
            </ListItemButton>
          </ListItem>
        </NavLink>


        <NavLink
          to={"recent"}
          style={({ isActive, isPending, isTransitioning }) => {
            return {
              fontWeight: isActive ? "bold" : "small",
              border: isActive ? "2px solid gray" : "",
              textDecoration: "none",
              display: "block",
              viewTransitionName: isTransitioning ? "slide" : "",
            };
          }}
        >
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <RecentActors />
              </ListItemIcon>
              <ListItemText primary="Consultés Récemment" />
            </ListItemButton>
          </ListItem>
        </NavLink>
      </List>
      
    </div>
  );

  // Remove this const when copying and pasting into your project.
  // const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Divider
            variant="horizontal"
            sx={{ display: { xs: "none", sm: "inline-block" } }}
          />
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            sx={{ display: { sm: "none" } }}
            variant="h6"
            noWrap
            component="div"
          >
            BLOG-PRO
          </Typography>

          <Box sx={{ flexGrow: 0 }}>
            {`${user?.displayName} - `}
            <Tooltip title="Vos paramètres">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={user?.displayName} src={user?.photoURL} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              
              <MenuItem key={'compte'} onClick={handleCloseUserMenu} sx={{display:'flex', justifyContent:'space-between'}}>
              <Typography textAlign="center">votre Compte</Typography>
                <AccountBox/>
                 
              </MenuItem>
              <MenuItem key={'logOut'} onClick={disconnectUser} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography textAlign="center">Se déconnecter</Typography>
                  <Logout/>
                
                  
                </MenuItem>
              
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          // container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: "black",
          minHeight: "100vh",
          color: "wheat",
          p: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)`  },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 1,
          justifyContent:'space-between'
        }}
      >
        <Toolbar sx={{ display: { md: "none" } }} />
        <Box sx={{ width: { xs: "100%", md: "75%" }, backgroundColor:'ButtonFace', color: 'black', flex:1 }}>
          <Toolbar sx={{ display: { xs: "none", md: "block" } }} />

          {/*reservé aux enfants */}
          <Outlet />
        </Box>
        <Box
          sx={{
            display: { xs: "none", md: "inline-block" },
            width: { md: "25%" },
            backgroundColor: 'whitesmoke',
            minHeight:'95vh'
          }}
        >
          <Toolbar sx={{ display: { xs: "none", md: "block" }}} />
          vous laisserez vos remarques et suggestions ici
        </Box>
      </Box>
    </Box>
  );
}

export default HomePage;
