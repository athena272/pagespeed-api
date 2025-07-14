# PageSpeed Insights App

Uma aplicação web moderna para analisar rapidamente o desempenho, acessibilidade, melhores práticas e SEO de múltiplas URLs usando a API do Google PageSpeed Insights.

## 🌐 Acesse Online

O app está disponível em: [pagespeed-insights-app.vercel.app](https://pagespeed-insights-app.vercel.app)

## ✨ Funcionalidades
- Análise em lote de múltiplas URLs
- Visualização de métricas (Desempenho, Acessibilidade, Práticas, SEO)
- Gráficos interativos
- Interface responsiva e moderna (Material UI)
- Feedback visual de carregamento e erros

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

## 🖼️ Preview
![Preview da interface](./docs/preview.png)

## 💡 Customização
- O layout usa Material UI e pode ser facilmente customizado em `src/App.tsx` e componentes em `src/components/`.
- Para trocar temas, consulte a [documentação do MUI](https://mui.com/material-ui/customization/theming/).

## 📝 Licença
MIT

---

Feito com ❤️ por [Seu Nome](https://github.com/seu-usuario)
