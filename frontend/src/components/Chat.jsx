import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChatData, addMessage } from "../redux/chatSlice";
import io from "socket.io-client";
import '../styles/Chat.css';

const Chat = () => {
  const dispatch = useDispatch();
  const { channels, messages, loading, error } = useSelector(
    (state) => state.chat
  );
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    // Получение данных с сервера при открытии страницы с чатом
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(fetchChatData(token));
    }

    // Подключаемся к серверу сокетов
    const socket = io("http://localhost:3000");

    // Подписываемся на событие нового сообщения
    socket.on("newMessage", (payload) => {
      dispatch(addMessage(payload)); // Добавляем новое сообщение в Redux store
    });

    // Закрываем соединение при размонтировании компонента
    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleChannelClick = (channelId) => {
    setSelectedChannel(channelId);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!messageText.trim() || !selectedChannel) {
      return;
    }

    const newMessage = {
      body: messageText,
      channelId: selectedChannel,
      username: "admin", // Вам может понадобиться указать имя пользователя здесь
    };

    // Отправляем новое сообщение на сервер через сокет
    const socket = io("http://localhost:3000");
    socket.emit("newMessage", newMessage);

    // Очищаем поле ввода после отправки
    setMessageText("");
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
                className={`list-group-item ${
                  selectedChannel === channel.id ? "active" : ""
                }`}
                onClick={() => handleChannelClick(channel.id)}
              >
                {channel.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Показ выбранного канала */}
        <div className="col-md-8">
          <h2>
            {selectedChannel
              ? `Канал: ${
                  channels.find((channel) => channel.id === selectedChannel)
                    ?.name
                }`
              : "Выберите канал"}
          </h2>
          <hr />

          {/* Чат и форма для ввода нового сообщения */}
          <div className="card">
            <div className="card-body message-list-container">
              <ul className="list-group message-list">
                {messages
                  .filter(
                    (message) =>
                      selectedChannel === null ||
                      message.channelId === selectedChannel
                  )
                  .map((message) => (
                    <li key={message.id} className="list-group-item">
                      {message.body}
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
                  <button type="submit" className="btn btn-primary">
                    Отправить
                  </button>
                </div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Введите сообщение"
                  onChange={(e) => setMessageText(e.target.value)}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
