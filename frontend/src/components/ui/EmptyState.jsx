function EmptyState({ title = 'Nothing to show yet', message }) {
  return (
    <div className="ui-empty">
      <p className="ui-empty-title">{title}</p>
      {message ? <p>{message}</p> : null}
    </div>
  )
}

export default EmptyState
