export function LoadingState({ text = 'Carregando...' }: { text?: string }) {
  return <p className="loading-state">{text}</p>;
}
