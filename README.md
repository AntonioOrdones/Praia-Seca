# Praia Seca a dois 🌅

Site mobile com o roteiro completo da viagem a Praia Seca e Região dos Lagos (16 a 23/11/2026):
roteiro hora a hora, 434 lugares com busca e filtros, sol, lua e marés de cada dia, reservas, checklist e emergência.

Feito com **React 19 + Vite 8**, HTML e CSS modernos (camadas `@layer`, `light-dark()`, `color-mix()`, `dvh`, `<dialog>`),
sem bibliotecas extras. Funciona offline depois da primeira visita (service worker) e pode ser instalado na tela inicial do celular.

---

## Como publicar no GitHub Pages (uns 5 minutos)

1. **Crie um repositório** no GitHub (ex.: `praia-seca`).
   O GitHub Pages gratuito exige repositório **público** — o site fica acessível para quem tiver o link
   (ele não aparece no Google: tem `noindex`). Não coloque aqui o endereço exato da casa.
2. **Envie os arquivos** desta pasta para o repositório (branch `main`):
   - pelo site: *Add file → Upload files*, arraste **todo o conteúdo** da pasta descompactada
     (incluindo a pasta oculta `.github`; no Mac, `Cmd + Shift + .` mostra pastas ocultas);
   - ou pelo terminal:
     ```bash
     git init && git add . && git commit -m "Roteiro Praia Seca"
     git branch -M main
     git remote add origin https://github.com/SEU-USUARIO/praia-seca.git
     git push -u origin main
     ```
3. No repositório, vá em **Settings → Pages → Build and deployment → Source** e escolha **GitHub Actions**.
4. Abra a aba **Actions**: o fluxo "Publicar no GitHub Pages" roda sozinho (1–2 min).
   Se ele rodou antes do passo 3, clique em **Re-run all jobs**.
5. O site fica em `https://SEU-USUARIO.github.io/praia-seca/`.
6. No celular: abra o link e use **Compartilhar → Adicionar à Tela de Início** (iPhone) ou
   **⋮ → Instalar app** (Android). Abra uma vez com internet para ficar disponível offline.

Toda vez que você fizer um novo commit na `main`, o site é republicado automaticamente.

---

## Rodar no computador (opcional)

Precisa do Node.js 22 ou mais novo.

```bash
npm install
npm run dev        # abre em http://localhost:5173
npm run build      # gera a pasta dist/
npm run preview    # testa a versão de produção
```

**Simular um momento da viagem:** acrescente `?agora=2026-11-18T19:30` na URL
(ex.: `http://localhost:5173/?agora=2026-11-18T19:30#/hoje`) para ver o "Agora / A seguir".

---

## Onde editar

| O que | Arquivo |
|---|---|
| Roteiro hora a hora, sol, lua, marés, reservas, checklist, eventos, regras, vídeos | `src/data/viagem.json` |
| Os 434 lugares (praias, restaurantes, passeios…) | `public/data/lugares.json` |
| Cores, fontes, espaçamentos (design system) | `src/styles/tokens.css` |
| Componentes e telas | `src/components/`, `src/pages/` |

Depois de mudar `public/data/lugares.json`, troque `VERSION` em `public/sw.js`
(ex.: `praia-seca-v2`) para os celulares baixarem a versão nova.

## Estrutura

```
.github/workflows/deploy.yml   publica no Pages a cada push
public/                        manifest, ícones, service worker e dados dos lugares
src/
  data/viagem.json             roteiro + informações
  lib/                         hora da viagem, armazenamento local, busca, rotas
  components/                  ícones, cartões, bottom sheet, gráficos de sol/maré/lua
  pages/                       Hoje, Roteiro, Explorar, Céu & mar, Mais
  styles/                      tokens do design system + estilos
```

## Sobre os dados

Tudo vem da planilha da viagem (pesquisa de setembro/2026: prefeituras, ICMBio, Marinha, Tripadvisor, Google).
Itens marcados como **"a confirmar"** não foram verificados — confirme horários na véspera, principalmente
no feriado de 20/11. Sol e lua foram calculados para Praia Seca; marés vêm da tábua da Marinha (Porto do Forno),
com 21/11 ainda por confirmar. Favoritos, itens feitos e checklists ficam salvos só no próprio celular.
