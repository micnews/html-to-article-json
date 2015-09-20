'use strict';

var renderInline = require('./inline-elements');
var tags = {
  paragraph: 'p',
  header1: 'h1',
  header2: 'h2',
  header3: 'h3',
  header4: 'h4',
  header5: 'h5',
  header6: 'h6'
};

module.exports = function (data, parent) {
  data.forEach(function (obj) {
    if (tags[obj.type]) {
      var child = parent.appendChild(document.createElement(tags[obj.type]));
      renderInline(obj.children, child);
    }
  });
};
