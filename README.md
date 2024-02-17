# LekkerSicko

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
## Deployment

Deployment is orchestrated through a Continuous Integration/Continuous Deployment (CI/CD) pipeline, located in the .github/workflows directory within the repository. The GitHub workflow initiates upon a push to the repository's 'master' branch. It undertakes the task of building the Vue application and subsequently pushes the resulting 'dist' folder to the 'gh-pages' branch.

For comprehensive documentation on the workflow utilized, refer to https://github.com/marketplace/actions/vue-to-github-pages.

Upon pushing changes to the 'master' branch, GitHub typically completes the deployment of the updated Vue application within approximately 3 minutes.