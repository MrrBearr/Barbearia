# DOMÍNIO Barbearia — Landing Page

Landing page premium para barbearia, com foco em **agendamentos via WhatsApp** e valorização da marca. Visual escuro, dourado, masculino, com sensação de clube exclusivo.

> **Demo:** abra `index.html` no navegador. Sem build, sem dependências — HTML + CSS + JS puros.

---

## Estrutura de arquivos

```
.
├── index.html                # Marcação semântica + SEO + Schema.org
├── assets/
│   ├── css/styles.css        # Design system completo, mobile-first
│   └── js/main.js            # Menu, slider, reveal-on-scroll
└── README.md
```

---

## Design system

### Paleta

| Token            | Hex       | Uso                              |
|------------------|-----------|----------------------------------|
| `--c-bg`         | `#0a0a0a` | Fundo principal                  |
| `--c-bg-2`       | `#111111` | Fundo de seções alternadas       |
| `--c-bg-3`       | `#161616` | Cards, hovers                    |
| `--c-line`       | `#232323` | Linhas, borders                  |
| `--c-text`       | `#ececec` | Texto principal                  |
| `--c-text-2`     | `#a8a8a8` | Texto secundário                 |
| `--c-gold`       | `#c9a14a` | Acento principal (CTAs, marca)   |
| `--c-gold-2`     | `#e3c074` | Acento claro (titles, hover)     |
| `--c-white`      | `#f7f3ea` | Branco quente para títulos       |

### Tipografia

- **Display / títulos:** [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) — serif elegante, alto contraste.
- **Corpo / UI:** [Inter](https://fonts.google.com/specimen/Inter) — sans neutra, ótima legibilidade.

Carregadas via Google Fonts com `preconnect` para performance.

### Princípios

- **Mobile-first** — todos os breakpoints sobem a partir do mobile.
- **Contraste forte** — preto profundo + dourado como acento, sem cores extras.
- **Tipografia hierárquica** — display em `clamp()` para escalar fluidamente.
- **Espaço generoso** — seções com `--space-2xl` para respiro.
- **Movimento sutil** — reveal-on-scroll, hover lifts, zoom no hero.

---

## Personalização rápida

Abra `index.html` e use **Find & Replace** (Ctrl/Cmd + H):

| O que trocar              | Buscar                                      |
|---------------------------|---------------------------------------------|
| Nome da barbearia         | `DOMÍNIO`                                   |
| Cidade                    | `São Paulo`                                 |
| Link WhatsApp             | `https://wa.me/5511999999999`               |
| Telefone exibido          | `(11) 99999-9999`                           |
| E-mail                    | `contato@dominio-barbearia.com.br`          |
| Endereço                  | `Rua Augusta, 1000`                         |
| Instagram                 | `https://instagram.com/dominio.barbearia`   |
| Domínio (canonical/OG)    | `https://dominio-barbearia.com.br`          |

### Imagens

Hoje as imagens vêm do Unsplash (placeholders de qualidade). Para usar fotos reais:

1. Coloque suas imagens em `assets/img/`.
2. Substitua as URLs nas tags `<img>` da galeria, do `<section class="about">`, e nos `background-image` do `.hero__bg` e `.cta__bg` (em `styles.css`).
3. Recomendo otimizar com [Squoosh](https://squoosh.app/) (WebP, ~150–250 KB cada).

### Serviços e preços

Edite os blocos `<article class="service-card">` em `index.html`. A estrutura é:

```html
<article class="service-card">
  <div class="service-card__num">01</div>
  <h3 class="service-card__title">Nome</h3>
  <p class="service-card__desc">Descrição curta.</p>
  <div class="service-card__foot">
    <span class="price">R$ 90</span>
    <span class="time">45 min</span>
  </div>
</article>
```

Adicione `class="service-card service-card--featured"` + `<span class="badge">Mais procurado</span>` para destacar.

---

## Performance e acessibilidade

- ✅ HTML semântico (`<header>`, `<main>`, `<section>`, `<article>`, `<figure>`)
- ✅ `aria-label`, `aria-expanded`, `aria-controls` no menu mobile
- ✅ `:focus-visible` com contorno dourado
- ✅ `loading="lazy"` em imagens fora do hero
- ✅ `prefers-reduced-motion` respeitado
- ✅ `<meta name="theme-color">` para barra do navegador mobile
- ✅ Schema.org `HairSalon` para SEO local
- ✅ Sem JS bloqueante (tudo em `defer`)

---

## SEO local

- `<title>` e `<meta name="description">` mencionam **cidade** + **serviço**.
- Open Graph configurado (compartilhamento no WhatsApp e redes).
- Schema.org `HairSalon` com endereço, telefone e horário — Google entende como negócio local.
- URLs canônicas configuradas (atualize o domínio real).

---

## Deploy

Por ser estático, qualquer hospedagem serve. Recomendações:

- [Netlify Drop](https://app.netlify.com/drop) — arraste a pasta, pronto.
- [Vercel](https://vercel.com) — `vercel` na pasta.
- [Cloudflare Pages](https://pages.cloudflare.com) — conecte o GitHub.
- GitHub Pages — push e ative em Settings → Pages.

---

## Próximos passos sugeridos

- [ ] Substituir imagens do Unsplash por fotos reais da casa.
- [ ] Trocar nome, cidade, WhatsApp, endereço e Instagram (lista acima).
- [ ] Conectar Google Analytics ou Plausible.
- [ ] Adicionar pixel do Meta para campanhas.
- [ ] (Opcional) Integrar com sistema de agendamento online se quiser tirar do WhatsApp.
