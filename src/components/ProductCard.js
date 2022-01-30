import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ items, token, products, product, handleAddToCart }) => {

  return (
    <Card className="card">
      <CardMedia component="img" height="140"
        image={product.image}
        alt={product.category}
      />

      <CardContent>
        <Typography gutterBottom component="div">
          {product.name}
        </Typography>
        <Typography gutterBottom variant="h6" component="div">
          ${product.cost}
        </Typography>
        <Rating name="half-rating-read" defaultValue={product.rating} precision={0.5} readOnly />
      </CardContent>

      <CardActions>
        <Button
          className="card-button"
          onClick={() => handleAddToCart(token,
            items, products, product._id, 1, { preventDuplicate: true })}>
          <AddShoppingCartOutlined /> ADD TO CART
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
