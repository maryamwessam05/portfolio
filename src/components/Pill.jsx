import { Link } from 'react-router-dom'
import './Pill.css'

export default function Pill({
  to,
  href,
  onClick,
  type,
  children,
  icon,
  iconAfter,
  variant = 'outline',
  size = 'md',
  fill,
  ink,
  className = '',
  ...rest
}) {
  const cls = `pill pill--${variant} pill--${size} ${className}`
  const style = { ...(fill && { '--fill': fill }), ...(ink && { '--ink': ink }), ...rest.style }
  const inner = (
    <>
      <span className={variant === 'filled' ? 'pill__blob' : 'hand-outline'} aria-hidden="true" />
      {icon && <span className="mask-icon pill__icon" style={{ '--icon': `url(${icon})` }} aria-hidden="true" />}
      <span className="pill__label">{children}</span>
      {iconAfter && <span className="pill__after" aria-hidden="true">{iconAfter}</span>}
    </>
  )
  if (to)
    return (
      <Link to={to} className={cls} style={style} {...rest}>
        {inner}
      </Link>
    )
  if (href)
    return (
      <a href={href} className={cls} style={style} target="_blank" rel="noreferrer" {...rest}>
        {inner}
      </a>
    )
  return (
    <button type={type ?? 'button'} onClick={onClick} className={cls} style={style} {...rest}>
      {inner}
    </button>
  )
}
