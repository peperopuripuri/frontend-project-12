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

const SignUpPage = () => {
  // Схема для валидации формы
  const validationSchema = yup.object().shape({
    username: yup
      .string()
      .required("Введите имя пользователя 🩰")
      .min(3, "Имя пользователя должно содержать не менее 3 символов 😖")
      .max(20, "Имя пользователя должно содержать не более 20 символов 🥹"),
    password: yup
      .string()
      .required("Введите пароль 🫥")
      .min(6, "Пароль должен содержать не менее 6 символов 😳"),
    passwordAgain: yup
      .string()
      .oneOf([yup.ref("password"), null], "Пароли должны совпадать 👿")
      .required("Подтвердите пароль 😮‍💨"),
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
        setStatus({ error: "Такое имя занято 🫣" });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <Container className="signUpWrapper">
      <Row className="justify-content-center mt-5">
        <Col xs={12} sm={8} md={6} lg={4}>
          <h2 className="mb-4">Форма регистрации</h2>
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
                  <BootstrapForm.Label>Имя пользователя</BootstrapForm.Label>
                  <Field type="text" name="username" className="form-control" />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-danger"
                  />
                </BootstrapForm.Group>

                <BootstrapForm.Group>
                  <BootstrapForm.Label>Пароль</BootstrapForm.Label>
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
                  <BootstrapForm.Label>Подтвердите пароль</BootstrapForm.Label>
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
                  Зарегистрироваться
                </Button>
                <Button className="mt-3 logBtn" variant="dark" href="/login">
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

export default SignUpPage;
