import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatData } from '../redux/chatSlice';

const Chat = () => {
  const dispatch = useDispatch();
  const { channels, messages, loading, error } = useSelector((state) => state.chat);

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

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Список каналов (левая часть) */}
        <div className="col-md-4">
          <h2>Список каналов</h2>
          <ul className="list-group">
            {channels.map((channel) => (
              <li key={channel.id} className="list-group-item">
                {channel.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Чат и форма для ввода нового сообщения (правая часть) */}
        <div className="col-md-8">
          <h2>Чат</h2>
          <div className="card">
            <div className="card-body">
              <ul className="list-group">
                {messages.map((message) => (
                  <li key={message.id} className="list-group-item">
                    {message.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Форма для ввода нового сообщения */}
          <div className="mt-4">
            <form>
              <div className="form-group">
                <input type="text" className="form-control" placeholder="Введите сообщение" />
              </div>
              <button type="submit" className="btn btn-primary">
                Отправить
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
