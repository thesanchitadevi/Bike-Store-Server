import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const search = this?.query?.searchTerm || this?.query?.search;

    if (search) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: search, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      });
    }
    return this;
  }

  filter() {
    const queryObject = { ...this.query };

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

    this.modelQuery = this.modelQuery.find(queryObject as FilterQuery<T>);

    return this;
  }

  sort() {
    const sort =
      (this?.query?.sort as string)?.split(',')?.join(' ') || '-createdAt';
    this.modelQuery = this.modelQuery.sort(sort as string);

    return this;
  }

  paginate() {
    const limit = Number(this?.query?.limit) || 10;
    const page = Number(this?.query?.page) || 1;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  fields() {
    const fields =
      (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v';

    this.modelQuery = this.modelQuery.select(fields);

    return this;
  }

  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(totalQueries);
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }
}

export default QueryBuilder;
