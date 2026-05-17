import { useLogin } from '../hooks/useLogin';
import { LoadingState } from './common/LoadingState';

const Login = ({ setToken }: { setToken?: (value: string | null) => void }) => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    checkingToken,
    submitting,
    handleSubmit,
  } = useLogin(setToken);

  if (checkingToken) {
    return <LoadingState text="Verificando login..." />;
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-avatar">
          <img src="/fatec_jacarei.png" alt="Fatec Jacareí" />
        </div>

        <h2 className="login-title">LOGIN ADMIN</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">E-mail</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@fatec.edu"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Senha</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="admin"
              required
            />
            <div className="forgot-password">ESQUECI A SENHA</div>
          </div>

          <button type="submit" className="login-button" disabled={submitting}>
            {submitting ? 'ENTRANDO...' : 'LOGIN'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
