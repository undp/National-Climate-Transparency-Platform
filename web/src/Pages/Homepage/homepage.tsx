import { Button, Col, Row } from 'antd';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import sliderLogo from '../../Assets/Images/mrvlogo.svg';
import mangroveImg from '../../Assets/Images/mangrove.jpg';
import LayoutFooter from '../../Components/Footer/layout.footer';
import './homepage.scss';
import { PersonCircle } from 'react-bootstrap-icons';

const Homepage = () => {
  const { t } = useTranslation(['common', 'homepage']);
  const navigate = useNavigate();
  const [showButton, setShowButton] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: any) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Show or hide the back-to-top button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300); // Show button after scrolling 300px
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="landing-page">
      <header className="header">
        <div className="container mx-auto px-4">
          <div className="logo">YourLogo</div>

          {/* Mobile Menu Toggle */}
          <button className="menu-toggle" onClick={toggleMenu}>
            ☰
          </button>

          {/* Desktop Menu */}
          <nav className="nav-bar">
            <button onClick={() => scrollToSection('our-vision')}>Our Vision</button>
            <button onClick={() => scrollToSection('how-it-work')}>How It Work</button>
            <button onClick={() => scrollToSection('faqs')}>FAQs</button>
          </nav>

          {/* Mobile Drawer Menu */}
          <div className={`menu-drawer ${isMenuOpen ? 'active' : ''}`}>
            <button
              onClick={() => {
                scrollToSection('our-vision');
                setIsMenuOpen(false);
              }}
            >
              Our Vision
            </button>
            <button
              onClick={() => {
                scrollToSection('how-it-work');
                setIsMenuOpen(false);
              }}
            >
              How It Work
            </button>
            <button
              onClick={() => {
                scrollToSection('faqs');
                setIsMenuOpen(false);
              }}
            >
              FAQs
            </button>
          </div>

          <button className="sign-in">Sign In</button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="content">
            <div className="columns">
              <div className="left-column">
                <div className="text-ctn">
                  <span>
                    {t('homepage:nationalNdc')} {t('homepage:transparency')} <br />
                    {t('homepage:system')}
                  </span>
                </div>
                <p className="text-ctn1 text-font-500">{t('homepage:heroMessage1')}</p>
                <p className="text-ctn1 text-font-600">{t('homepage:heroMessage2')}</p>
                <div className="ctn-actions-bar">
                  <Button
                    className="button ctn-actions-bar-btn text-font-500"
                    type="primary"
                    onClick={() => navigate('/login')}
                  >
                    {t('homepage:signInToStart')}
                  </Button>
                </div>
              </div>
              <div className="right-column">
                <img src={mangroveImg} alt="slider-logo" />
              </div>
            </div>
            <div className="banner">sdsds</div>
          </div>
        </section>

        <section id="our-vision" className="our-vision">
          <div className="content">
            <h2 className="section-title"> {t('homepage:ourVisionTitle')}</h2>
            <p className="section-subtitle">
              <span className="text-font-600 text-italic mr-1">
                {t('homepage:ourVisionSubtitle0')}
              </span>
              <span className="mr-1">{t('homepage:ourVisionSubtitle1')}</span>
              <span className="text-font-600 text-italic mr-1">
                {t('homepage:ourVisionSubtitle2')}
              </span>
              <span className="mr-1">{t('homepage:ourVisionSubtitle3')}</span>
              <span className="mr-1">{t('homepage:ourVisionSubtitle4')}</span>
            </p>
            <div className="card-grid-container">
              <div className="card-grid">
                <div className="card">AA</div>
                <div className="card">BB</div>
                <div className="card">BB</div>
                <div className="card">DD</div>
              </div>
            </div>
            <PersonCircle
              className="icon"
              color="#3A354199"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                navigate('/userProfile/view');
              }}
            />
          </div>
        </section>

        <section id="how-it-work" className="how-it-work">
          <div className="content">
            <h2>How It Work</h2>
            <p>We simplify complex processes to deliver exceptional value to our users.</p>
          </div>
        </section>

        <section id="faqs" className="faqs">
          <div className="content">
            <h2>FAQs</h2>
            <p>Find answers to the most commonly asked questions.</p>
          </div>
        </section>
        {/* Back to Top Button */}
        {showButton && (
          <button className="back-to-top" onClick={scrollToTop}>
            ↑ Back to Top
          </button>
        )}
      </main>

      <footer>
        <p>&copy; 2025 Your Company. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Homepage;
