import type { SatisfactionStatus } from '../../types';

export default function SatisfactionPanel({ onRate }: { onRate: (flag: SatisfactionStatus) => void }) {
  return (
    <div className="satisfaction-container">
      <p className="satisfaction-title">O atendimento resolveu sua dúvida?</p>
      <div className="satisfaction-options">
        <button onClick={() => onRate('ATENDEU')} className="rate-button yes" type="button">
          <span className="rate-button-emoji">😊</span>
          <span className="rate-button-label rate-button-label--yes">Sim, resolveu!</span>
        </button>
        <button onClick={() => onRate('NAO_ATENDEU')} className="rate-button no" type="button">
          <span className="rate-button-emoji">😕</span>
          <span className="rate-button-label rate-button-label--no">Não resolveu</span>
        </button>
      </div>
    </div>
  );
}
