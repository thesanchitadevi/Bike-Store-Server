"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = void 0;
const products_services_1 = require("./products.services");
// 1. Create a Controller.
// Controller will handle request and response.
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = req.body;
        const result = yield products_services_1.getProductServices.createProductDB(product);
        console.log('result', result);
        res.status(200).json({
            success: true,
            message: 'Product created successfully',
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error in createProduct',
            error: error,
        });
    }
});
// const getAllProducts = async (req: Request, res: Response) => {
//   try {
//     const result = await getProductServices.getAllProductsDB();
//     res.status(200).json({
//       success: true,
//       message: 'All Products fetched successfully',
//       data: result,
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       success: false,
//       message: 'Error in getAllProducts',
//       error: error.message,
//     });
//   }
// };
// const getProduct = async (req: Request, res: Response) => {
//   try {
//     const id = req.params.id;
//     const result = await getProductServices.getProductDB(id);
//     res.status(200).json({
//       success: true,
//       message: 'Product fetched successfully',
//       data: result,
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       success: false,
//       message: 'Error in getProduct',
//       error: error.message,
//     });
//   }
// };
// const deleteProduct = async (req: Request, res: Response) => {
//   try {
//     const id = req.params.id;
//     const result = await getProductServices.deleteProductDB(id);
//     res.status(200).json({
//       success: true,
//       message: 'Product deleted successfully',
//       data: result,
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       success: false,
//       message: 'Error in deleteProduct',
//       error: error.message,
//     });
//   }
// };
exports.productController = {
    createProduct,
};
