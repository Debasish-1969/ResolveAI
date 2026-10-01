function Input({
  id,
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
}) {
  return (
    <label className="ui-field" htmlFor={id}>
      {label ? <span>{label}</span> : null}
      <input
        id={id}
        className="ui-input"
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </label>
  )
}

export default Input
