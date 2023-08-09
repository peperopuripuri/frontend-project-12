import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { hideModal } from '../../store/slices/modalsSlice';
import useSocketApi from '../../hooks/useSocketApi.hook';
import { selectCurrentChannelId } from '../../store/slices/selectors';

const ModalBody = ({ dispatch, t, handleRemove }) => (
  <Modal show onHide={() => dispatch(hideModal())}>
    <Modal.Header closeButton>
      <Modal.Title>{t('removeChannelModal.header')}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p className="lead">{t('removeChannelModal.body')}</p>
      <div>
        <Button
          className="m-1"
          variant="secondary"
          role="button"
          onClick={() => dispatch(hideModal())}
        >
          {t('removeChannelModal.cancel')}
        </Button>
        <Button
          className="m-1"
          variant="danger"
          role="button"
          onClick={handleRemove}
        >
          {t('removeChannelModal.delete')}
        </Button>
      </div>
    </Modal.Body>
  </Modal>
);

const RemoveChannelModal = () => {
  const dispatch = useDispatch();
  const channelId = useSelector(selectCurrentChannelId);
  const chatApi = useSocketApi();
  const { t } = useTranslation();

  const handleRemove = useCallback(async () => {
    try {
      await chatApi.removeChannel({ id: channelId });
      dispatch(hideModal());
      toast.success(t('toast.remove'));
    } catch (err) {
      toast.error(t('toast.error'));
    }
  }, [chatApi, channelId, dispatch, t]);

  return <ModalBody dispatch={dispatch} t={t} handleRemove={handleRemove} />;
};

export default RemoveChannelModal;
