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
import styles from "./style";

import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { Link as RouterLink, NavLink, Outlet, useLoaderData, useNavigate } from "react-router-dom";
import { AccountBox, Dashboard, Favorite, Group, Home,  Logout,  Public, RecentActors, Send } from "@mui/icons-material";
import { getAuth, signOut } from "firebase/auth";
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import app from "../../firebase/config";
import { ToastContainer, /*toast*/ } from "react-toastify";
import { blue } from "@mui/material/colors";
import { Button, Slide, Stack, TextareaAutosize } from "@mui/material";
import { useDimensions } from "../../hooks/useDimensions";
import useScrollTrigger from '@mui/material/useScrollTrigger';


const drawerWidth = 240;



const auth = getAuth(app)


function HideOnScroll(props) {
  const { children} = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}



function HomePage() {
  const user = useLoaderData() 
  const navigate = useNavigate();
  

//   React.useEffect(() => {
//     const theUser = auth.currentUser
//     if (theUser.displayName === null) {
//       toast.info("veuillez configurez votre compte pour effectuer un post", {
//         delay: 2000,
//         position:'bottom-left',
//     })
    
//   }
// })

  // const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);


  const disableMenuListPadding = false

  const { innerWidth } = useDimensions()
  const onSmallDevice = innerWidth <= 0;
  console.log(onSmallDevice)
 

  const NAV_LINK_ACTIVE_COLOR = "#f5f5f5";

  const disconnectUser = async () => {
  
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
    <div  style={{ backgroundColor: "f5f5f5" }}>
      <Toolbar>
        
        <Typography
          variant="body1"
          sx={{
            ...styles.text,
            //fontFamily: "Playfair Display",
            fontFamily: "Great Vibes",
            fontSize: {xs:"40px", sm:'30px', md:'40px'},
            //fontWeight: "bold",
            //textShadow: `2px 2px 5px ${ICONS_COLOR}`,
            textShadow: `2px 2px 5px ${blue[600]}`,
           // color: 'white',
           // textDecoration: 'underline'
          }}
        >
          Blog-Pro
        </Typography>
      </Toolbar>
      {/* <Divider /> */}
      <List>
        <NavLink
          to={""}

          style={({ isActive, isPending, isTransitioning }) => {
            
            return {
              fontWeight: isActive ? "bold" : "small",
              // backgroundColor: isActive? NAV_LINK_ACTIVE_COLOR: 'white',
              border: isActive ? '1px solid #f5f5f5' : '0px solid white',
              color: isPending ? "red" : "black",
              display: "block",
              textDecoration:'none',
              viewTransitionName: isTransitioning ? "slide" : "",
              
            };
          }}
        >
          <ListItem disablePadding={disableMenuListPadding} >
            <ListItemButton sx={{borderRadius:'10px'}} >
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText id="home_list" style={{
                fontSize: '40px',

              }} primary="Acceuil" />
            </ListItemButton>
          </ListItem>
        </NavLink>

        <NavLink
          to={"posts"}

          style={({ isActive, isPending, isTransitioning }) => {
          
            
            return {
              fontWeight: isActive ? "bold" : "small",
              // backgroundColor: isActive? NAV_LINK_ACTIVE_COLOR: 'white',
              border: isActive ? '1px solid #f5f5f5' : '0px solid white',
              color: isPending ? "red" : "black",
              display: "block",
              textDecoration:'none',
              viewTransitionName: isTransitioning ? "slide" : "",
            };
          }}
        >
          <ListItem disablePadding={disableMenuListPadding}>
            <ListItemButton sx={{borderRadius:'10px'}}>
              <ListItemIcon>
                <Public />
              </ListItemIcon>
              <ListItemText primary="Mes Publications" />
            </ListItemButton>
          </ListItem>
        </NavLink>

        <NavLink
          to={"dashboard"}
          style={({ isActive, isPending, isTransitioning }) => {
            return {
              fontWeight: isActive ? NAV_LINK_ACTIVE_COLOR : "small",
              // backgroundColor: isActive? NAV_LINK_ACTIVE_COLOR: 'white',
              border: isActive ? '1px solid #f5f5f5' : '0px solid white',
              color: isPending ? "red" : "black",
              display: "block",
              textDecoration:'none',
              viewTransitionName: isTransitioning ? "slide" : "",
            };
          }}
        >
          <ListItem disablePadding={disableMenuListPadding}>
            <ListItemButton sx={{borderRadius:'10px'}}>
              <ListItemIcon>
                <Dashboard />
              </ListItemIcon>
              <ListItemText primary="Tableau de bord" />
            </ListItemButton>
          </ListItem>
        </NavLink>
       
      </List>
      {/* <Divider /> */}
      <List>
  

        <NavLink
          to={"favorite"}
          
          style={({ isActive, isPending, isTransitioning }) => {
            return {
              fontWeight: isActive ? "bold" : "small",
              // backgroundColor: isActive? NAV_LINK_ACTIVE_COLOR: 'white',
              border: isActive ? '1px solid #f5f5f5' : '0px solid white',
              color: isPending ? "red" : "black",
              display: "block",
              textDecoration:'none',
              viewTransitionName: isTransitioning ? "slide" : "",
            };
          }}
        >
          <ListItem disablePadding={disableMenuListPadding}>
            <ListItemButton sx={{borderRadius:'10px'}}>
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
              // backgroundColor: isActive? NAV_LINK_ACTIVE_COLOR: 'white',
              border: isActive ? '1px solid #f5f5f5' : '0px solid white',
              color: isPending ? "red" : "black",
              display: "block",
              textDecoration:'none',
              viewTransitionName: isTransitioning ? "slide" : "",
            };
          }}
        >
          <ListItem disablePadding={disableMenuListPadding}>
            <ListItemButton sx={{borderRadius:'10px'}}>
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
              fontWeight: isActive ? "bold" : "",
              // backgroundColor: isActive? NAV_LINK_ACTIVE_COLOR: 'white',
              border: isActive ? '1px solid #f5f5f5' : '0px solid white',
              color: isPending ? "red" : "black",
              display: "block",
              textDecoration:'none',
              viewTransitionName: isTransitioning ? "slide" : "",
            };
          }}
        >
          <ListItem disablePadding={disableMenuListPadding}>
            <ListItemButton sx={{borderRadius:'10px'}}>
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
    
    <Box sx={{ display: "flex", }}>
        <ToastContainer/>
      <CssBaseline />
      <HideOnScroll>
        <AppBar
        position="fixed"
        
        
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: 'white',
          boxShadow: '0px 0px 0px gray',
          color: 'black',
          p: 0,
          right:0
          
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{display:'flex'}}>
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
            
            sx={{
              display: { sm: "none" },
             /* ...styles.text,*/
              //fontFamily: "Playfair Display",
              fontFamily: "Great Vibes",
              fontSize: "25px",
              textAlign: 'left',
              left:0,
              //fontWeight: "bold",
              //textShadow: `2px 2px 5px ${ICONS_COLOR}`,
                textShadow: `2px 2px 5px ${blue[900]}`,
              width:'50px',
              color: 'white',
                textDecoration: 'underline',
                //backgroundColor: blue[700],
                borderRadius: '10px',
                padding:'1px'
            }}
            variant="h6"
            noWrap
            component="div"
          >
            Bp
          </Typography>
          </Box>
          <PopupState variant="popover" popupId="demo-popup-menu">
      {(popupState) => (
        <React.Fragment>
          <IconButton variant="contained" {...bindTrigger(popupState)}>
          <Avatar alt={user?.displayName || "Inconnu"} src={user?.photoURL} />
          </IconButton>
                <Menu {...bindMenu(popupState)}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                      mt: 1.5,
                      '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      '&::before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  }}>
                  <MenuItem onClick={popupState.close}>
                  <RouterLink style={{display: "flex", justifyContent:'space-between',textDecoration:'none', width:'100%', color:'black'}} to={'user'} ><Typography  textAlign="center">Mon Compte</Typography>
                <AccountBox/></RouterLink>
            </MenuItem>
            <MenuItem key={'logOut'} onClick={disconnectUser} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography textAlign="center">Se déconnecter</Typography>
                  <Logout/>
                
                  
                </MenuItem>
            {/* <MenuItem onClick={popupState.close}>Logout</MenuItem> */}
          </Menu>
        </React.Fragment>
      )}
    </PopupState>

          {/* <Box sx={{ flexGrow: 0 }}> {/** avatar Menu *
            <Tooltip title="Vos paramètres">
              <IconButton
                id="user-menu-button"
                aria-controls={anchorElUser ? 'menu-appbar' : undefined}
        aria-haspopup="true"
        aria-expanded={anchorElUser ? 'true' : undefined}
                onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={user?.displayName || "Inconnu"} src={user?.photoURL} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              MenuListProps={{
                'aria-labelledby': 'user-menu-button',
              }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              slotProps={{
                paper:{
                  style: {
                    maxHeight: 200,
                    width: '20ch',
                    position:'absolute'
                  },
                }
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              
              <MenuItem key={'compte'} onClick={handleCloseUserMenu} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <RouterLink style={{display: "flex", justifyContent:'space-between',textDecoration:'none', width:'100%', color:'black'}} to={'user'} ><Typography  textAlign="center">Mon Compte</Typography>
                <AccountBox/></RouterLink>
              
                 
              </MenuItem>
              <MenuItem key={'logOut'} onClick={disconnectUser} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography textAlign="center">Se déconnecter</Typography>
                  <Logout/>
                
                  
                </MenuItem>
              
            </Menu>
          </Box> */}
        </Toolbar>
      </AppBar>
      </HideOnScroll>
      
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 }}}
        //aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          // container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          onClick={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              //border:'2px solid yellow'
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
              width: {md:`${drawerWidth}px`, sm:`${drawerWidth - 40}px`},
              border:'0px solid yellow'
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
         // p: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)`  },
          display: "flex",
          flexDirection: { xs: "column", sm:'row', md: "row" },
         // gap: 1,
          justifyContent: 'space-between',
         
        }}
      >
        <Toolbar sx={{ display: {sm:'none', md: "none" } }} />
        <Box sx={{ width: { xs: "100%", sm:'100%', md: "50%", ...styles.flexCenter, alignContent:{sm:'center', md:'center' } }, backgroundColor:'white',mt:{md: '64px',sm:'64px', xs:0}, color: 'black', flex:1 }}>
          <Toolbar sx={{ display: { xs: "none", sm:'block', md: "block" } }} />
          <Stack /*justifyContent='center' alignItems='center'*/ width={{ xs: "100%", sm: '90%', md: "60%" }} minHeight={{ xs: '100% ', sm: '100%', md: '85vh' }} sx={{/* position: { sm: 'relative', xs:'relative'},*/ border:'0px solid black', p:2, pt:1, pb:1 }}>
            {/*reservé aux enfants */}
          <Outlet />
          </Stack>
          
        </Box>
        <Box
          sx={{
            display: { xs: "none", sm:'none', md: "flex" },
            width: { md: "20%" },
            backgroundColor: 'white',
           minHeight:'91vh',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            color: blue[500],
            textAlign: 'center',
            gap: 1,
            position: 'fixed',
            right:0
            
          }}
        >
          <Toolbar sx={{ display: { xs: "none",sm:"block", md: "block" }}} />
          
          <TextareaAutosize placeholder="Des suggestions?" name="comment" style={{ width: '80%',marginTop:'50px', height: '200px', fontFamily: 'Open Sans, Time New Roman', fontSize:'20px' }}/>
          <Button endIcon={<Send/>} variant="contained">Envoyé </Button>
        </Box>
        <Box sx={{
            display: { xs: "none", sm:'none', md: "flex" },
            width: { md: "20%" },
            backgroundColor: 'white',
           minHeight:'91vh',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: blue[500],
            textAlign: 'center',
            gap:1
            
          }}>hidden</Box>
      </Box>
    </Box>
  );
}

export default HomePage;
