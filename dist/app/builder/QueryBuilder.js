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
class QueryBuilder {
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    search(searchableFields) {
        var _a, _b;
        const search = ((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.searchTerm) || ((_b = this === null || this === void 0 ? void 0 : this.query) === null || _b === void 0 ? void 0 : _b.search);
        if (search) {
            this.modelQuery = this.modelQuery.find({
                $or: searchableFields.map((field) => ({
                    [field]: { $regex: search, $options: 'i' },
                })),
            });
        }
        return this;
    }
    filter() {
        const queryObject = Object.assign({}, this.query);
        // Filtering
        const excludeFields = [
            'search',
            'sort',
            'filter',
            'limit',
            'page',
            'fields',
        ];
        excludeFields.forEach((element) => delete queryObject[element]);
        // Handle model, brand, and category filtering
        if (queryObject.model) {
            queryObject.model = { $regex: queryObject.model, $options: 'i' }; // Case-insensitive search for model
        }
        if (queryObject.brand) {
            queryObject.brand = { $regex: queryObject.brand, $options: 'i' }; // Case-insensitive search for brand
        }
        if (queryObject.category) {
            queryObject.category = { $regex: queryObject.category, $options: 'i' }; // Case-insensitive search for category
        }
        // Handle price range filtering
        if (queryObject.minPrice || queryObject.maxPrice) {
            queryObject.price = {
                $gte: Number(queryObject.minPrice) || 0, // Minimum price
                $lte: Number(queryObject.maxPrice) || Infinity, // Maximum price
            };
            delete queryObject.minPrice;
            delete queryObject.maxPrice;
        }
        // Handle availability filtering
        if (queryObject.availability) {
            queryObject.inStock = queryObject.availability === 'true'; // Convert string to boolean
            delete queryObject.availability;
        }
        // Handle status filtering (for orders)
        if (queryObject.orderStatus) {
            queryObject.status = queryObject.orderStatus;
        }
        // Handle payment method filtering (for orders)
        if (queryObject.paymentMethod) {
            queryObject.paymentMethod = {
                $regex: queryObject.paymentMethod,
                $options: 'i',
            };
        }
        // Handle payment status filtering (for orders)
        if (queryObject.paymentStatus) {
            queryObject.paymentStatus = {
                $regex: queryObject.paymentStatus,
                $options: 'i',
            };
        }
        this.modelQuery = this.modelQuery.find(queryObject);
        return this;
    }
    sort() {
        var _a, _b, _c;
        const sort = ((_c = (_b = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.sort) === null || _b === void 0 ? void 0 : _b.split(',')) === null || _c === void 0 ? void 0 : _c.join(' ')) || '-createdAt';
        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }
    paginate() {
        var _a, _b;
        const limit = Number((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.limit) || 10;
        const page = Number((_b = this === null || this === void 0 ? void 0 : this.query) === null || _b === void 0 ? void 0 : _b.page) || 1;
        const skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }
    fields() {
        var _a, _b, _c;
        const fields = ((_c = (_b = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.fields) === null || _b === void 0 ? void 0 : _b.split(',')) === null || _c === void 0 ? void 0 : _c.join(' ')) || '-__v';
        this.modelQuery = this.modelQuery.select(fields);
        return this;
    }
    countTotal() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const totalQueries = this.modelQuery.getFilter();
            const total = yield this.modelQuery.model.countDocuments(totalQueries);
            const page = Number((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.page) || 1;
            const limit = Number((_b = this === null || this === void 0 ? void 0 : this.query) === null || _b === void 0 ? void 0 : _b.limit) || 10;
            const totalPage = Math.ceil(total / limit);
            return {
                page,
                limit,
                total,
                totalPage,
            };
        });
    }
}
exports.default = QueryBuilder;
