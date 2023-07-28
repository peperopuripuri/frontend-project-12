import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button, Form, Alert, Container } from 'react-bootstrap';
import Profanity from 'leo-profanity';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import io from 'socket.io-client';
import {
  fetchChatData,
  addMessage,
  addChannel,
  removeChannel,
  renameChannel,
} from '../redux/chatSlice';
import '../styles/Chat.css';
import 'react-toastify/dist/ReactToastify.css';

const createSocket = () =>
  io(process.env.SERVER_ADDRESS || 'http://localhost:3000');

const filterMessage = (message) => {
  return Profanity.clean(message);
};

function Chat() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { channels, messages, loading, error } = useSelector(
    (state) => state.chat,
  );
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [newChannelName, setNewChannelName] = useState('');
  const [showModalDeleteChannel, setShowModalDeleteChannel] = useState(false);
  const [warning, setWarning] = useState('');
  const [warningMessage, setWarningMessage] = useState('');
  const [showModalAddChannel, setShowModalAddChannel] = useState(false);
  const [showModalRenameChannel, setShowModalRenameChannel] = useState(false);
  const username = localStorage.getItem('username');

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      dispatch(fetchChatData(token));
    }

    const socket = createSocket();

    socket.on('newMessage', (payload) => {
      dispatch(addMessage(payload));
    });

    socket.on('newChannel', (payload) => {
      dispatch(addChannel(payload));
      setSelectedChannel(payload.id);
    });

    socket.on('removeChannel', (payload) => {
      dispatch(removeChannel(payload));
    });

    socket.on('renameChannel', (payload) => {
      dispatch(renameChannel(payload));
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: '100vh' }}
      >
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    if (error) {
      toast.error(t('chat.errors.unAuthUser'));
      return (
        <Container
          className="d-flex justify-content-center align-items-center flex-column"
          style={{ height: '100vh' }}
        >
          <Alert variant="danger">{t('chat.errors.unAuthUser')}</Alert>
          <Form>
            <Button className="mt-3 regBtn" variant="dark" href="/signup">
              {t('chat.texts.ButtonReg')}
            </Button>
            <Button className="mt-3 logBtn" variant="dark" href="/login">
              {t('chat.texts.ButtonLog')}
            </Button>
          </Form>
        </Container>
      );
    }
  }

  const handleChannelClick = (channelId) => {
    setSelectedChannel(channelId);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!selectedChannel) {
      setWarningMessage(t('chat.errors.notSelectedChannel'));
      toast.error(t('chat.errors.notSelectedChannel'));
      return;
    }

    if (!messageText.trim()) {
      toast.error(t('chat.errors.empetyMess'));
      setWarningMessage(t('chat.errors.empetyMess'));
      return;
    }
    const filteredMessageText = filterMessage(messageText);

    const newMessage = {
      body: filteredMessageText,
      channelId: selectedChannel,
      username,
    };

    const socket = createSocket();
    socket.emit('newMessage', newMessage);

    document.querySelector('.send-mess-input').value = '';
    setWarningMessage('');
  };

  const handleCloseModalAddChannel = () => {
    setShowModalAddChannel(false);
  };

  const handleShowModalAddChannel = () => {
    setShowModalAddChannel(true);
  };

  const handleCloseModalRenameChannel = () => {
    setShowModalRenameChannel(false);
  };

  const handleShowModalRenameChannel = () => {
    setShowModalRenameChannel(true);
  };

  const handleCancelDelete = () => {
    setShowModalDeleteChannel(false);
  };

  const handleDeleteChannel = () => {
    setShowModalDeleteChannel(true);
  };

  const handleAddChannel = (e) => {
    e.preventDefault();
    const socket = createSocket();
    const names = channels.map((chan) => chan.name);

    if (!newChannelName.trim()) {
      setWarning(t('chat.errors.empetyChan'));
      toast.error(t('chat.errors.empetyChan'));
      return;
    }

    if (names.includes(newChannelName)) {
      toast.error(t('chat.errors.alreadyChan'));
      setWarning(t('chat.errors.alreadyChan'));
      return;
    }

    const newChannel = {
      id: channels.length + 1,
      name: newChannelName.trim(),
      creator: username,
      removable: true,
    };

    socket.emit('newChannel', newChannel);

    setSelectedChannel(newChannel.id);

    setWarning('');
    setNewChannelName('');
    handleCloseModalAddChannel();
    toast.success(t('chat.texts.toastChanSucc'));
  };

  const handleConfirmDelete = (e) => {
    e.preventDefault();
    const socket = createSocket();

    if (selectedChannel !== 1 && selectedChannel !== 2) {
      socket.emit('removeChannel', {
        id: selectedChannel,
        name: newChannelName.trim(),
      });
      setSelectedChannel(null);
      setShowModalDeleteChannel(false);
      setWarning('');
      dispatch(removeChannel(selectedChannel));
      toast.success(t('chat.texts.toastChanDeleteSucc'));
    } else {
      toast.error(t('chat.errors.deleteDefaultChan'));
      setWarning(t('chat.errors.deleteDefaultChan'));
    }
  };

  const handleRenameChannel = (e) => {
    e.preventDefault();
    const socket = createSocket();
    const names = channels.map((chan) => chan.name);

    if (!newChannelName.trim()) {
      setWarning(t('chat.errors.empetyChan'));
      toast.error(t('chat.errors.empetyChan'));
      return;
    }

    if (selectedChannel === 1 || selectedChannel === 2) {
      setWarning(t('chat.errors.renameDefaultChan'));
      toast.error(t('chat.errors.renameDefaultChan'));
      return;
    }

    if (names.includes(newChannelName)) {
      toast.error(t('chat.errors.alreadyChan'));
      setWarning(t('chat.errors.alreadyChan'));
      return;
    }

    socket.emit('renameChannel', {
      id: selectedChannel,
      name: newChannelName.trim(),
    });

    setNewChannelName('');
    handleCloseModalRenameChannel();
    setWarning('');
    dispatch(renameChannel(selectedChannel, newChannelName.trim()));
    toast.success(t('chat.texts.toastChanRenameSucc'));
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Список каналов (левая часть) */}
        <div className="col-md-4">
          <h2>{t('chat.texts.channList')}</h2>
          <ul className="list-group">
            {channels.map((channel) => (
              <Button
                key={channel.id}
                className={`list-group-item ${
                  selectedChannel === channel.id ? 'active' : ''
                }`}
                onClick={() => handleChannelClick(channel.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleChannelClick(channel.id);
                  }
                }}
                tabIndex={0}
              >
                # {channel.name}
              </Button>
            ))}
          </ul>
          <div>
            <Modal show={showModalDeleteChannel} onHide={handleCancelDelete}>
              <Modal.Header closeButton>
                <Modal.Title>{t('chat.texts.confirmDelete')}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {warning && <Alert variant="warning">{warning}</Alert>}
                {t('chat.texts.confirmDeleteRURealy')}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCancelDelete}>
                  {t('chat.texts.confirmDeleteCancel')}
                </Button>
                <Button
                  autoFocus
                  variant="danger"
                  onClick={handleConfirmDelete}
                >
                  {t('chat.texts.confirmDeleteDeletion')}
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
          <br />
          {warningMessage && <Alert variant="warning">{warningMessage}</Alert>}
          {/* Выпадающее меню с кнопками управления каналом */}
          <div className="dropdown mt-4">
            <button
              className="btn btn-secondary dropdown-toggle bg-success"
              type="button"
              id="channelActionsDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {t('chat.texts.actions')}
            </button>
            <ul
              className="dropdown-menu"
              aria-labelledby="channelActionsDropdown"
            >
              {/* Кнопка добавления нового канала */}
              <li>
                <Button
                  variant="link"
                  onClick={handleShowModalAddChannel}
                  className="dropdown-item"
                >
                  {t('chat.texts.addChannel')}
                </Button>
              </li>
              {/* Кнопка удаления канала */}
              {selectedChannel && (
                <li>
                  <Button
                    className="dropdown-item"
                    onClick={handleDeleteChannel}
                  >
                    {t('chat.texts.deleteChan')}
                  </Button>
                </li>
              )}
              {/* Кнопка переименования канала */}
              {selectedChannel && (
                <li>
                  <Button
                    className="dropdown-item"
                    onClick={handleShowModalRenameChannel}
                  >
                    {t('chat.texts.renameChan')}
                  </Button>
                </li>
              )}
            </ul>
          </div>

          {/* Модальное окно для добавления канала */}
          <Modal
            show={showModalAddChannel}
            onHide={handleCloseModalAddChannel}
            aria-labelledby="addChannelModalLabel"
          >
            <Modal.Header closeButton>
              <Modal.Title id="addChannelModalLabel">
                {t('chat.texts.addChan')}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {warning && <Alert variant="warning">{warning}</Alert>}
              <Form onSubmit={handleAddChannel}>
                <Form.Group className="mb-3" controlId="newChannelName">
                  <Form.Label>{t('chat.texts.nameChan')}</Form.Label>
                  <Form.Control
                    type="text"
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                  />
                </Form.Group>
                <Button variant="success" type="submit">
                  {t('chat.texts.add')}
                </Button>
              </Form>
            </Modal.Body>
          </Modal>

          {/* Модальное окно для переименования канала */}
          <Modal
            show={showModalRenameChannel}
            onHide={handleCloseModalRenameChannel}
            aria-labelledby="renameChannelModalLabel"
          >
            <Modal.Header closeButton>
              <Modal.Title id="renameChannelModalLabel">
                {t('chat.texts.renameChan')}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {warning && <Alert variant="warning">{warning}</Alert>}
              <Form onSubmit={handleRenameChannel}>
                <Form.Group className="mb-3" controlId="newChannelName">
                  <Form.Label>{t('chat.texts.newNameChan')}</Form.Label>
                  <Form.Control
                    type="text"
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                  />
                </Form.Group>
                <Button variant="success" type="submit">
                  {t('chat.texts.rename')}
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
        </div>

        {/* Показ выбранного канала */}
        <div className="col-md-8">
          <h2>
            {selectedChannel
              ? `${t('chat.texts.channel')}: ${
                  channels.find((channel) => channel.id === selectedChannel)
                    ?.name
                }`
              : t('chat.texts.chooseChannel')}
          </h2>
          <hr />

          {/* Чат и форма для ввода нового сообщения */}
          <div className="card">
            <div className="card-body message-list-container">
              {selectedChannel === null ? (
                setSelectedChannel(1)
              ) : (
                <ul className="list-group message-list">
                  {/* Display only the last 'maxDisplayedMessages' messages */}
                  {messages
                    .filter(
                      (message) =>
                        selectedChannel === null ||
                        message.channelId === selectedChannel,
                    )
                    .map((message) => (
                      <li key={message.id} className="list-group-item">
                        <span className="message-sender">
                          {message.username}:
                        </span>{' '}
                        {message.body}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>

          {/* Форма для ввода нового сообщения */}
          <div className="mt-4">
            <form onSubmit={handleSendMessage}>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control send-mess-input"
                  placeholder={t('chat.texts.enterMess')}
                  onChange={(e) => setMessageText(e.target.value)}
                  aria-label={t('chat.texts.newMess')}
                />
                <div className="input-group-append">
                  <button type="submit" className="btn btn-success">
                    {t('chat.texts.send')}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
