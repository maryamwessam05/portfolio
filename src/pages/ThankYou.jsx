import { Link } from 'react-router-dom'
import './Misc.css'

export default function ThankYou() {
  return (
    <div className="page thanks">
      <div className="thanks__heart" aria-hidden="true">
        <img className="thanks__l" src="/assets/heart-left.png" alt="" />
        <img className="thanks__r" src="/assets/heart-right.png" alt="" />
      </div>
      <h1 className="thanks__title">
        <span>THANK YOU</span>
        <span className="script">will text u soon</span>
      </h1>
      <Link to="/" className="thanks__home">
        ← back home
      </Link>
    </div>
  )
}
