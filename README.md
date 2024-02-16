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

To deploy a new version of the website follow these steps:
1. Merge the new code from 'development' branch to 'production'.
2. On the 'production' branch run:
```sh
npm run build
```
3. Run the following git commands:
```sh
git add dist -f
git commit -m 'adding dist subtree'
git subtree push --prefix dist origin gh-pages
```
This will add the contents of the 'dist' folder to the 'gh-pages' branch. 

In a few minutes, GitHub Pages should refresh with your newest repository changes, and you should be able to see your Vue project online. 