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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userControllers = void 0;
const http_status_ts_1 = require("http-status-ts");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const user_service_1 = require("./user.service");
const getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_service_1.UserServices.getAllUsers();
    (0, sendResponse_1.default)(res, {
        success: true,
        message: 'All users fetched successfully',
        data: users,
        statusCode: http_status_ts_1.HttpStatus.OK,
    });
}));
const blockUserHandle = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_service_1.UserServices.blockUserHandleFromDB(req.params.userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: 'User blocked successfully',
        statusCode: http_status_ts_1.HttpStatus.OK,
    });
}));
exports.userControllers = {
    getAllUsers,
    blockUserHandle,
};
