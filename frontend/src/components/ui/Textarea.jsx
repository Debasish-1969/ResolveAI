function Textarea({
  id,
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
}) {
  return (
    <label className="ui-field" htmlFor={id}>
      {label ? <span>{label}</span> : null}
      <textarea
        id={id}
        className="ui-textarea"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
      />
    </label>
  )
}

export default Textarea
