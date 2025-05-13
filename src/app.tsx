import { MetaProvider, Title } from '@solidjs/meta';
import { Router } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start/router';
import { Suspense, createSignal } from 'solid-js';
import './style.css';
import { authenticate, getUserId } from './backend.ts';
import { getFormData } from './helpers.ts';

function LoginForm(props: {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}) {
  return (
    <main class="loginMain">
      <form
        class="loginForm"
        onSubmit={(ev) => {
          ev.preventDefault();
          const data = getFormData<{ email: string; password: string }>(
            ev.currentTarget,
          );
          authenticate(data.email, data.password).then(() =>
            props.setIsAuthenticated(true),
          );
        }}
      >
        <label>
          Username <input type="email" name="email" />
        </label>
        <label>
          Password <input type="password" name="password" />
        </label>
        <button type="submit">Entra</button>
      </form>
    </main>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = createSignal(!!getUserId());
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Title>Traccia Spese</Title>
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css"
          />
          <header>
            <h1>Traccia spese</h1>
          </header>
          {isAuthenticated() ? (
            <Suspense>{props.children}</Suspense>
          ) : (
            <LoginForm setIsAuthenticated={setIsAuthenticated} />
          )}
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
