export default function ErrorState({ label = 'Something went wrong.' }) {
  return (
    <p className="state state-error" role="alert">
      {label}
    </p>
  )
}
