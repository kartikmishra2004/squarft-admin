import { createSlice } from '@reduxjs/toolkit';
import { mockUsers } from '../data/mockData';

const initialState = {
  users: mockUsers.map(user => ({
    status: 'Active',
    documents: {},
    ...user,
  })),
  selectedUser: null,
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.users.unshift({
        status: 'Active',
        documents: {},
        ...action.payload,
      });
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter(user => user.id !== action.payload);
      if (state.selectedUser?.id === action.payload) {
        state.selectedUser = null;
      }
    },
    updateUser: (state, action) => {
      const index = state.users.findIndex(u => u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...action.payload };
        if (state.selectedUser?.id === action.payload.id) {
          state.selectedUser = state.users[index];
        }
      }
    },
    updateUserDocStatus: (state, action) => {
      const { id, status } = action.payload;
      const user = state.users.find(u => u.id === id);
      if (user) {
        user.docStatus = status;
        if (state.selectedUser?.id === id) {
          state.selectedUser = { ...state.selectedUser, docStatus: status };
        }
      }
    },
    updateUserDocument: (state, action) => {
      const { id, docKey, document } = action.payload;
      const user = state.users.find(u => u.id === id);
      if (user) {
        user.documents = {
          ...(user.documents || {}),
          [docKey]: document,
        };
        if (state.selectedUser?.id === id) {
          state.selectedUser = {
            ...state.selectedUser,
            documents: {
              ...(state.selectedUser.documents || {}),
              [docKey]: document,
            },
          };
        }
      }
    },
    removeUserDocument: (state, action) => {
      const { id, docKey } = action.payload;
      const user = state.users.find(u => u.id === id);
      if (user?.documents) {
        delete user.documents[docKey];
        if (state.selectedUser?.id === id) {
          const documents = { ...(state.selectedUser.documents || {}) };
          delete documents[docKey];
          state.selectedUser = { ...state.selectedUser, documents };
        }
      }
    }
  },
});

export const {
  addUser,
  setSelectedUser,
  deleteUser,
  updateUser,
  updateUserDocStatus,
  updateUserDocument,
  removeUserDocument
} = usersSlice.actions;
export default usersSlice.reducer;
