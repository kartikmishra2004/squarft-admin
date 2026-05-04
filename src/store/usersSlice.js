import { createSlice } from '@reduxjs/toolkit';
import { mockUsers } from '../data/mockData';

const initialState = {
  users: mockUsers,
  selectedUser: null,
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter(user => user.id !== action.payload);
    },
    updateUser: (state, action) => {
      const index = state.users.findIndex(u => u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...action.payload };
      }
    },
    updateUserDocStatus: (state, action) => {
      const { id, status } = action.payload;
      const user = state.users.find(u => u.id === id);
      if (user) {
        user.docStatus = status;
      }
    }
  },
});

export const { setSelectedUser, deleteUser, updateUser, updateUserDocStatus } = usersSlice.actions;
export default usersSlice.reducer;
