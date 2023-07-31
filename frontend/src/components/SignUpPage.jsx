import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  FormText,
} from 'react-bootstrap';
import * as Yup from 'yup';
import axios from 'axios';
import { useFormik } from 'formik';
import routes from '../utils/routes';
import useAuth from '../hooks/useAuth.hook';

const renderFormField = (name, placeholder, formik, error) => {
  const fieldName = name;
  return (
    <Form.Group className="mb-3 form-floating" key={fieldName}>
      <Form.Control
        value={formik.values[fieldName]}
        onChange={formik.handleChange}
        type={
          name === 'password' || name === 'confirmPassword'
            ? 'password'
            : 'text'
        }
        id={`floating${fieldName[0].toUpperCase() + fieldName.slice(1)}`}
        name={fieldName}
        autoComplete="off"
        disabled={formik.isSubmitting}
        placeholder={placeholder}
        isInvalid={formik.errors[fieldName] && formik.touched[fieldName]}
      />
      <Form.Label
        htmlFor={`floating${fieldName[0].toUpperCase() + fieldName.slice(1)}`}
      >
        {placeholder}
      </Form.Label>
      {formik.errors[fieldName] && formik.touched[fieldName] && (
        <FormText className="feedback text-danger mt-3">
          {formik.errors[fieldName]}
        </FormText>
      )}
      {name === 'confirmPassword' && !formik.errors[fieldName] && (
        <FormText className="feedback text-danger mt-3">{error}</FormText>
      )}
    </Form.Group>
  );
};

const GetFormikFieldProps = (t, handleSubmit) => useFormik({
  initialValues: {
    username: '',
    password: '',
    confirmPassword: '',
  },
  validationSchema: Yup.object({
    username: Yup.string()
      .min(3, t('signUpPage.validation.minMaxUsername'))
      .max(20, t('signUpPage.validation.minMaxUsername'))
      .required(t('signUpPage.validation.required')),
    password: Yup.string()
      .min(6, t('signUpPage.validation.minPassword'))
      .required(t('signUpPage.validation.required')),
    confirmPassword: Yup.string()
      .oneOf(
        [Yup.ref('password'), null],
        t('signUpPage.validation.confirmPassword'),
      )
      .required(t('signUpPage.validation.required')),
  }),
  onSubmit: handleSubmit,
});

const RenderNav = ({ t }) => (
  <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
    <Container>
      <a href={routes.home} className="navbar-brand">
        {t('loginPage.header')}
      </a>
    </Container>
  </nav>
);

const RenderContainer = ({ t, formik, regError }) => (
  <Container className="mt-5 container d-flex align-items-center justify-content-center">
    <Row className="w-50">
      <Col className=" border rounded .mx-auto mb-5 shadow">
        <h1 className="text-center p-3">{t('signUpPage.title')}</h1>
        <Form onSubmit={formik.handleSubmit} className="px-4">
          {renderFormField('username', t('signUpPage.placeholderName'), formik)}
          {renderFormField(
            'password',
            t('signUpPage.placeholderPassword'),
            formik,
          )}
          {renderFormField(
            'confirmPassword',
            t('signUpPage.placeholderConfirmPassord'),
            formik,
            regError,
          )}
          <Button
            disabled={formik.isSubmitting}
            className="mb-10 w-100"
            variant="primary"
            type="submit"
          >
            {t('signUpPage.submit')}
          </Button>
        </Form>
        <p className="mt-3 text-center">
          {t('signUpPage.alreadyRegistered')}
          <Link style={{ marginLeft: 5 }} to={routes.home}>
            {t('signUpPage.link')}
          </Link>
        </p>
      </Col>
    </Row>
  </Container>
);

const SignUpPage = () => {
  const [regError, setRegError] = useState();
  const navigate = useNavigate();
  const { logIn } = useAuth();
  const { t } = useTranslation();

  const handleSubmit = async (values) => {
    const { username, password } = values;
    const userData = {
      username,
      password,
    };
    try {
      const response = await axios.post(routes.signupPath(), userData);
      logIn({ ...response.data });
      navigate(routes.home);
    } catch (error) {
      if (!error.isAxiosError) {
        setRegError(t('signUpPage.validation.unknown'));
      }
      const { status } = error.response;
      const message = status === 409
          ? t('signUpPage.validation.alreadyReg')
          : t('signUpPage.validation.unknown');
      setRegError(message);
    }
  };

  const formik = GetFormikFieldProps(t, handleSubmit);

  return (
    <>
      <RenderNav t={t} />
      <RenderContainer t={t} formik={formik} regError={regError} />
    </>
  );
};

export default SignUpPage;
