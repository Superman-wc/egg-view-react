'use strict';

const path = require('path');
const React = require('react');
const renderer = require('react-dom/server');
const RENDER = Symbol('ReactView#_render');
let babelRegister;

class View {

  constructor(ctx) {
    this.ctx = ctx;
    this.app = ctx.app;
    this.config = ctx.app.config.view;

    if (!babelRegister) {
      babelRegister = require('babel-register');
      babelRegister({
        "presets": ["react", "es2015", "stage-0"],

        "plugins": [
          "transform-runtime",
          "add-module-exports",
          "transform-decorators-legacy",
          "transform-react-display-name"
        ],


      })
    }
  }

  [RENDER](filename, locals, config) {
    return new Promise((resolve, reject) => {
      let html = '<!DOCTYPE html>';
      try {
        const component = require(filename);
        html += renderer.renderToStaticMarkup(React.createElement(component.default || component, locals || {}));
        resolve(html);
      } catch (ex) {
        reject(ex);
      }
    });
  }

  * render(filename, locals, viewOptions) {
    const config = Object.assign({}, this.config, viewOptions, { filename });
    return yield this[RENDER](filename, locals, config);
  }

  renderString(component, locals, viewOptions) {
    const config = Object.assign({}, this.config, viewOptions, { cache: null });
    return new Promise((resolve, reject) => {
      try {
        let html = renderer.renderToStaticMarkup(React.createElement(component, locals || {}));
        resolve(html);
      } catch (ex) {
        reject(ex);
      }
    });

}

module.exports = View;
