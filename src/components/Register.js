import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPostRequestRunningCurrently, setIsPostRequestRunningCurrently] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const register = async (formData) => {
    if (validateInput(formData)) {
      setIsPostRequestRunningCurrently(true);
      try {
        const postURL = `${config.endpoint}/auth/register`;
        const postData = {
          username: formData.username,
          password: formData.password
        };
        await axios.post(postURL, postData);
        const successMessage = "Registered successfully";
        enqueueSnackbar(successMessage, { variant: 'success' });
        history.push('/login');
      } catch (error) {
        if (error.response) {
          const backendErrorMessage = error.response.data.message;
          enqueueSnackbar(backendErrorMessage, { variant: 'error' });
        } else {
          const errorMessage = "Something went wrong. Check that the backend is running, reachable and returns valid JSON.";
          enqueueSnackbar(errorMessage, { variant: 'error' });
        }
      }
      setIsPostRequestRunningCurrently(false);
    }
  };

  
  const validateInput = (data) => {
    const isUsernameEmpty = (data.username.length === 0);
    if (isUsernameEmpty) {
      const usernameEmptyMessage = "Username is a required field";
      enqueueSnackbar(usernameEmptyMessage, { variant: 'warning' });
      return false;
    }

    const isUsernameLessThanLengthSix = (data.username.length < 6);
    if (isUsernameLessThanLengthSix) {
      const usernameLessThanLengthSixMessage = "Username must be at least 6 characters";
      enqueueSnackbar(usernameLessThanLengthSixMessage, { variant: 'warning' });
      return false;
    }

    const isPasswordEmpty = (data.password.length === 0);
    if (isPasswordEmpty) {
      const passwordEmptyMessage = "Password is a required field";
      enqueueSnackbar(passwordEmptyMessage, { variant: 'warning' });
      return false;
    }

    const isPasswordLessThanLengthSix = (data.password.length < 6);
    if (isPasswordLessThanLengthSix) {
      const passwordLessThanLengthSixMessage = "Password must be at least 6 characters";
      enqueueSnackbar(passwordLessThanLengthSixMessage, { variant: 'warning' });
      return false;
    }

    const isConfirmPasswordNotMatchingWithPassword = (data.password !== data.confirmPassword);
    if (isConfirmPasswordNotMatchingWithPassword) {
      const confirmPasswordNotMatchingWithPasswordMessage = "Passwords do not match";
      enqueueSnackbar(confirmPasswordNotMatchingWithPasswordMessage, { variant: 'warning' });
      return false;
    }

    return true;
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {
            isPostRequestRunningCurrently ?
              (<Box
                display="flex"
                width={384} height={36.5}
                alignItems="center"
                justifyContent="center">
                <CircularProgress size={36.5} /></Box>) :
              (<Button className="button" variant="contained"
                onClick={() => register({ username, password, confirmPassword })}>
                Register Now
              </Button>)
          }
          <p className="secondary-action">
            Already have an account?{" "}
            <Link className="link" to="/login">
              Login here
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
