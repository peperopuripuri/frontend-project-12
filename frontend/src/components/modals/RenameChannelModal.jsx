import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Form, Button, Modal, FormText,
} from 'react-bootstrap';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { hideModal } from '../../store/slices/modalsSlice';
import useSocketApi from '../../hooks/useSocketApi.hook';

const RenameChannelModal = () => {
  const channels = useSelector((state) => state.channels.channels);
  const channelId = useSelector((state) => state.channels.currentChannelId);
  const currentChannel = channels.find((channel) => channel.id === channelId);
  const currentChannelName = currentChannel.name;

  const dispatch = useDispatch();
  const chatApi = useSocketApi();
  const inputEl = useRef();
  const { t } = useTranslation();

  useEffect(() => {
    inputEl.current.select();
  }, []);

  const handleRename = async (values) => {
    try {
      await chatApi.renameChannel({ id: channelId, name: values.name });
      toast.success(t('toast.rename'));
      dispatch(hideModal());
    } catch (err) {
      toast.error(t('toast.error'));
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, t('renameChannelModal.validation.min'))
      .notOneOf(
        channels.map((channel) => channel.name),
        t('renameChannelModal.validation.unique'),
      )
      .required(t('renameChannelModal.validation.required')),
  });

  const formik = useFormik({
    initialValues: {
      name: currentChannelName,
    },
    validationSchema,
    onSubmit: handleRename,
  });

  const renderFormFeedback = () => formik.errors.name && formik.touched.name && (
  <FormText className="feedback text-danger mt-3">
    {formik.errors.name}
  </FormText>
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    formik.handleSubmit();
  };

  return (
    <Modal show onHide={() => dispatch(hideModal())}>
      <Modal.Header closeButton>
        <Modal.Title>{t('renameChannelModal.header')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Control
              value={formik.values.name}
              onChange={formik.handleChange}
              ref={inputEl}
              aria-label="form"
              name="name"
              type="text"
              disabled={formik.isSubmitting}
              autoFocus
              autoComplete="off"
              isInvalid={formik.errors.name && formik.touched.name}
            />
            <Form.Label className="visually-hidden" htmlFor="name">
              {t('renameChannelModal.label')}
            </Form.Label>
            {renderFormFeedback()}
          </Form.Group>
          <div>
            <Button
              className="m-1"
              role="button"
              disabled={formik.isSubmitting}
              variant="secondary"
              onClick={() => dispatch(hideModal())}
            >
              {t('renameChannelModal.cancel')}
            </Button>
            <Button
              className="m-1"
              variant="primary"
              disabled={formik.isSubmitting}
              role="button"
              type="submit"
            >
              {t('renameChannelModal.rename')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default RenameChannelModal;
