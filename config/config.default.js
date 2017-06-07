'use strict';

const path = require('path');

module.exports = appInfo => {
  return {
    react: {
      root: path.join(appInfo.baseDir, 'app/view'),
    }
  }
};
