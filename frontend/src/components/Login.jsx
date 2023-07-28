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
import "../styles/Login.css";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import createRollbar from "../rollbar";

const LoginPage = () => {
  const { t } = useTranslation();
  const rollbar = createRollbar();
  // Схема для валидации формы
  const validationSchema = yup.object().shape({
    username: yup.string().required(t("login.errors.usernameYupRequired")),
    password: yup.string().required(t("login.errors.passwordYupRequired")),
  });

  // Обработка отправки формы
  const handleSubmit = (values, { setSubmitting, setStatus }) => {
    axios
      .post("/api/v1/login", values) // Отправляем POST-запрос с данными пользователя
      .then((response) => {
        if (response.status === 200) {
          rollbar.info(response, "Login ok");
          localStorage.setItem("token", response.data.token); // Сохраняем токен в localStorage
          localStorage.setItem("username", response.data.username);
          window.location.href = "/"; // Редирект на страницу с чатом
        } else {
          setStatus({ error: response.data.message }); // Обрабатываем ошибку авторизации
        }
      })
      .catch((error) => {
        rollbar.error(error, "Login error");
        console.error("Ошибка при авторизации:", error);
        toast.error(t("login.errors.errorAuth"));
        setStatus({ error: t("login.errors.errorAuth") });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <Container className="loginWrapper">
      <Row className="justify-content-center mt-5">
        <Col xs={12} sm={8} md={6} lg={4}>
          <h2 className="mb-4">{t("login.texts.authForm")}</h2>
          <Formik
            initialValues={{ username: "", password: "" }}
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
                  <BootstrapForm.Label htmlFor="username">
                    {t("login.texts.username")}
                  </BootstrapForm.Label>
                  <Field
                    type="text"
                    name="username"
                    id="username"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-danger"
                  />
                </BootstrapForm.Group>

                <BootstrapForm.Group>
                  <BootstrapForm.Label htmlFor="password">
                    {t("login.texts.password")}
                  </BootstrapForm.Label>
                  <Field
                    type="password"
                    name="password"
                    id="password"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="password"
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
                  {t("login.texts.ButtonLog")}
                </Button>
                <Button className="mt-3 regBtn" variant="dark" href="/signup">
                  {t("login.texts.ButtonReg")}
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
