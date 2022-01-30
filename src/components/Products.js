import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import "./Products.css";

import Cart from "./Cart"

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isPostRequestRunningCurrently, setIsPostRequestRunningCurrently] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [timer, setTimer] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const [allProducts, setAllProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [token, setToken] = useState(null);

  useEffect(() => {
    performAPICall();

    const currentToken = localStorage.getItem('token')
    setToken(currentToken);
    if (currentToken) { fetchCart(currentToken); }
  }, []);

  useEffect(() => {
    const text = searchText;
    debounceSearch(text, 500);
  }, [searchText]);

  const performAPICall = async () => {
    setIsPostRequestRunningCurrently(true);
    try {
      const getURL = `${config.endpoint}/products`;
      const getRequestResponse = await axios.get(getURL);
      setProducts(getRequestResponse.data);
      setAllProducts(getRequestResponse.data);
    } catch (error) {
      setProducts([]);
    }
    setIsPostRequestRunningCurrently(false);
  };

  const performSearch = async (text) => {
    setIsPostRequestRunningCurrently(true);
    try {
      const getURL =
        (text.length === 0 ?
          `${config.endpoint}/products` :
          `${config.endpoint}/products/search?value=${text}`);
      const getRequestResponse = await axios.get(getURL);
      setProducts(getRequestResponse.data);
    } catch (error) {
      setProducts([]);
    }
    setIsPostRequestRunningCurrently(false);
  };

  const debounceSearch = (text, debounceTimeout) => {
    clearTimeout(timer);
    setTimer(setTimeout(() => performSearch(text), debounceTimeout));
  };


  const fetchCart = async (token) => {
    if (!token) return null;

    try {
      const getRequestUrl = `${config.endpoint}/cart`;
      const getRequestHeaders = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const getRequestResponse = await axios.get(getRequestUrl, getRequestHeaders);
      const newItems = getRequestResponse.data;
      setItems(newItems);
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
      return null;
    }
  };


  const isItemInCart = (items, productId) => {
    for (const item of items) {
      if (item.productId === productId) {
        return true;
      }
    }
    return false;
  };

  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if (token) {
      if (options.preventDuplicate && isItemInCart(items, productId)) {
        enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item.", { variant: "warning" });
      } else {
        try {
          const postRequestUrl = `${config.endpoint}/cart`;
          const postRequestUpdate = {
            productId: productId,
            qty: qty
          };
          const postRequestHeaders = {
            headers: { Authorization: `Bearer ${token}` }
          };
          const postRequestResponse =
            await axios.post(postRequestUrl, postRequestUpdate, postRequestHeaders);
          const newItems = postRequestResponse.data;
          setItems(newItems);
        } catch (e) {
          if (e.response && e.response.status === 400) {
            const errorMessage = e.response.data.message;
            enqueueSnackbar(errorMessage, { variant: "error" });
          } else {
            const errorMessage = "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.";
            enqueueSnackbar(errorMessage, { variant: "error" });
          }
        }
      }
    } else {
      enqueueSnackbar("Login to add an item to the Cart.", { variant: "warning" });
    }
  };

  const heroBanner = (
    <Box className="hero">
      <p className="hero-heading">
        India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
        to your door step
      </p>
    </Box>
  );

  const loadingProductsBanner = (
    <Box
      display="flex"
      flexDirection="column"
      width={1} height={"25vh"}
      alignItems="center"
      justifyContent="center">
      <CircularProgress size={36.5} />
      <Box typography="subtitle2" fontWeight="bold" mt={2}>Loading Products</Box>
    </Box>
  );

  const noProductsFoundBanner = (
    <Box
      display="flex"
      flexDirection="column"
      width={1} height={"25vh"}
      alignItems="center"
      justifyContent="center">
      <SentimentDissatisfied />
      <Box typography="subtitle2" fontWeight="bold" mt={2}>No products found</Box>
    </Box>
  );

  const grid = (
    <Grid container spacing={2}>
      {products.map((product) => {
        return (
          <Grid item xs={12} sm={6} md={4} lg={3} className="product-grid" key={product._id}>
            <ProductCard token={token} items={items} product={product} products={allProducts} handleAddToCart={addToCart} />
          </Grid>
        );
      })}
    </Grid>
  );

  return (
    <div>
      <Header hasHiddenAuthButtons={true}>
        <TextField
          className="search-desktop"
          size="small"
          style={{ width: '50%' }}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
        />
      </Header>

      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e) => setSearchText(e.target.value)}
        value={searchText}
      />
      
      <Grid container>
        <Grid item md={token ? 8 : 12}>
          <Grid container>
            <Grid item xs={12} mb={2}>
              {heroBanner}
            </Grid>
            <Grid item xs={12} mb={2} mx={2}>
              {isPostRequestRunningCurrently ? loadingProductsBanner :
                products.length === 0 ? noProductsFoundBanner : grid}
            </Grid>
          </Grid>
        </Grid>
        {
          token ? 
            (<Grid item md={4} xs={12} style={{ backgroundColor: "#E9F5E1" }}>
              <Cart isReadOnly={false} products={allProducts} items={items} handleQuantity={addToCart} />
            </Grid>) :
            null
        }
        
      </Grid>

      <Footer />
    </div>
  );
};

export default Products;
