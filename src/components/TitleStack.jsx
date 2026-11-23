export default function TitleStack({ script, main, scriptColor, mainColor, as: Tag = 'h2', className = '', style }) {
  return (
    <Tag className={`title-stack ${className}`} style={style} data-reveal>
      <span className="title-stack__script" style={scriptColor ? { color: scriptColor } : undefined}>
        {script}
      </span>
      <span className="title-stack__main" style={mainColor ? { color: mainColor } : undefined}>
        {main}
      </span>
    </Tag>
  )
}
