import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatData } from '../redux/chatSlice';

const Chat = () => {
  const dispatch = useDispatch();
  const { channels, messages, loading, error } = useSelector((state) => state.chat);
  const [selectedChannel, setSelectedChannel] = useState(null);

  useEffect(() => {
    // Получение данных с сервера при открытии страницы с чатом
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchChatData(token));
    }
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleChannelClick = (channelId) => {
    setSelectedChannel(channelId);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    // Add your logic here to send the message
    // For example, dispatch an action to add the message to the store
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Список каналов (левая часть) */}
        <div className="col-md-4">
          <h2>Список каналов</h2>
          <ul className="list-group">
            {channels.map((channel) => (
              <li
                key={channel.id}
                className={`list-group-item ${selectedChannel === channel.id ? 'active' : ''}`}
                onClick={() => handleChannelClick(channel.id)}
              >
                {channel.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Показ выбранного канала */}
        <div className="col-md-8">
          <h2>{selectedChannel ? `Канал: ${channels.find((channel) => channel.id === selectedChannel)?.name}` : 'Выберите канал'}</h2>
          <hr />

          {/* Чат и форма для ввода нового сообщения */}
          <div className="card">
            <div className="card-body message-list">
              <ul className="list-group">
                {messages
                  .filter((message) => selectedChannel === null || message.channelId === selectedChannel)
                  .map((message) => (
                    <li key={message.id} className="list-group-item">
                      {message.text}
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          {/* Форма для ввода нового сообщения */}
          <div className="mt-4">
            <form onSubmit={handleSendMessage}>
              <div className="input-group">
                <div className="input-group-append">
                  <button type="submit" className="btn btn-primary">Отправить</button>
                </div>
                <input type="text" className="form-control" placeholder="Введите сообщение" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
