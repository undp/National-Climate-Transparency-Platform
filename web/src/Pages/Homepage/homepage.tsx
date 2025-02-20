import { Button, Collapse } from 'antd';
import CollapsePanel from 'antd/lib/collapse/CollapsePanel';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LayoutFooter from '../../Components/Footer/layout.footer';
import './homepage.scss';
import undpLogo from '../../Assets/Images/undp1.svg';
import gosLogo from '../../Assets/Images/gos.jpg';
import belgiumLogo from '../../Assets/Images/StateCoatArmsBelgium.png';
import heroPhoto from '../../Assets/Images/hero.jpg';
import howItWorksPhoto from '../../Assets/Images/how-it-works.avif';

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

  const partnersData = [
    {
      src: gosLogo,
      alt: 'Climate Change Department',
      name: 'Climate Change Department',
      url: 'https://macce.gov.sc/climate-change-department/',
    },
    {
      src: gosLogo,
      alt: 'MACCE',
      name: 'Ministry of Agriculture, Climate Change and Environment',
      url: 'https://macce.gov.sc/',
    },
    {
      src: gosLogo,
      alt: 'Government Of Seychelles',
      name: 'Government Of Seychelles',
      url: 'https://www.gov.sc/',
    },
    { src: undpLogo, alt: 'undp', name: 'UNDP', url: 'https://www.undp.org/' },
    {
      src: belgiumLogo,
      alt: 'Federal Government Of Belgium',
      name: 'Federal Government Of Belgium',
      url: 'https://federal-government.be/en/',
    },
  ];

  const faqsData = [
    { questionKey: 'homepage:faqs.question1.q', answerKey: 'homepage:faqs.question1.a' },
    { questionKey: 'homepage:faqs.question2.q', answerKey: 'homepage:faqs.question2.a' },
    { questionKey: 'homepage:faqs.question3.q', answerKey: 'homepage:faqs.question3.a' },
    { questionKey: 'homepage:faqs.question4.q', answerKey: 'homepage:faqs.question4.a' },
    { questionKey: 'homepage:faqs.question5.q', answerKey: 'homepage:faqs.question5.a' },
    { questionKey: 'homepage:faqs.question6.q', answerKey: 'homepage:faqs.question6.a' },
    { questionKey: 'homepage:faqs.question7.q', answerKey: 'homepage:faqs.question7.a' },
    { questionKey: 'homepage:faqs.question8.q', answerKey: 'homepage:faqs.question8.a' },
    { questionKey: 'homepage:faqs.question9.q', answerKey: 'homepage:faqs.question9.a' },
    { questionKey: 'homepage:faqs.question10.q', answerKey: 'homepage:faqs.question10.a' },
  ];

  return (
    <div className="landing-page">
      <header className="header">
        <div className="container mx-auto px-4">
          <div className="logo">
            <img src={gosLogo} alt="Seychelles NDC Transparency System" className="logo-image" />
            <div className="company-details">
              <div>
                <span className="company-name1">{t('homepage:transparency')}</span>
                <span> </span>
                <span className="company-name2">{t('homepage:system')}</span>
              </div>
              {/* let's hide the country until told otherwise */}
              <div className="company-motto">{t('homepage:systemCountry')}</div>
            </div>
          </div>

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

          <button className="button text-font-500 sign-in" onClick={() => navigate('/login')}>
            {t('homepage:signIn')}
          </button>
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
                <img src={heroPhoto} alt="slider-logo" />
              </div>
            </div>
            <div className="partners-banner">
              <h3 className="partners-banner-title">{t('homepage:partnersTitle')}</h3>
              <div className="partners-container">
                {partnersData.map((partner, index) => (
                  <a
                    href={partner.url} // Link to the partner's website
                    target="_blank" // Open link in a new tab
                    rel="noopener noreferrer" // Security best practice for target="_blank"
                    className="partners-item"
                    key={index}
                  >
                    <img src={partner.src} alt={partner.alt} />
                    <p>{partner.name}</p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="our-vision" className="our-vision">
          <div className="content">
            <h3 className="section-topic"> {t('homepage:vision.topic')}</h3>
            <h2 className="section-title"> {t('homepage:vision.title')}</h2>
            <p className="section-subtitle">
              <span className="text-font-600 text-italic mr-1">
                {t('homepage:vision.subtitle.line1')}
              </span>
              <span className="mr-1">{t('homepage:vision.subtitle.line2')}</span>
              <span className="text-font-600 text-italic mr-1">
                {t('homepage:vision.subtitle.line3')}
              </span>
              <span className="mr-1">{t('homepage:vision.subtitle.line4')}</span>
              <span className="mr-1">{t('homepage:vision.subtitle.line5')}</span>
            </p>
            <div className="card-grid-container">
              <div className="card-grid">
                <div className="card">
                  <div className="card-title">{t('homepage:vision.card1.title')}</div>
                  <div className="card-content">
                    <ul>
                      <li>{t('homepage:vision.card1.point1')}</li>
                      <li>{t('homepage:vision.card1.point2')}</li>
                      <li>{t('homepage:vision.card1.point3')}</li>
                      <li>{t('homepage:vision.card1.point4')}</li>
                      <li>{t('homepage:vision.card1.point5')}</li>
                    </ul>
                  </div>
                </div>
                <div className="card">
                  <div className="card-title">{t('homepage:vision.card2.title')}</div>
                  <div className="card-content">
                    <ul>
                      <li>{t('homepage:vision.card2.point1')}</li>
                      <li>{t('homepage:vision.card2.point2')}</li>
                      <li>{t('homepage:vision.card2.point3')}</li>
                      <li>{t('homepage:vision.card2.point4')}</li>
                      <li>{t('homepage:vision.card2.point5')}</li>
                    </ul>
                  </div>
                </div>
                <div className="card">
                  <div className="card-title">{t('homepage:vision.card3.title')}</div>
                  <div className="card-content">
                    <ul>
                      <li>{t('homepage:vision.card3.point1')}</li>
                      <li>{t('homepage:vision.card3.point2')}</li>
                      <li>{t('homepage:vision.card3.point3')}</li>
                      <li>{t('homepage:vision.card3.point4')}</li>
                      <li>{t('homepage:vision.card3.point5')}</li>
                    </ul>
                  </div>
                </div>
                <div className="card">
                  <div className="card-title">{t('homepage:vision.card4.title')}</div>
                  <div className="card-content">
                    <ul>
                      <li>{t('homepage:vision.card4.point1')}</li>
                      <li>{t('homepage:vision.card4.point2')}</li>
                      <li>{t('homepage:vision.card4.point3')}</li>
                      <li>{t('homepage:vision.card4.point4')}</li>
                      <li>{t('homepage:vision.card4.point5')}</li>
                    </ul>
                  </div>
                </div>
                <div className="card">
                  <div className="card-title">{t('homepage:vision.card5.title')}</div>
                  <div className="card-content">
                    <ul>
                      <li>{t('homepage:vision.card5.point1')}</li>
                      <li>{t('homepage:vision.card5.point2')}</li>
                      <li>{t('homepage:vision.card5.point3')}</li>
                      <li>{t('homepage:vision.card5.point4')}</li>
                      <li>{t('homepage:vision.card5.point5')}</li>
                    </ul>
                  </div>
                </div>
                <div className="card">
                  <div className="card-title">{t('homepage:vision.card6.title')}</div>
                  <div className="card-content">
                    <ul>
                      <li>{t('homepage:vision.card6.point1')}</li>
                      <li>{t('homepage:vision.card6.point2')}</li>
                      <li>{t('homepage:vision.card6.point3')}</li>
                      <li>{t('homepage:vision.card6.point4')}</li>
                      <li>{t('homepage:vision.card6.point5')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-work" className="how-it-work">
          <div className="content">
            <div className="block-section">
              <div className="grid-container">
                {/* Left Column (Image Content) */}
                <div className="image-column">
                  <img
                    src={howItWorksPhoto}
                    alt="Seychelles NDC Transparency System"
                    className="logo-image"
                  />
                </div>
                {/* Right Column (Text Content) */}
                <div className="content-column">
                  <h3 className="section-topic"> {t('homepage:works.topic')}</h3>
                  <h2 className="section-title"> {t('homepage:works.title')}</h2>
                  <p className="section-subtitle">
                    <span className="text-font-600 text-italic mr-1">
                      {t('homepage:works.subtitle.line1')}
                    </span>
                    <span className="mr-1">{t('homepage:works.subtitle.line2')}</span>
                    <span className="text-font-600 mr-1">{t('homepage:works.subtitle.line3')}</span>
                  </p>
                  <ul>
                    <li>
                      <strong>{t('homepage:works.card1.title')}</strong>:{' '}
                      {t('homepage:works.card1.description')}
                    </li>
                    <li>
                      <strong>{t('homepage:works.card2.title')}</strong>:{' '}
                      {t('homepage:works.card2.description')}
                    </li>
                    <li>
                      <strong>{t('homepage:works.card3.title')}</strong>:{' '}
                      {t('homepage:works.card3.description')}
                    </li>
                    <li>
                      <strong>{t('homepage:works.card4.title')}</strong>:{' '}
                      {t('homepage:works.card4.description')}
                    </li>
                    <li>
                      <strong>{t('homepage:works.card5.title')}</strong>:{' '}
                      {t('homepage:works.card5.description')}
                    </li>
                    <li>
                      <strong>{t('homepage:works.card6.title')}</strong>:{' '}
                      {t('homepage:works.card6.description')}
                    </li>
                    <li>
                      <strong>{t('homepage:works.card7.title')}</strong>:{' '}
                      {t('homepage:works.card7.description')}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="faqs" className="faqs">
          <div className="content">
            {/* Topic and Title */}
            <h3 className="section-topic"> {t('homepage:faqs.topic')}</h3>
            <h2 className="section-title"> {t('homepage:faqs.title')}</h2>

            {/* Accordion */}
            <Collapse accordion defaultActiveKey={['1']} className="accordian">
              {faqsData.map((faq, index) => (
                <CollapsePanel
                  header={t(faq.questionKey)}
                  key={index + 1}
                  className="collapsepanel"
                >
                  <div className="collapse-content">{t(faq.answerKey)}</div>
                </CollapsePanel>
              ))}
            </Collapse>
          </div>
        </section>

        {/* Back to Top Button */}
        {showButton && (
          <button className="button back-to-top" onClick={scrollToTop}>
            ↑
          </button>
        )}
      </main>

      <footer>
        <LayoutFooter />
      </footer>
    </div>
  );
};

export default Homepage;
