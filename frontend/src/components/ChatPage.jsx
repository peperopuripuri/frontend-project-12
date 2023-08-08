import {
  Row, Container,
} from 'react-bootstrap';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import Channels from './Channels';
import Messages from './Messages';
import useAuth from '../hooks/useAuth.hook';
import routes from '../utils/routes';
import { setChannels } from '../store/slices/channelsSlice';
import { setMessages } from '../store/slices/messagesSlice';
import getModal from './modals';
import { selectModalType } from '../store/slices/selectors';
import '../ChatPage.css';

const ChatBody = ({ renderModal, modalType }) => (
  <div className="h-100">
    <div className="d-flex flex-column h-100">
      <Header />
      <Container className="h-100 my-4 overflow-hidden rounded shadow">
        <Row className="h-100 bg-white flex-md-row main_chat">
          <Channels />
          <Messages />
          <ToastContainer />
        </Row>
        {renderModal(modalType)}
      </Container>
    </div>
  </div>
);

const renderModal = (type) => {
  if (!type) {
    return null;
  }
  const Modal = getModal(type);
  return <Modal />;
};

const ChatPage = () => {
  const dispatch = useDispatch();
  const { getAuthHeaders } = useAuth();
  const modalType = useSelector(selectModalType);
  const { t } = useTranslation();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(routes.dataPath(), getAuthHeaders());
        const { data } = response;
        dispatch(setChannels(data.channels));
        dispatch(setMessages(data.messages));
      } catch (error) {
        toast.error(t('toast.error'));
      }
    };
    getData();
  }, [dispatch, getAuthHeaders, t]);

  return <ChatBody renderModal={renderModal} modalType={modalType} />;
};

export default ChatPage;
