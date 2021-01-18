
# Routinator UI

The project uses [Vue.js](https://vuejs.org/) as Javascript framework and [Element](https://element.eleme.io/) as UI framework.

## Requirements
* Node.js
* Yarn (or npm)

## Project setup
To get all the required js libraries in, run
```
yarn install
```

To point to the Routinator UI instance, edit the vue.config.js file and its host as a proxy for the API calls
```
devServer: {
  proxy: 'https://localhost:3000'
}
```

### Compiles and hot-reloads for development
Useful during development to instantaneously see the changes on screen
```
yarn run serve
```

### Compiles and minifies for production
To get everything compiled and minified in the "dist" folder
```
yarn run build
```

