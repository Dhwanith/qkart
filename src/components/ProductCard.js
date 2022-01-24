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


// {
//   "name": "Tan Leatherette Weekender Duffle",
//     "category": "Fashion",
//       "cost": 150,
//         "rating": 4,
//           "image": "https://crio-directus-assets.s3.ap-south-1.amazonaws.com/ff071a1c-1099-48f9-9b03-f858ccc53832.png",
//             "_id": "PmInA797xJhMIPti"
// }
const ProductCard = ({ product, handleAddToCart }) => {
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
          &#36;{product.cost}
        </Typography>
        <Rating name="half-rating-read" defaultValue={product.rating} precision={0.5} readOnly />
        <br />
        <br />
        <Button className="card-button"><i class="fas fa-cart-plus"></i>&nbsp;ADD TO CART</Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
