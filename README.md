# PageSpeed Insights App

Uma aplicação web moderna para analisar rapidamente o desempenho, acessibilidade, melhores práticas e SEO de múltiplas URLs usando a API do Google PageSpeed Insights.

## 🌐 Acesse Online

O app está disponível em: [pagespeed-insights-app.vercel.app](https://pagespeed-insights-app.vercel.app)

<img width="1609" height="690" alt="image" src="https://github.com/user-attachments/assets/94813edb-ee96-4612-9247-2dfa51345eb8" />

<img width="1580" height="892" alt="image" src="https://github.com/user-attachments/assets/1fb371a1-ca05-415c-871d-a3c894796f75" />

## ✨ Funcionalidades
- Análise em lote de múltiplas URLs
- Visualização de métricas (Desempenho, Acessibilidade, Práticas, SEO)
- Gráficos interativos
- Interface responsiva e moderna (Material UI)
- Feedback visual de carregamento e erros
- **Relatório detalhado dos problemas encontrados**
- **Download do relatório em JSON**

## 📝 Relatório Detalhado dos Problemas

Após analisar as URLs, você pode:
- **Visualizar um relatório detalhado** com todos os problemas encontrados pelo PageSpeed Insights (performance, acessibilidade, SEO, melhores práticas, etc.)
- **Baixar o relatório completo em JSON** para consulta ou auditoria

Cada problema inclui:
- Título e descrição
- Impacto estimado (ex: economia de bytes ou milissegundos)
- Categoria

## 🚀 Tecnologias Utilizadas
- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Material UI (MUI)](https://mui.com/)
- [Framer Motion](https://www.framer.com/motion/) (animações)
- [Recharts](https://recharts.org/) (gráficos)

## 🛠️ Instalação e Execução

1. **Clone o repositório:**
   ```sh
   git clone https://github.com/seu-usuario/pagespeed-insights-app.git
   cd pagespeed-insights-app
   ```

2. **Instale as dependências:**
   ```sh
   pnpm install
   # ou npm install
   ```

3. **Configure a chave da API do Google PageSpeed Insights:**
   - Crie um arquivo `.env` na raiz do projeto:
     ```env
     VITE_PSI_API_KEY=YOUR_GOOGLE_API_KEY
     ```
   - Substitua `YOUR_GOOGLE_API_KEY` pela sua chave.

4. **Execute o projeto em modo desenvolvimento:**
   ```sh
   pnpm dev
   # ou npm run dev
   ```

5. **Acesse em:**
   [http://localhost:5173](http://localhost:5173)

## 📦 Build para Produção
```sh
pnpm build
# ou npm run build
```
Os arquivos finais estarão em `dist/`.

## 💡 Customização
- O layout usa Material UI e pode ser facilmente customizado em `src/App.tsx` e componentes em `src/components/`.
- Para trocar temas, consulte a [documentação do MUI](https://mui.com/material-ui/customization/theming/).

## 📝 Licença
MIT

---
