import { Container } from "@/shared/ui/Container/Container";
import { Button } from "@/shared/ui/Button/Button";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* 1. Hero Section (Core Semântico) */}
      <section className="relative flex min-h-[90vh] flex-col justify-center border-b border-border py-20 lg:py-32">
        <Container>
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-brand-accent">
              <span className="h-2 w-2 rounded-full bg-brand-accent animate-pulse" />
              CADIFE Tour • Consultoria de Viagens
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Sua próxima jornada começa aqui.
            </h1>
            
            <p className="text-lg text-foreground-muted sm:text-xl">
              Planejamento completo, roteiros personalizados e suporte humanizado do embarque ao retorno.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="lg" asChild>
                <a
                  href="https://wa.me/5500000000000?text=Ol%C3%A1!%20Gostaria%20de%20planejar%20minha%20viagem%20com%20a%20CADIFE%20Tour."
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Falar com consultor no WhatsApp (abre em nova aba)"
                >
                  Planejar minha viagem
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#destinos">Conhecer destinos</a>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Destinos em Destaque */}
      <section id="destinos" className="border-b border-border py-20">
        <Container>
          <div className="mb-12 max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Destinos sob medida
            </h2>
            <p className="mt-4 text-foreground-muted">
              Experiências selecionadas e roteiros planejados para cada perfil de viajante.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Europa Clássica",
                desc: "Paris, Roma, Madri e Lisboa com suporte e traslados dedicados.",
                tag: "Cultural",
              },
              {
                title: "Ecoturismo & Aventura",
                desc: "Patagônia, Mendoza e paisagens naturais inesquecíveis.",
                tag: "Natureza",
              },
              {
                title: "Cruzeiros & Litoral",
                desc: "Resorts e experiências em alto mar com tudo incluso.",
                tag: "Lazer",
              },
            ].map((item, idx) => (
              <article
                key={idx}
                className="flex flex-col justify-between rounded-lg border border-border bg-surface p-6 transition-colors hover:border-brand-accent/50 hover:bg-surface-elevated"
              >
                <div>
                  <span className="inline-block rounded bg-surface-muted px-2.5 py-1 text-xs font-semibold text-brand-accent">
                    {item.tag}
                  </span>
                  <h3 className="mt-4 text-xl font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm text-foreground-muted">{item.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-border/50">
                  <a
                    href={`https://wa.me/5500000000000?text=Ol%C3%A1!%20Tenho%20interesse%20no%20roteiro%20${encodeURIComponent(item.title)}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-medium text-brand-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent"
                    aria-label={`Consultar disponibilidade para ${item.title} no WhatsApp`}
                  >
                    Consultar disponibilidade →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. Prova Social e Diferenciais */}
      <section className="py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Por que viajar com a CADIFE Tour?
              </h2>
              <ul className="mt-8 space-y-4 text-foreground-muted">
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-primary/20 text-brand-accent font-bold text-xs">✓</span>
                  <span><strong>Consultoria Humana:</strong> Especialistas dedicados a entender seu estilo e orçamento.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-primary/20 text-brand-accent font-bold text-xs">✓</span>
                  <span><strong>Suporte Contínuo:</strong> Acompanhamento durante todo o itinerário até o retorno.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-primary/20 text-brand-accent font-bold text-xs">✓</span>
                  <span><strong>Segurança & Credibilidade:</strong> Agência regularizada com centenas de viajantes atendidos.</span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-border bg-surface-elevated p-8 text-center sm:p-10">
              <p className="text-2xl font-semibold text-foreground">
                Pronto para viver momentos memoráveis?
              </p>
              <p className="mt-3 text-sm text-foreground-muted">
                Fale diretamente com nossa equipe e receba uma cotação personalizada.
              </p>
              <div className="mt-8 flex justify-center">
                <Button size="lg" asChild>
                  <a
                    href="https://wa.me/5500000000000?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20uma%20cota%C3%A7%C3%A3o%20de%20viagem."
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Iniciar Atendimento no WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
