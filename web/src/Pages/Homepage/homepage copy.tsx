import { Button, Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import sliderLogo from '../../Assets/Images/mrvlogo.svg';
import LayoutFooter from '../../Components/Footer/layout.footer';
import './homepage.scss';

const Homepage = () => {
  const { t } = useTranslation(['common', 'homepage']);
  const navigate = useNavigate();
  const [Visible, setVisible] = useState(true);

  const controlDownArrow = () => {
    if (window.scrollY > 150) {
      setVisible(false);
    } else {
      setVisible(true);
    }
  };

  const handleClickScroll = () => {
    const element = document.getElementById('scrollhome');
    if (element) {
      // 👇 Will scroll smoothly to the top of the next section
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (localStorage.getItem('i18nextLng')!.length > 2) {
      i18next.changeLanguage('en');
    }
    window.addEventListener('scroll', controlDownArrow);
    return () => {
      window.removeEventListener('scroll', controlDownArrow);
    };
  }, []);
  return (
    <div className="homepage-container">
      <Row>
        <Col md={24} lg={24} flex="auto">
          <div className="homepage-img-container image-container">
            <Row className="header-row">
              <Col md={18} lg={21} xs={17} flex="auto">
                <div className="homepage-header-container">
                  <div className="logo">
                    <img src={sliderLogo} alt="slider-logo" />
                  </div>
                  <div>
                    <div style={{ display: 'flex' }}>
                      <div className="title">{'TRANSPARENCY'}</div>
                      <div className="title-sub">{'SYSTEM'}</div>
                    </div>
                    <div className="country-name">
                      {process.env.REACT_APP_COUNTRY_NAME || 'Seychelles'}
                    </div>
                  </div>
                </div>
              </Col>
              <Col md={6} lg={3} xs={7} flex="auto">
                <div className="homepage-button-container">
                  <div className="button">
                    <Button type="primary" onClick={() => navigate('/login')}>
                      SIGN IN
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <div className="text-ctn">
                <span>
                  {t('homepage:nationalNdc')} {t('homepage:transparency')} <br />
                  {t('homepage:system')}
                </span>
                <div className="subhome">{t('homepage:lorem')}</div>
              </div>
            </Row>
            <Row>
              {Visible && (
                <nav className={'arrows'}>
                  <svg onClick={handleClickScroll}>
                    <path className="a1" d="M0 0 L30 32 L60 0"></path>
                    <path className="a2" d="M0 20 L30 52 L60 20"></path>
                    <path className="a3" d="M0 40 L30 72 L60 40"></path>
                  </svg>
                </nav>
              )}
            </Row>
          </div>
        </Col>
      </Row>
      <LayoutFooter />
    </div>
  );
};

export default Homepage;
