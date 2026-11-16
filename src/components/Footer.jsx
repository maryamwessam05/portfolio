import { Link } from 'react-router-dom'
import { getSettings, useData } from '../lib/data'
import './Footer.css'

export default function Footer() {
  const { data: settings } = useData('settings', getSettings)
  const email = settings?.email || 'hello@maryamwessam.com'
  const whatsapp = settings?.whatsapp_url || '/contact'
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer__logo" aria-hidden="true">
        <img src="/assets/footer-logo.png" alt="" loading="lazy" />
      </div>
      <div className="footer__body">
        <div className="footer__top">
          <div className="footer__col">
            <p className="footer__label">Services</p>
            <ul className="footer__list footer__list--services">
              <li><Link to="/services">Design</Link></li>
              <li><Link to="/services">UX/UI</Link></li>
              <li><Link to="/services">Development</Link></li>
              <li><Link to="/services">Motion</Link></li>
            </ul>
          </div>
          <div className="footer__col footer__col--right">
            <div>
              <p className="footer__label">Quick Links</p>
              <ul className="footer__list">
                <li><Link to="/about">About me</Link></li>
                <li><Link to="/#testimonials">Clients</Link></li>
                <li><Link to="/journal">Blog</Link></li>
                <li><Link to="/contact">Contacts</Link></li>
              </ul>
            </div>
            <a
              className="footer__whatsapp"
              href={whatsapp}
              {...(whatsapp.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
              <span className="footer__wa-icon" aria-hidden="true">✆</span>
              <span>Whatsapp ↗</span>
            </a>
          </div>
        </div>
        <div className="footer__bottom">
          <p className="footer__small">© {year} Maryam Wessam</p>
          <div className="footer__bottom-right">
            <div className="footer__email">
              <p className="footer__small">Send me an email</p>
              <a href={`mailto:${email}`}>{email}</a>
            </div>
            <div className="footer__langs">
              {settings?.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noreferrer">
                  Instagram
                </a>
              )}
              <span>/</span>
              <Link to="/sitemap">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
