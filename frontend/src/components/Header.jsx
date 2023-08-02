import { Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth.hook';

const Header = () => {
  const { t } = useTranslation();
  const { logOut } = useAuth();
  return (
    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <Container>
        <Link to="/" className="navbar-brand">
          {t('chatHeader.title')}
        </Link>
        <button onClick={logOut} type="button" className="btn btn-primary">{t('chatHeader.logOut')}</button>
      </Container>
    </nav>
  );
};

export default Header;
