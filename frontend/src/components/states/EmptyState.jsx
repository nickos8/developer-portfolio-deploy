export default function EmptyState({ label = 'Nothing here yet.' }) {
  return <p className="state state-empty">{label}</p>
}
