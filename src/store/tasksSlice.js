import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [
    { id: 'T-001', title: 'Collect RERA docs from Apex Buildcon', assignee: 'Rahul M.', due: 'Today', status: 'Pending', priority: 'High' },
    { id: 'T-002', title: 'Site visit with Ankit Sharma', assignee: 'Neha K.', due: 'Tomorrow', status: 'Scheduled', priority: 'Medium' },
    { id: 'T-003', title: 'Verify plot dimensions at Green Valley', assignee: 'Sneha P.', due: '14 Apr', status: 'New', priority: 'Low' },
    { id: 'T-004', title: 'Follow up with HDFC for client loan', assignee: 'Rizwan Khan', due: '15 Apr', status: 'In Progress', priority: 'High' },
    { id: 'T-005', title: 'Verify project boundary and entrance access', assignee: 'Marcus Holloway', assigneeId: 'U002', due: 'Today', status: 'In Progress', priority: 'High', area: 'Zone A-1', location: 'Palasia, Indore', tracking: { zone: 'Zone A-1', latitude: 22.7196, longitude: 75.8577 } },
    { id: 'T-006', title: 'Capture site photos for onboarding approval', assignee: 'Sarah Connor', assigneeId: 'U007', due: 'Today', status: 'Scheduled', priority: 'Medium', area: 'Zone B-4', location: 'Rau Road, Indore', tracking: { zone: 'Zone B-4', latitude: 22.7528, longitude: 75.8937 } },
    { id: 'T-007', title: 'Meet builder for pending KYC originals', assignee: 'Amit Verma', assigneeId: 'U008', due: 'Tomorrow', status: 'Pending', priority: 'High', area: 'Zone C-2', location: 'Vijay Nagar, Indore', tracking: { zone: 'Zone C-2', latitude: 22.6924, longitude: 75.879 } },
    { id: 'T-008', title: 'Confirm sales office location pin', assignee: 'Priya Nair', assigneeId: 'U009', due: 'This week', status: 'New', priority: 'Low', area: 'Zone D-3', location: 'Bypass Road, Indore', tracking: { zone: 'Zone D-3', latitude: 22.7359, longitude: 75.9176 } },
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
