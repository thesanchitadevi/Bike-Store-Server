# Bike-Store Project

The Bike-Store project is a backend application built with Express.js, Mongoose, and TypeScript to manage bike inventory and customer orders.

# Features

- **_Product Management_**: CRUD operations for managing products, such as bikes and accessories.
- **_Order Management_**: Handle customer orders efficiently with structured endpoints.
- **_Data Validation_**: Utilizes Mongoose custom validation for strong schema enforcement.
- **_Environment Configuration_**: Manages secrets securely using dotenv.
- **_Scalable Design_**: Built with modular architecture for extensibility.
- **_Code Quality_**: Maintained using ESLint, Prettier, and TypeScript.

## API Endpoints

The API includes the following routes :

### Product Routes (/api/products)

- _GET_ `/api/products` - Retrieve all products.
- _POST_ `/api/products` - Add a new product.
- _GET_ `/api/products/:productId` - Retrieve a product's details.
- _PUT_ `/api/products/:productId` - Update a product's details.
- _DELETE_ `/api/products/:productId` - Delete a product.

### Order Routes (/api/orders)

- _GET_ `/api/orders/revenue` - The total revenue from all orders.
- _POST_ `/api/orders` - Place a new order.

## Technologies Used

- Backend Framework: **_Express.js_**
- Database: **_MongoDB with Mongoose ORM_**
- Language: **_TypeScript_**
- Validation: **_Mongoose Custom Validation_**
- Code Quality Tools: **_ESLint, Prettier_**

## Setup

- Initialize the Node.js project: `npm init -y`

### Install Required Packages:

- Install Express.js for routing: `npm install express --save`

- Install Mongoose for MongoDB: `npm install mongoose --save`

- Install TypeScript: `npm install typescript --save-dev`

- Install TypeScript Compiler: `npm install tsc --save-dev`

- Install TypeScript for Node.js: `npm install @types/node --save-dev`

- Install ESLint: `npm install eslint --save-dev`

- Install Prettier: `npm install prettier --save-dev`

- Install dotenv for environment variables: `npm install dotenv --save`

- Install ts-node for running TypeScript: `npm install ts-node --save-dev`

- Install nodemon for auto-reloading: `npm install nodemon --save-dev`

- Install TypeScript for Mongoose: `npm install @types/mongoose --save-dev`

- Install CORS for cross-origin resource sharing: `npm i cors`

## Project Structure

The project structure follows the MVC pattern. The `src` directory contains the following subdirectories and files:

- `app.ts`: Initializes the Express application and configures middleware.
- `server.ts`: Starts the server and listens on the specified port.
- `app`: Contains the main application logic.
  - `config`: Contains configuration files for the application.
    - `index.ts`: Configuration settings for the application.
  - `modules`: Contains the different modules of the application.
    - `products`: Contains the product module.
    - `orders`: Contains the order module.

## Running the Application

To run the application, execute the following command:

```bash
npm run dev
```

The application will run on `http://localhost:5000`.

## Conclusion

The Bike-Store project is a robust backend application that simplifies bike inventory management and customer order processing. It is built with Express.js, Mongoose, and TypeScript, providing a scalable and maintainable solution for bike store owners.
