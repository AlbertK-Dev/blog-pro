import * as React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import SigninPage from '../SigninPage';
import SignupPage from '../SignupPage';
import PubPage from '../PubPage';
import { GoogleAuthProvider, getAuth, isSignInWithEmailLink, linkWithRedirect, signInWithEmailLink } from 'firebase/auth';
import app from '../../firebase/config';
import { ToastContainer, toast } from 'react-toastify';


const auth = getAuth(app)
auth.useDeviceLanguage();

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    


  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0, height:'calc(100vh - 50px)' }} >
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export default function AuthPage() {
  const theme = useTheme();
    const [value, setValue] = React.useState(0);
    const [authError, setAuthError] = React.useState('');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  React.useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
            email = prompt('Veuillez saisir votre email pour la confirmation');   
        }

        signInWithEmailLink(auth, email, window.location.href)
            .then(() => {
                window.localStorage.removeItem('emailForSignIn');
                linkWithRedirect(auth.currentUser, new GoogleAuthProvider()).catch((error) => {
                    setAuthError(`erreur linking with redirect ${error.code || error.message || error.statusText}`)
                    toast.error(authError, {
                        position:'top-right',
                    })
                });
                toast.success('connexion réussi ', {
                    delay: 1000,
                    })
                   window.location.reload()

            })
            .catch((error) => setAuthError(`erreur signin with email link ${error.code || error.message || error.statusText}`))
        
        

    }
  }, [authError])
    
    

  return (
      <Box sx={{ bgcolor: 'background.paper', width: '100%', background: 'linear-gradient(0deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 0%, rgba(21,147,172,1) 67%, rgba(0,212,255,1) 100%)', }}>
          <ToastContainer />
      <AppBar position="static">
        <Tabs 
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
                  textColor="primary"
                  sx={{backgroundColor:'skyblue'}}
          variant="fullWidth"
                  aria-label="full width tabs example"
                  centered
        >
          <Tab label="Description" {...a11yProps(0)} />
          <Tab label="Connexion" {...a11yProps(1)} defaultChecked/>
          <Tab label="Inscription" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <PubPage/>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
        <SigninPage/>
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
        <SignupPage/>
        </TabPanel>
      </SwipeableViews>
    </Box>
  );
}