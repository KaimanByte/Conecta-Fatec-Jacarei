import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Chat from './components/Chat';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import { Toaster } from 'sonner';

// Admin Pages
import AdminNodes from './pages/AdminNodes';
import AdminInquiries from './pages/AdminInquiries';
import AdminLogs from './pages/AdminLogs';

function App() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const syncToken = () => setToken(localStorage.getItem('token'));
    syncToken();
    const handler = (e: StorageEvent) => { if (e.key === 'token') syncToken(); };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return (
    <Router>
      <Toaster position="top-right" expand={true} richColors closeButton />
      <div className="app-root">
        <Routes>

          {/* ── ROTA PÚBLICA — Chat ── */}
          <Route
            path="/"
            element={
              <div className="page-public">

                {/* HEADER */}
                <header className="app-header">
                  <div className="app-header__inner">

                    {/* Logo SP — esquerda */}
                    <div className="app-header__logo-sp">
                      <img src="/SP.webp" alt="Governo do Estado de São Paulo" />
                    </div>

                    <div id="app-header__red-line"></div>

                    {/* Logo Fatec — direita */}
                    <div className="app-header__logo-fatec">
                      <img src="/fatec_jacarei.webp" alt="Fatec Jacareí" />
                      {/* {token && (
                        <span className="app-header__admin-badge">

                          Modo Administrador
                        </span>
                      )} */}
                    </div>

                  </div>
                </header>

                {/* MAIN */}
                <main className="app-main">
                  <Chat />
                </main>

                {/* FOOTER */}
                <footer className="app-footer">
                  <div className="app-footer__inner">

                    {/* Coluna 1 — Endereço */}
                    <div className="app-footer__info">
                      <p className="app-footer__info-title">Fatec Jacareí</p>
                      <p>Av. Faria Lima, 155 - Jardim Santa Maria</p>
                      <p>Jacareí/SP - CEP: 12328-070</p>
                    </div>
                    <div className='Linha'></div>
                    {/* Coluna 2 — Contato */}
                    {/* Telefone */}
                    <div className="app-footer__contact">
                      <p><span>Telefone:</span></p>
                      <p>(12) 3953-7926</p>
                    </div>

                    <div className='Linha'></div>

                    {/* Horário */}
                    <div className="app-footer__hours">
                      <p><span>Horário de funcionamento:</span></p>
                      <p>Seg. a Sex. das 07h às 22h</p>
                    </div>
                    <div className='Linha'></div>
                    {/* Coluna 3 — Social + Admin link */}
                    <div className="app-footer__social">
                      <a
                        href="https://github.com/KaimanByte/Conecta-Fatec-Jacarei"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="app-footer__conecta"
                      >
                        CONECTA JACAREÍ
                      </a>
                      <div className='Linha'></div>
                      {/* Ícones sociais */}
                      <div className="app-footer__social-icons">

                        {/* Facebook */}
                        <a href="https://www.facebook.com/jacareifatec" target='_blank' aria-label="Facebook">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M22 12c0-5.522-4.478-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.877v-6.987H7.898V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 16.991 22 12z" />
                          </svg>
                        </a>

                        {/* Instagram */}
                        <a href="https://www.instagram.com/fatec_jacarei" target='_blank' aria-label="Instagram">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.265.07 1.645.07 4.851s-.012 3.586-.07 4.85c-.062 1.366-.333 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.585-.012-4.85-.07c-1.366-.062-2.633-.333-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608C2.175 15.586 2.163 15.206 2.163 12s.012-3.585.07-4.85c.062-1.366.333-2.633 1.308-3.608.975-.975 2.242-1.246 3.608-1.308C8.415 2.175 8.795 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.052.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.085 1.855.601 3.697 1.942 5.038 1.341 1.341 3.183 1.857 5.038 1.942C8.332 23.986 8.741 24 12 24s3.668-.014 4.948-.072c1.855-.085 3.697-.601 5.038-1.942 1.341-1.341 1.857-3.183 1.942-5.038.058-1.28.072-1.689.072-4.948s-.014-3.668-.072-4.948c-.085-1.855-.601-3.697-1.942-5.038C20.645.673 18.803.157 16.948.072 15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                          </svg>
                        </a>

                        {/* LinkedIn */}
                        <a href="https://www.linkedin.com/company/fatec-faculdade-de-tecnologia-de-jacare%C3%AD" target='_blank' aria-label="LinkedIn">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452H17.21v-5.569c0-1.327-.024-3.037-1.85-3.037-1.851 0-2.134 1.445-2.134 2.939v5.667H9.99V9h3.114v1.561h.045c.434-.822 1.494-1.689 3.074-1.689 3.289 0 3.894 2.165 3.894 4.979v6.601zM5.337 7.433a1.805 1.805 0 1 1 0-3.61 1.805 1.805 0 0 1 0 3.61zm1.558 13.019H3.779V9h3.116v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </a>

                        {/* YouTube */}
                        <a href="https://www.youtube.com/channel/UCUr_kAji04ek02JSK-YiFdg" target='_blank' aria-label="YouTube">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                          </svg>
                        </a>

                      </div>
                    </div>

                  </div>
                </footer>
                <footer2>
                  <img src="SP.webp"></img>
                  {/* Link área admin */}
                  <div className="app-footer__admin-link">
                    {!token ? (
                      <a href="/login">Área Admin</a>
                    ) : (
                      <a href="/admin/inquiries" className="bold">Ir para o Painel</a>
                    )}
                  </div>
                </footer2>

              </div>
            }
          />

          {/* ── LOGIN ── */}
          <Route
            path="/login"
            element={<Login setToken={setToken} />}
          />

          {/* ── ROTAS SOMENTE ADMIN ── */}
          <Route
            element={
              <PrivateRoute validateUrl="http://localhost:3001/api/auth/validate-admin" setToken={setToken} />
            }
          >
            <Route path="/admin" element={<AdminNodes setToken={setToken} />} />
            <Route path="/admin/nodes" element={<AdminNodes setToken={setToken} />} />
            <Route path="/admin/logs" element={<AdminLogs setToken={setToken} />} />
          </Route>

          {/* ── ROTAS SECRETÁRIA + ADMIN ── */}
          <Route
            element={
              <PrivateRoute validateUrl="http://localhost:3001/api/auth/validate-secretary" setToken={setToken}/>
            }
          >
            <Route path="/admin/inquiries" element={<AdminInquiries setToken={setToken} />} />
          </Route>

          {/* ── CATCH-ALL ── */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;