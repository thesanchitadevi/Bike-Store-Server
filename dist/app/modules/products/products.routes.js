"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRouter = void 0;
const express_1 = __importDefault(require("express"));
const products_controller_1 = require("./products.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const products_validation_1 = require("./products.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const multer_config_1 = require("../../config/multer.config");
const router = express_1.default.Router();
// Routes
router.post('/', (0, auth_1.default)('admin'), multer_config_1.multerUpload.single('file'), 
// validateRequest(ProductValidationSchema.createProductValidationSchema),
products_controller_1.productController.createProduct);
router.get('/', products_controller_1.productController.getAllProducts);
router.get('/:productId', products_controller_1.productController.getProduct);
router.put('/:productId', (0, auth_1.default)('admin'), (0, validateRequest_1.default)(products_validation_1.ProductValidationSchema.updateProductValidationSchema), products_controller_1.productController.updateProduct);
router.delete('/:productId', products_controller_1.productController.deleteProduct);
// Export the router
exports.ProductRouter = router;
