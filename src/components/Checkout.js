import { CreditCard } from "@mui/icons-material";
import {
  Button,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import { getTotalCartValue, generateCartItemsFrom } from "./Cart";
import "./Checkout.css";
import Footer from "./Footer";
import Header from "./Header";


const Checkout = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      const products = await getProducts();
      const currentToken = localStorage.getItem('token');
      const cartData = await getCartData(currentToken);
      const cartItems = generateCartItemsFrom(cartData, products);
      setItems(cartItems);
    })();
  }, []);

  const getProducts = async () => {
    try {
      const getURL = `${config.endpoint}/products`;
      const getRequestResponse = await axios.get(getURL);
      const products = getRequestResponse.data;
      return products;
    } catch (error) {
      return [];
    }
  };

  const getCartData = async (token) => {
    if (!token) return [];

    try {
      const getRequestUrl = `${config.endpoint}/cart`;
      const getRequestHeaders = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const getRequestResponse = await axios.get(getRequestUrl, getRequestHeaders);
      const cartData = getRequestResponse.data;
      return cartData;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return [];
    }
  };

  return (
    <>
      <Header />
      <Grid container>
        <Grid item xs={12} md={9}>
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
            </Box>


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
            >
              PLACE ORDER
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Footer />
    </>
  );
};

export default Checkout;
