function Select({
  id,
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder,
}) {
  return (
    <label className="ui-field" htmlFor={id}>
      {label ? <span>{label}</span> : null}

      <select
        id={id}
        className="ui-select"
        name={name}
        value={value}
        onChange={onChange}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

export default Select