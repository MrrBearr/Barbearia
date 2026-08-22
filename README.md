# DOMÍNIO Barbearia — projeto demonstrativo

Landing page estática criada pela CA Studio para demonstrar uma proposta visual de barbearia. A marca, os serviços, os preços, os depoimentos, as imagens e os dados comerciais são fictícios.

O site inclui aviso visível de demonstração, `noindex, nofollow`, permite que os rastreadores leiam essa diretiva em `robots.txt` e não publica dados estruturados de negócio local. Os botões de WhatsApp apontam para Caio Alexandre, responsável pela CA Studio, com uma mensagem que identifica esta demonstração.

## Tecnologia

HTML, CSS e JavaScript puros, sem dependências ou etapa de build.

## Executar localmente

```bash
python -m http.server 8000
```

Abra `http://localhost:8000`.

## Estrutura

- `index.html`: conteúdo e marcação semântica
- `assets/css/styles.css`: identidade visual e responsividade
- `assets/js/main.js`: menu, animações, FAQ e carrossel
- `robots.txt`: acesso liberado para que a diretiva `noindex` seja lida

Antes de adaptar para um negócio real, substitua todo o conteúdo fictício por dados aprovados pelo cliente e só então revise SEO, indexação e contatos.
