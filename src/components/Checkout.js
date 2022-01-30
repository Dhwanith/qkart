import { CreditCard, Delete } from "@mui/icons-material";
import {
  Button,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { config } from "../App";
import Cart, { getTotalCartValue, generateCartItemsFrom } from "./Cart";
import "./Checkout.css";
import Footer from "./Footer";
import Header from "./Header";

const AddNewAddressView = ({
  token,
  newAddress,
  setNewAddress,
  addAddress,
}) => {
  return (
    <Box display="flex" flexDirection="column">
      <TextField
        multiline
        minRows={4}
        placeholder="Enter your complete address"
        value={newAddress.value}
        onChange={(e) => {
          setNewAddress({
            isAddingNewAddress: true,
            value: e.target.value
          });
        }}
      />
      <Stack direction="row" my="1rem">
        <Button variant="contained" onClick={() => {
          const addressToBeAdded = newAddress.value;
          addAddress(token, addressToBeAdded);
          setNewAddress({
            isAddingNewAddress: false,
            value: ''
          });
        }}>
          Add
        </Button>
        <Button variant="text" onClick={() => {
          setNewAddress({
            isAddingNewAddress: false,
            value: ''
          });
        }}>
          Cancel
        </Button>
      </Stack>
    </Box>
  );
};

const Checkout = () => {
  const token = localStorage.getItem("token");
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [addresses, setAddresses] = useState({ all: [], selected: "" });
  const [newAddress, setNewAddress] = useState({
    isAddingNewAddress: false,
    value: "",
  });

  const getProducts = async () => {
    try {
      const response = await axios.get(`${config.endpoint}/products`);
      setProducts(response.data);
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 500) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
        return null;
      } else {
        enqueueSnackbar(
          "Could not fetch products. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    }
  };

  const fetchCart = async (token) => {
    if (!token) return;
    try {
      const response = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch {
      enqueueSnackbar(
        "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
        {
          variant: "error",
        }
      );
      return null;
    }
  };

  const getAddresses = async (token) => {
    if (!token) return;

    try {
      const getRequestURL = `${config.endpoint}/user/addresses`;
      const getRequestHeaders = {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
      const getRequestResponse = await axios.get(getRequestURL, getRequestHeaders);
      setAddresses({ ...addresses, all: getRequestResponse.data });
      return getRequestResponse.data;
    } catch (e) {
      if (e.response) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      }
      else {
        enqueueSnackbar("Could not fetch addresses. Check that the backend is running, reachable and returns valid JSON.", { variant: "error" });
      }
      return null;
    }
  };


  const addAddress = async (token, newAddress) => {
    try {
      const postRequestURL = `${config.endpoint}/user/addresses`;
      const postRequestData = {
        address: `${newAddress}`
      }
      const postRequestHeaders = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
      const postRequestResponse = await axios.post(postRequestURL, postRequestData, postRequestHeaders);
      setAddresses({ ...addresses, all: postRequestResponse.data });
    } catch (e) {
      if (e.response) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar("Could not add this address. Check that the backend is running, reachable and returns valid JSON.", { variant: "error" });
      }
    }
  };


  const deleteAddress = async (token, addressId) => {
    try {
      const deleteRequestURL = `${config.endpoint}/user/addresses/${addressId}`;
      const deleteRequestHeaders = {
        headers: {
          Accept: 'application/json, text/plain, */*',
          Authorization: `Bearer ${token}`
        }
      }
      const deleteRequestResponse = await axios.delete(deleteRequestURL, deleteRequestHeaders);
      setAddresses({ ...addresses, all: deleteRequestResponse.data });
      return deleteRequestResponse.data;
    } catch (e) {
      if (e.response) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not delete this address. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    }
  };


  const validateRequest = (items, addresses) => {
    if (!addresses.all.length) {
      enqueueSnackbar("Please add a new address before proceeding.", { variant: "warning" });
      return false;
    } else if (!addresses.selected) {
      enqueueSnackbar("Please select one shipping address to proceed.", { variant: "warning" });
      return false;
    } else {
      const totalCost = getTotalCartValue(items);
      const balance = parseInt(localStorage.getItem("balance"));

      if (totalCost > balance) {
        enqueueSnackbar("You do not have enough balance in your wallet for this purchase", { variant: "warning" });
        return false;
      } else {
        return true;
      }
    }
  };


  const performCheckout = async (token, items, addresses) => {
    try {
      const postRequestURL = `${config.endpoint}/cart/checkout`;
      const postRequestBody = {
        addressId: addresses.selected
      };
      const postRequestHeaders = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      await axios.post(postRequestURL, postRequestBody, postRequestHeaders);
      enqueueSnackbar("Order placed successfully!", { variant: "success" });

      const totalCost = getTotalCartValue(items);
      const balance = parseInt(localStorage.getItem("balance"));
      const newBalance = balance - totalCost;
      localStorage.setItem('balance', newBalance.toString());

      history.push('/thanks');
    } catch (e) {
      if (e.response) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar("Payment unsuccessful", { variant: "error" });
      }
    }
  };


  useEffect(() => {
    const onLoadHandler = async () => {
      if (!token) {
        enqueueSnackbar("You must be logged in to access checkout page", { variant: "info" });
        history.push('/');
        return;
      }

      getAddresses(token);

      const productsData = await getProducts();
      const cartData = await fetchCart(token);
      if (productsData && cartData) {
        const cartDetails = await generateCartItemsFrom(cartData, productsData);
        setItems(cartDetails);
      }
    };
    onLoadHandler();
  }, []);


  const addressesContainer = (
    <>
      {
        addresses.all.map(addressObj => {
          const isSelected = (addresses.selected === addressObj._id);
          return (
            <Box key={addressObj._id}
              className={`address-item ${isSelected ? 'selected' : 'not-selected'}`}
              onClick={() => {
                setAddresses({
                  ...addresses,
                  selected: addressObj._id
                });
              }}>
              <Typography component={"div"}>
                {addressObj.address}
              </Typography>
              <Button variant="outlined"
                startIcon={<Delete />}
                onClick={() => {
                  if (isSelected) {
                    setAddresses({
                      ...addresses,
                      selected: ''
                    });
                  }
                  deleteAddress(token, addressObj._id);
                }}>
                Delete
              </Button>
            </Box>
          );
        })
      }
    </>
  );

  return (
    <>
      <Header />
      <Grid container>
        <Grid item xs={12} md={8}>
          <Box className="shipping-container" minHeight="100vh">
            <Typography color="#3C3C3C" variant="h4" my="1rem">
              Shipping
            </Typography>

            <Typography color="#3C3C3C" my="1rem">
              Manage all the shipping addresses you want. This way you won't
              have to enter the shipping address manually with every order.
              Select the address you want to get your order delivered.
            </Typography>

            <Divider />

            <Box>
              {
                addresses.all.length !== 0 ?
                  addressesContainer :
                  <Typography my="1rem">
                    No addresses found for this account. Please add one to proceed
                  </Typography>
              }

            </Box>

            {
              newAddress.isAddingNewAddress === false ?
                (<Button
                  color="primary"
                  variant="contained"
                  id="add-new-btn"
                  size="large"
                  onClick={() => {
                    setNewAddress({
                      isAddingNewAddress: true,
                      value: "",
                    });
                  }}
                >
                  Add new address
                </Button>) :
                (<AddNewAddressView
                  token={token}
                  newAddress={newAddress}
                  setNewAddress={setNewAddress}
                  addAddress={addAddress}
                />)
            }

            <Typography color="#3C3C3C" variant="h4" my="1rem">
              Payment
            </Typography>

            <Typography color="#3C3C3C" my="1rem">
              Payment Method
            </Typography>

            <Divider />

            <Box my="1rem">
              <Typography>Wallet</Typography>
              <Typography>
                Pay ${getTotalCartValue(items)} of available $
                {localStorage.getItem("balance")}
              </Typography>
            </Box>

            <Button
              startIcon={<CreditCard />}
              variant="contained"
              onClick={() => {
                if (validateRequest(items, addresses)) {
                  performCheckout(token, items, addresses);
                }
              }}
            >
              PLACE ORDER
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={4} bgcolor="#E9F5E1">
          <Cart isReadOnly={true} products={products} items={items} validateRequest={validateRequest}
            addresses={addresses} performCheckout={performCheckout} />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
};

export default Checkout;
