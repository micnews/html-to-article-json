'use strict';

import setupParse from '../lib/index';

const parse = setupParse({});

const input = document.querySelector('.input');
const result = document.querySelector('.result');

const update = () => {
  result.innerHTML = JSON.stringify(parse(input.outerHTML), null, 2);
};

update();

window.update = update;

document.querySelector('.update').onclick = update;
