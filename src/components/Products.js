import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Typography
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

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isPostRequestRunningCurrently, setIsPostRequestRunningCurrently] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    performAPICall();
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
    } catch (error) {
      setProducts([]);
    }
    setIsPostRequestRunningCurrently(false);
  };

  const performSearch = async (text) => {
    setIsPostRequestRunningCurrently(true);
    try {
      const getURL =
        text.length == 0 ?
          `${config.endpoint}/products` :
          `${config.endpoint}/products/search?value=${text}`;
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
    <Grid container>
      {products.map((product) => {
        return (
          <Grid item xs={6} md={3} className="product-grid" key={product._id}>
            <ProductCard product={product} />
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

      <Box className="hero">
        <p className="hero-heading">
          India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
          to your door step
        </p>
      </Box>

      {isPostRequestRunningCurrently ? loadingProductsBanner :
        products.length == 0 ? noProductsFoundBanner : grid}

      <Footer />
    </div>
  );
};

export default Products;
