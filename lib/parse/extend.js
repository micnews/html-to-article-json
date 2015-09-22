'use strict';

module.exports = function extend (opts, update) {
  return {
    type: 'text',
    content: update.content || opts.content,
    href: update.href || opts.href,
    bold: update.bold || opts.bold,
    italic: update.italic || opts.italic
  };
};
