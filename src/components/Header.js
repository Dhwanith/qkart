import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();
  
    const exploreButton =
      (<Button
        className="explore-button"
        startIcon={<ArrowBackIcon />}
        variant="text" onClick={() => history.push('/')}>
          Back to explore
      </Button>);

    const isUserLoggedin = (localStorage.getItem('username') !== null);
  
    const userAndLogoutButtons =
      (<Box
        display="flex"
        justifyContent="space-between"
        alignItems="center">
        <img src="avatar.png" height="40" alt={localStorage.getItem('username')}></img>
        &nbsp; &nbsp;
        {localStorage.getItem('username')}
        <Button
          className="logout-button"
          variant="text" onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}>
            LOGOUT
        </Button>
      </Box>);
  
  const loginAndRegisterButtons =
    (<Box>
      <Button
        className="login-button"
        variant="text" onClick={() => history.push('/login')}>
        LOGIN
      </Button>
      <Button
        className="register-button text-light"
        variant="text" onClick={() => history.push('/register')}>
        REGISTER
      </Button>
    </Box>);

    const textField = children;
  
    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>

        {/* Search view for desktop */}
        { hasHiddenAuthButtons ? textField : null }

        {
          hasHiddenAuthButtons ?
            (isUserLoggedin ? userAndLogoutButtons : loginAndRegisterButtons) :
            exploreButton 
        }
      </Box>
    );
};

export default Header;
