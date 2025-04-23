import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import './style.css'

export default function App() {
  return (
    <Router
      root={props => (
        <MetaProvider>
          <Title>Spese</Title>
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css"
          />
          <header>
            <h1>Traccia spese</h1>
            <button popoverTarget="menu" class="outline contrast">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
                <path d="M 5 9 L 5 11 L 45 11 L 45 9 L 5 9 z M 5 24 L 5 26 L 45 26 L 45 24 L 5 24 z M 5 39 L 5 41 L 45 41 L 45 39 L 5 39 z"></path>
              </svg>
            </button>
            <div popover id="menu" class="left-panel">
              <aside>
                <nav>
                  <ul>
                    <li><a href="/categorie">Gestisci categorie</a></li>
                    <li><a href="#">Gestisci limiti</a></li>
                    <li><a href="#">Controlla limiti</a></li>
                  </ul>
                </nav>
              </aside>

            </div>
          </header>
          <Suspense>{props.children}</Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
