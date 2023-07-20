import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { Container, Row, Col, Form as BootstrapForm, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const LoginPage = () => {
  // Схема для валидации формы
  const validationSchema = yup.object().shape({
    username: yup.string().required('Введите имя пользователя'),
    password: yup.string().required('Введите пароль'),
  });

  // Обработка отправки формы
  const handleSubmit = (values, { setSubmitting, setStatus }) => {
    axios
      .post('/api/v1/login', values) // Отправляем POST-запрос с данными пользователя
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem('token', response.data.token); // Сохраняем токен в localStorage
          window.location.href = '/'; // Редирект на страницу с чатом
        } else {
          setStatus({ error: response.data.message }); // Обрабатываем ошибку авторизации
        }
      })
      .catch((error) => {
        console.error('Ошибка при авторизации:', error);
        setStatus({ error: 'Произошла ошибка при авторизации' });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col xs={12} sm={8} md={6} lg={4}>
          <h2 className="mb-4">Форма авторизации</h2>
          <Formik
            initialValues={{ username: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ status, isSubmitting }) => (
              <Form>
                {status && status.error && (
                  <Alert variant="danger" className="mb-3">
                    {status.error}
                  </Alert>
                )}

                <BootstrapForm.Group>
                  <BootstrapForm.Label>Имя пользователя</BootstrapForm.Label>
                  <Field type="text" name="username" className="form-control" />
                  <ErrorMessage name="username" component="div" className="text-danger" />
                </BootstrapForm.Group>

                <BootstrapForm.Group>
                  <BootstrapForm.Label>Пароль</BootstrapForm.Label>
                  <Field type="password" name="password" className="form-control" />
                  <ErrorMessage name="password" component="div" className="text-danger" />
                </BootstrapForm.Group>

                <Button type="submit" variant="primary" className="mt-3" disabled={isSubmitting}>
                  Войти
                </Button>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
