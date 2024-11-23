# Bike-Store Project

The Bike-Store project is a backend application built with Express.js, Mongoose, and TypeScript to manage bike inventory and customer orders.

# Features

- Product Management: CRUD operations for managing products, such as bikes and accessories.
- Order Management: Handle customer orders efficiently with structured endpoints.
- Data Validation: Utilizes Mongoose custom validation for strong schema enforcement.
- Environment Configuration: Manages secrets securely using dotenv.
- Scalable Design: Built with modular architecture for extensibility.
- Code Quality: Maintained using ESLint, Prettier, and TypeScript.

## API Endpoints

The API includes the following routes (replace localhost:5000 with your deployed URL):

### Product Routes (/api/products)

- GET /api/products - Retrieve all products.
- POST /api/products - Add a new product.
- PUT /api/products/:productId - Update a product's details.
- DELETE /api/products/:productId - Delete a product.

### Order Routes (/api/orders)

- GET /api/orders/revenue - The total revenue from all orders.
- POST /api/orders - Place a new order.

## Technologies Used

- Backend Framework: Express.js
- Database: MongoDB with Mongoose ORM
- Language: TypeScript
- Validation: Mongoose Custom Validation
- Code Quality Tools: ESLint, Prettier
