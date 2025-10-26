import { configureStore } from '@reduxjs/toolkit';
import propertyReducer from '../features/properties/propertySlice';
import businessesReducer from "../features/businesses/businessSlice";
import customerReducer from '../features/customers/customerSlice';

export const store = configureStore({
  reducer: {
    properties: propertyReducer,
    businesses: businessesReducer,
    customers: customerReducer,
    properties: propertyReducer,
  },
});
