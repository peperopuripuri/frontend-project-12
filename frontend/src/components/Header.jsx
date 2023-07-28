import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/Header.css';
import { useTranslation } from 'react-i18next';

const Header = ({ isLoggedIn, onLogout }) => {
  const { t } = useTranslation();

  return (
    <Navbar expand="lg">
      <Navbar.Brand as={Link} to="/">
        Hexlet Chat
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          {isLoggedIn && (
            <Button variant="success" onClick={onLogout}>
              {t('header.texts.signOutBtn')}
            </Button>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
