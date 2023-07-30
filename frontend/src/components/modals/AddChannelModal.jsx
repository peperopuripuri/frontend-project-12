import React, { useCallback } from 'react';
import { Button, Form, Modal, FormText } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useSocketApi from '../../hooks/useSocketApi.hook';
import * as channelActions from '../../store/slices/channelsSlice';
import { hideModal } from '../../store/slices/modalsSlice';

const AddChannelModal = () => {
  const channels = useSelector((state) => state.channels.channels);
  const dispatch = useDispatch();
  const chatApi = useSocketApi();
  const { t } = useTranslation();

  const validate = Yup.object({
    name: Yup.string()
      .min(3, t('addChannelModal.validation.min'))
      .notOneOf(channels.map((c) => c.name), t('addChannelModal.validation.unique'))
      .required(t('addChannelModal.validation.required')),
  });

  const handleSubmit = useCallback(async (values, { resetForm }) => {
    const channelData = {
      name: values.name,
      removable: true,
    };

    try {
      const response = await chatApi.createChannel(channelData);
      toast.success(t('toast.add'));
      dispatch(channelActions.setCurrentChannelId(response.id));
      resetForm({ values: '' });
      dispatch(hideModal());
    } catch (error) {
      toast.error(t('toast.error'));
    }
  }, [chatApi, dispatch, t]);

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    onSubmit: handleSubmit,
    validationSchema: validate,
  });

  const renderErrorFeedback = () => {
    if (formik.errors.name && formik.touched.name) {
      return <FormText className="feedback text-danger mt-3">{formik.errors.name}</FormText>;
    }
    return null;
  };

  const handleModalClose = () => {
    dispatch(hideModal());
  };

  return (
    <Modal show>
      <Modal.Header closeButton onHide={handleModalClose}>
        <Modal.Title>{t('addChannelModal.header')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          {renderFormContent(formik, t)}
        </Form>
      </Modal.Body>
    </Modal>
  );
};

const renderFormContent = (formik, t) => {
  return (
    <Form.Group className="mb-3" controlId="name">
      <Form.Control
        value={formik.values.name}
        onChange={formik.handleChange}
        type="text"
        name="name"
        disabled={formik.isSubmitting}
        placeholder={t('addChannelModal.label')}
        autoFocus
        isInvalid={formik.errors.name && formik.touched.name}
      />
      <Form.Label className="visually-hidden" htmlFor="name">
        {t('addChannelModal.label')}
      </Form.Label>
      {renderErrorFeedback(formik)}
      {renderButtons(t)}
    </Form.Group>
  );
};

const renderErrorFeedback = (formik) => {
  if (formik.errors.name && formik.touched.name) {
    return <FormText className="feedback text-danger mt-3">{formik.errors.name}</FormText>;
  }
  return null;
};

const renderButtons = (t) => {
  return (
    <>
      <Button variant="secondary" onClick={handleModalClose} className="m-1">
        {t('addChannelModal.cancel')}
      </Button>
      <Button variant="primary" onClick={formik.handleSubmit} type="submit" className="m-1">
        {t('addChannelModal.submit')}
      </Button>
    </>
  );
};

export default AddChannelModal;
