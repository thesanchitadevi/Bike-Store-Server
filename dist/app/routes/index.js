"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_routes_1 = require("../modules/products/products.routes");
const orders_routes_1 = require("../modules/orders/orders.routes");
const auth_routes_1 = require("../modules/authentication/auth.routes");
const user_routes_1 = require("../modules/user/user.routes");
const router = (0, express_1.Router)();
// Application routes
const moduleRoutes = [
    {
        path: '/auth',
        module: auth_routes_1.AuthRouter,
    },
    {
        path: '/users',
        module: user_routes_1.UserRouter,
    },
    {
        path: '/products',
        module: products_routes_1.ProductRouter,
    },
    {
        path: '/orders',
        module: orders_routes_1.OrderRouter,
    },
];
moduleRoutes.forEach((route) => {
    router.use(route.path, route.module);
});
exports.default = router;
