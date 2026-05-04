import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [
    { id: 'T-001', title: 'Collect RERA docs from Apex Buildcon', assignee: 'Rahul M.', due: 'Today', status: 'Pending', priority: 'High' },
    { id: 'T-002', title: 'Site visit with Ankit Sharma', assignee: 'Neha K.', due: 'Tomorrow', status: 'Scheduled', priority: 'Medium' },
    { id: 'T-003', title: 'Verify plot dimensions at Green Valley', assignee: 'Sneha P.', due: '14 Apr', status: 'New', priority: 'Low' },
    { id: 'T-004', title: 'Follow up with HDFC for client loan', assignee: 'Rizwan Khan', due: '15 Apr', status: 'In Progress', priority: 'High' },
  ],
  loading: false,
  error: null,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks.unshift({
        id: `T-00${state.tasks.length + 1}`,
        ...action.payload,
        status: 'New',
      });
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    updateTaskStatus: (state, action) => {
      const { id, status } = action.payload;
      const task = state.tasks.find(t => t.id === id);
      if (task) {
        task.status = status;
      }
    },
  },
});

export const { addTask, deleteTask, updateTaskStatus } = tasksSlice.actions;
export default tasksSlice.reducer;
