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
exports.getProductServices = void 0;
const products_model_1 = require("../products.model");
// services are used to interact with the database
const createProductDB = (productData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield products_model_1.ProductModel.create(productData);
    console.log('result', result);
    return result;
});
// const getAllProductDB = async () => {
//   const result = await ProductModel.find();
//   return result;
// };
// const getProductDB = async (id: string) => {
//     const result = await ProductModel.findOne({ id });
// };
// const deleteProductDB = async (id: string) => {
//   const result = await ProductModel.updateOne({ id }, { isDeleted: true });
//   return result;
// };
exports.getProductServices = {
    createProductDB,
};
