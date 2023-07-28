import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const addMessage = (message) => ({
  type: 'chat/addMessage',
  payload: message,
});

export const addChannel = (channel) => ({
  type: 'chat/addChannel',
  payload: channel,
});

export const removeChannel = (id) => ({
  type: 'chat/removeChannel',
  payload: { id },
});

export const renameChannel = (id, name) => ({
  type: 'chat/renameChannel',
  payload: { id, name },
});


export const fetchChatData = createAsyncThunk(
  'chat/fetchChatData',
  async (token) => {
    const response = await axios.get('/api/v1/data', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    channels: [], 
    messages: [], 
    loading: false, 
    error: null, 
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    addChannel: (state, action) => {
      state.channels.push(action.payload);
    },
    renameChannel: (state, action) => {
      const { id, name } = action.payload;
      const channelIndex = state.channels.findIndex(
        (channel) => channel.id === id,
      );
      if (channelIndex !== -1) state.channels[channelIndex].name = name;
    },
    removeChannel: (state, action) => {
      const { id } = action.payload;
      const channelIndex = state.channels.findIndex(
        (channel) => channel.id === id,
      );
      if (channelIndex !== -1) {
        state.channels.splice(channelIndex, 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatData.fulfilled, (state, action) => {
        state.loading = false;
        state.channels = action.payload.channels;
        state.messages = action.payload.messages;
      })
      .addCase(fetchChatData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default chatSlice.reducer;
