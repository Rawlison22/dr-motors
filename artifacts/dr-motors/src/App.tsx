import { useMemo, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { ArrowDown, ArrowUpRight, MapPin, MessageCircle, MoveRight } from 'lucide-react';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Home() {
  const [filter, setFilter] = useState('all');
  const filters = [
    { id: 'all', label: 'Todas' },
    { id: '50', label: '50cc' },
    { id: '125', label: '125cc' },
    { id: '150', label: '150–170cc' },
    { id: '175', label: '175cc' },
    { id: '250', label: '250cc' },
  ];
  const motorcycles = [
    { name: 'Phoenix 50C', category: 'Ciclomotor', segment: '50', engine: '49,4 cc', specs: [['Potência', '2,7 – 3,6 cv'], ['Câmbio', '4 marchas'], ['Alimentação', 'Carburador'], ['Tanque', '3,5 L'], ['Freios', 'Disco / Tambor']] },
    { name: 'Jet 125C', category: 'Carburada', segment: '125', type: 'Cub', engine: '123,67 cc', specs: [['Potência', '8,15 cv'], ['Câmbio', '4 marchas'], ['Alimentação', 'Carburador'], ['Tanque', '3 L'], ['Freios', 'Disco / Tambor']] },
    { name: 'New Jet 125C', category: 'Linha 2026', segment: '125', type: 'Cub', engine: '123,67 cc', specs: [['Potência', '8,15 cv'], ['Câmbio', '4 marchas'], ['Alimentação', 'Carburador'], ['Tanque', '3 L'], ['Destaque', 'Painel digital']] },
    { name: 'Rio 125', category: 'Carburada', segment: '125', type: 'Cub', engine: '123,67 cc', specs: [['Potência', '± 8 cv'], ['Câmbio', '4 marchas'], ['Alimentação', 'Carburador'], ['Tanque', '3 L'], ['Destaque', 'Visual robusto']] },
    { name: 'New JEF 150', category: 'Carburada', segment: '150', type: 'Street', engine: '± 150 cc', specs: [['Potência', '± 10,5–12 cv'], ['Câmbio', '5 marchas'], ['Alimentação', 'Carburador'], ['Uso', 'Urbano + estrada'], ['Partida', 'Elétrica + pedal']] },
    { name: 'New JEF 170', category: 'Carburada', segment: '150', type: 'Street', engine: '± 170 cc', specs: [['Potência', '± 13,5 cv'], ['Câmbio', '5 marchas'], ['Alimentação', 'Carburador'], ['Uso', 'Mais potência'], ['Partida', 'Elétrica + pedal']] },
    { name: 'New SHI 175 S', category: 'Carburada', segment: '175', type: 'Trail', engine: '± 175 cc', specs: [['Potência', '± 14–15,6 cv'], ['Câmbio', '5 marchas'], ['Alimentação', 'Carburador'], ['Suspensão', 'Monoshock'], ['Freios', 'Disco / Disco']] },
    { name: 'SHI 175 EFI', category: 'Injeção eletrônica', segment: '175', type: 'Trail EFI', engine: '175,11 cc', specs: [['Potência', '15,63 cv'], ['Torque', '14 Nm'], ['Câmbio', '5 marchas'], ['Alimentação', 'Injeção EFI'], ['Tanque', '14,5 L']] },
    { name: 'Flash 250 EFI', category: 'Injeção + ABS', segment: '250', type: 'Street 250', engine: '248,92 cc DOHC', specs: [['Potência', '27,9 cv'], ['Torque', '22,5 Nm'], ['Câmbio', '6 marchas'], ['Refrigeração', 'Líquida'], ['Freios', 'ABS 2 canais']] },
  ];
  const visibleMotorcycles = useMemo(
    () => filter === 'all' ? motorcycles : motorcycles.filter((motorcycle) => motorcycle.segment === filter),
    [filter],
  );
  const whatsappUrl = (model?: string) => `https://wa.me/5583993499317${model ? `?text=${encodeURIComponent(`Olá! Tenho interesse na ${model}`)}` : ''}`;

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#inicio" aria-label="DR Motors, início">
            <span className="brand-mark">DR<span>.</span></span>
            <span className="brand-copy"><strong>DR Motors</strong><small>A sua melhor escolha</small></span>
          </a>
          <div className="header-location"><MapPin size={15} strokeWidth={1.8} /><span>João Pessoa, PB</span></div>
          <a className="header-contact" href={whatsappUrl()} target="_blank" rel="noreferrer" data-testid="link-whatsapp-header">
            <MessageCircle size={17} /> <span>Fale com a loja</span><ArrowUpRight size={15} />
          </a>
        </div>
      </header>

      <main id="inicio">
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-copy">
              <p className="eyebrow"><span className="eyebrow-line" /> Concessionária autorizada Shineray</p>
              <h1>Seu próximo<br /><span>caminho começa</span><br />aqui.</h1>
              <p className="hero-description">Conheça nossa linha completa de motos Shineray. Compare os modelos e encontre o que combina com o seu ritmo.</p>
              <a className="hero-cta" href="#catalogo">Explorar modelos <ArrowDown size={17} /></a>
            </div>
            <div className="hero-art" aria-label="Painel gráfico abstrato de cilindrada, sem fotografia do produto" role="img">
              <div className="hero-art-top"><span>DR MOTORS / SHINERAY</span><span>PB · BRASIL</span></div>
              <div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" />
              <div className="hero-art-center"><span className="hero-art-kicker">ESCOLHA SUA</span><span className="hero-art-number">MOTO<span>.</span></span><span className="hero-art-caption">Liberdade em cada trajeto</span></div>
              <div className="hero-art-vertical">CATÁLOGO 2026</div>
              <div className="hero-art-bottom"><span>01 — 09</span><span>LINHA COMPLETA</span></div>
              <span className="art-cross cross-a" /><span className="art-cross cross-b" />
            </div>
            <div className="hero-index" aria-hidden="true">01 / 09</div>
          </div>
          <div className="hero-bottom"><span>CATÁLOGO SHINERAY</span><span>Da cidade à estrada, no seu tempo.</span><span>ROLE PARA DESCOBRIR <ArrowDown size={13} /></span></div>
        </section>

        <section className="catalog-section" id="catalogo">
          <div className="catalog-heading">
            <div>
              <p className="eyebrow dark-eyebrow"><span className="eyebrow-line" /> Linha Shineray</p>
              <h2>Encontre seu<br /><span>próximo destino.</span></h2>
            </div>
            <p className="catalog-intro">Do primeiro giro à próxima aventura. Compare as especificações e fale com a nossa equipe para saber mais.</p>
          </div>

          <div className="filter-row">
            <div className="filter-label"><span>Filtrar por cilindrada</span><span className="filter-label-mark">↘</span></div>
            <div className="filters" role="group" aria-label="Filtrar modelos por cilindrada">
              {filters.map((item) => (
                <button key={item.id} type="button" className={`filter-button${filter === item.id ? ' is-active' : ''}`} onClick={() => setFilter(item.id)} aria-pressed={filter === item.id} data-testid={`filter-${item.id}`}>
                  {item.label}
                </button>
              ))}
            </div>
            <p className="results-count" aria-live="polite" data-testid="text-model-count"><strong>{String(visibleMotorcycles.length).padStart(2, '0')}</strong> modelos</p>
          </div>

          <div className="motorcycle-grid" aria-live="polite">
            {visibleMotorcycles.map((motorcycle, index) => (
              <article className="motorcycle-card" key={motorcycle.name} data-testid={`card-model-${motorcycle.name.toLowerCase().replaceAll(' ', '-')}`}>
                <div className="card-visual">
                  <div className="visual-head"><span>{motorcycle.type ?? 'Ciclomotor'}</span><span className="visual-index">{String(index + 1).padStart(2, '0')} / {String(visibleMotorcycles.length).padStart(2, '0')}</span></div>
                  <div className="visual-graphic" aria-hidden="true">
                    <span className="graphic-ring ring-large" /><span className="graphic-ring ring-small" />
                    <span className="graphic-axis" /><span className="graphic-label">{motorcycle.segment}<i>cc</i></span>
                    <span className="graphic-micro">SHINERAY · DR MOTORS</span>
                  </div>
                  <span className="card-category-tag">{motorcycle.category}</span>
                </div>
                <div className="card-content">
                  <div className="card-title-row"><div><p className="card-overline">SHINERAY / {motorcycle.segment}CC</p><h3>{motorcycle.name}</h3></div><span className="card-arrow" aria-hidden="true"><ArrowUpRight size={18} /></span></div>
                  <div className="engine-line"><span>Motor</span><strong>{motorcycle.engine}</strong></div>
                  <dl className="spec-list">
                    {motorcycle.specs.map(([label, value]) => <div className="spec-row" key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
                  </dl>
                  <a className="inquiry-link" href={whatsappUrl(motorcycle.name)} target="_blank" rel="noreferrer" data-testid={`link-inquire-${motorcycle.name.toLowerCase().replaceAll(' ', '-')}`}>
                    <MessageCircle size={17} /><span>Consultar este modelo</span><MoveRight size={17} />
                  </a>
                </div>
              </article>
            ))}
            {visibleMotorcycles.length === 0 && <div className="empty-results"><p>Nenhum modelo encontrado nesta categoria.</p><button type="button" onClick={() => setFilter('all')}>Ver todos os modelos</button></div>}
          </div>
          <p className="catalog-note">Especificações apresentadas como referência. Consulte a equipe DR Motors para informações sobre condições e disponibilidade.</p>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand"><span className="brand-mark">DR<span>.</span></span><div><strong>DR Motors</strong><small>A sua melhor escolha</small></div></div>
          <div className="footer-message"><p className="eyebrow"><span className="eyebrow-line" /> Atendimento local</p><h2>Vamos conversar<br />sobre sua próxima moto?</h2></div>
          <a className="footer-contact" href={whatsappUrl()} target="_blank" rel="noreferrer" data-testid="link-footer-whatsapp"><MessageCircle size={18} /><span>Falar no WhatsApp</span><ArrowUpRight size={16} /></a>
        </div>
        <div className="footer-details">
          <p><strong>DR Motors — A sua melhor escolha</strong><span>Concessionária autorizada Shineray • João Pessoa / PB</span></p>
          <p><MapPin size={15} /><span>Oitizeiro e Conde</span></p>
          <span className="footer-legal">© DR Motors · Shineray</span>
        </div>
      </footer>
    </div>
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
