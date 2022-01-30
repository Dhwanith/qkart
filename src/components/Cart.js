import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import {
  Button,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";


export const generateCartItemsFrom = (cartData, productsData) => {
  const cartItems = [];
  for (const item of cartData) {
    for (const product of productsData) {
      if (item.productId === product._id) {
        cartItems.push({ ...product, qty: item.qty });
      }
    }
  }
  return cartItems;
};


export const getTotalCartValue = (items = []) => {
  let totalCost = 0;
  for (const item of items) {
    totalCost += item.cost * item.qty;
  }
  return totalCost;
};


export const getTotalItems = (items = []) => {
  return items.length;
};


const ItemQuantity = ({
  value,
  handleAdd,
  handleDelete,
  isReadOnly
}) => {
  return (
    <Stack direction="row" alignItems="center">
      {
        isReadOnly ? '' :
          (<IconButton size="small" color="primary" onClick={handleDelete}>
            <RemoveOutlined />
          </IconButton>)
      }
      <Box padding="0.5rem" data-testid="item-qty">
        {
          isReadOnly === true ?
            <Typography component="div" mr={4} className="is-read-only">Qty: {value}</Typography> :
            value
        }
      </Box>
      {
        isReadOnly === true ? '' :
          (<IconButton size="small" color="primary" onClick={handleAdd}>
            <AddOutlined />
          </IconButton>)
      }
    </Stack>
  );
};

const Cart = ({
  products,
  items = [],
  handleQuantity,
  isReadOnly,
  validateRequest,
  addresses,
  performCheckout
}) => {
  const history = useHistory();

  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  const cartItems = isReadOnly ? items : generateCartItemsFrom(items, products);
  const token = localStorage.getItem('token');

  return (
    <>
      <Box className="cart">
        {
          cartItems.map(cartItem =>
            <Box display="flex" alignItems="flex-start" padding="1rem" background="white" key={cartItem._id}>
              <Box className="image-container">
                <img
                  src={cartItem.image}
                  alt={cartItem.name}
                />
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                height="6rem"
                paddingX="1rem"
              >
                <div>{cartItem.name}</div>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <ItemQuantity
                    value={cartItem.qty}
                    handleAdd={() =>
                      handleQuantity(token, items, products, cartItem._id, cartItem.qty + 1)}
                    handleDelete={() =>
                      handleQuantity(token, items, products, cartItem._id, cartItem.qty - 1)}
                    isReadOnly={isReadOnly}
                  />
                  <Box padding="0.5rem" fontWeight="700">
                    ${cartItem.cost}
                  </Box>
                </Box>
              </Box>
            </Box>
          )
        }
        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(cartItems)}
          </Box>
        </Box>

        <Box display="flex" justifyContent="flex-end" className="cart-footer">
          <Button
            color="primary"
            variant="contained"
            startIcon={<ShoppingCart />}
            className="checkout-btn"
            onClick={() => {
              if (isReadOnly) {
                if (validateRequest(cartItems, addresses)) {
                  performCheckout(token, cartItems, addresses);
                }
              } else {
                history.push("/checkout");
              }
            }}
          >
            Checkout
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Cart;
