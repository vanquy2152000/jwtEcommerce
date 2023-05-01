import { createSlice } from '@reduxjs/toolkit';
import { IBooks } from '../../types/book';

interface CartItem {
    _id: string;
    quantity: number;
    detail: IBooks;
}

interface CartState {
    carts: CartItem[];
}

const initialState: CartState = {
    carts: []
};

export const orderSlice = createSlice({
    name: 'carts',
    initialState,
    reducers: {
        doAddBookAction: (state, action) => {
            let carts = state.carts

            const item = action.payload

            let isExistIndex = carts.findIndex(c => c._id === item._id)

            if (isExistIndex > -1) {
                carts[isExistIndex].quantity = carts[isExistIndex].quantity + item.currentQuantity
                if (carts[isExistIndex].quantity > carts[isExistIndex].detail.quantity) {
                    carts[isExistIndex].quantity = carts[isExistIndex].detail.quantity
                }
            } else {
                carts.push({ quantity: item.currentQuantity, _id: item._id, detail: item.detail })
            }

            // update redux
            state.carts = carts;
        },

        extraReducers: (builder) => {

        },
    }
});

export const { doAddBookAction } = orderSlice.actions;

export default orderSlice.reducer;
