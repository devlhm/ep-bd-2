# BeautySoft

Um sistema de gestão para clínicas de estética, incluindo gerenciamento de faturas, agendamentos, clientes e profissionais.

## Executando os Scripts

Para executar o servidor de desenvolvimento para a API, use:
```sh
npm run dev-api
```

Para executar o servidor de desenvolvimento para o frontend, use:
```sh
npm run dev
```

Para construir o projeto, use:
```sh
npm run build
```

Para visualizar o projeto construído, use:
```sh
npm run preview
```

## Typescript + React + Vite

Este template fornece uma configuração mínima para fazer o React funcionar no Vite com HMR (Hot Module Replacement) e algumas regras do ESLint.

Atualmente, dois plugins oficiais estão disponíveis:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) usa [Babel](https://babeljs.io/) para Fast Refresh.
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) usa [SWC](https://swc.rs/) para Fast Refresh.

## Expandindo a configuração do ESLint

Se você está desenvolvendo uma aplicação de produção, recomendamos atualizar a configuração para habilitar regras de lint com reconhecimento de tipos:

1. Configure a propriedade `parserOptions` no nível superior assim:

  ```js
  export default tseslint.config({
    languageOptions: {
    // outras opções...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
    },
  })
  ```

2. Substitua `tseslint.configs.recommended` por `tseslint.configs.recommendedTypeChecked` ou `tseslint.configs.strictTypeChecked`.

3. Opcionalmente, adicione `...tseslint.configs.stylisticTypeChecked`.

4. Instale [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) e atualize a configuração:

  ```js
  // eslint.config.js
  import react from 'eslint-plugin-react'

  export default tseslint.config({
    // Defina a versão do react
    settings: { react: { version: '18.3' } },
    plugins: {
    // Adicione o plugin react
    react,
    },
    rules: {
    // outras regras...
    // Habilite suas regras recomendadas
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
    },
  })
  ```
