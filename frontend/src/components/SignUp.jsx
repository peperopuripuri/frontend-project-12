import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import {
  Container,
  Row,
  Col,
  Form as BootstrapForm,
  Button,
  Alert,
} from "react-bootstrap";
import axios from "axios";
import "../styles/SignUp.css";
import { useTranslation } from 'react-i18next';
import i18n from "../resources/i18nextInit";

const SignUpPage = () => {
  const { t } = useTranslation();

  const validationSchema = yup.object().shape({
    username: yup
      .string()
      .required(t('signUp.errors.usernameYupRequired'))
      .min(3, t('signUp.errors.usernameYupMin'))
      .max(20, t('signUp.errors.usernameYupMax')),
    password: yup
      .string()
      .required(t('signUp.errors.passwordYupRequired'))
      .min(6, t('signUp.errors.passwordYupMin')),
    passwordAgain: yup
      .string()
      .oneOf([yup.ref("password"), null], t('signUp.errors.passwordAgainOneOf'))
      .required(t('signUp.errors.passwordAgainRequired')),
  });

  // Обработка отправки формы
  const handleSubmit = (values, { setSubmitting, setStatus }) => {
    axios
      .post("/api/v1/signup", values) // Отправляем POST-запрос с данными пользователя
      .then((response) => {
        if (response.status === 201) {
          localStorage.setItem("token", response.data.token); // Сохраняем токен в localStorage
          localStorage.setItem("username", response.data.username); // Сохраняем токен в localStorage
          window.location.href = "/"; // Редирект на страницу с чатом
        } else {
          setStatus({ error: response.data.message }); // Обрабатываем ошибку авторизации
        }
      })
      .catch((error) => {
        console.error("Ошибка при регистрации:", error);
        setStatus({ error: t('signUp.errors.catchedError') });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <Container className="signUpWrapper">
      <Row className="justify-content-center mt-5">
        <Col xs={12} sm={8} md={6} lg={4}>
          <h2 className="mb-4">{t('signUp.texts.regForm')}</h2>
          <Formik
            initialValues={{ username: "", password: "", passwordAgain: "" }}
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
                  <BootstrapForm.Label>{t('signUp.texts.username')}</BootstrapForm.Label>
                  <Field type="text" name="username" className="form-control" />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-danger"
                  />
                </BootstrapForm.Group>

                <BootstrapForm.Group>
                  <BootstrapForm.Label>{t('signUp.texts.password')}</BootstrapForm.Label>
                  <Field
                    type="password"
                    name="password"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-danger"
                  />
                </BootstrapForm.Group>

                <BootstrapForm.Group>
                  <BootstrapForm.Label>{t('signUp.texts.passwordAfain')}</BootstrapForm.Label>
                  <Field
                    type="password"
                    name="passwordAgain"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="passwordAgain"
                    component="div"
                    className="text-danger"
                  />
                </BootstrapForm.Group>

                <Button
                  type="submit"
                  variant="primary"
                  className="mt-3 btn-success"
                  disabled={isSubmitting}
                >
                  {t('signUp.texts.ButtonReg')}
                </Button>
                <Button className="mt-3 logBtn" variant="dark" href="/login">
                {t('signUp.texts.ButtonLog')}
                </Button>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUpPage;
