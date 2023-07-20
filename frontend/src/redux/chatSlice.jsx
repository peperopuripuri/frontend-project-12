import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Создаем асинхронный thunk для получения данных с сервера
export const fetchChatData = createAsyncThunk('chat/fetchChatData', async (token) => {
  const response = await axios.get('/api/v1/data', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
});

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    channels: [], // массив каналов
    messages: [], // массив сообщений
    loading: false, // флаг загрузки данных
    error: null, // ошибка при получении данных
  },
  reducers: {},
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