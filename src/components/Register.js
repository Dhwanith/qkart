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

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function

  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  const register = async (formData) => {
    if (validateInput(formData)) {
      setIsPostRequestRunningCurrently(true);
      try {
        const postURL = `${config.endpoint}/auth/register`;
        const postData = {
          username: formData.username,
          password: formData.password
        };
        const postRequestResponse = await axios.post(postURL, postData);
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

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
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
                width={581.33} height={36.5}
                alignItems="center"
                justifyContent="center"><CircularProgress size={36.5} /></Box>) :
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
