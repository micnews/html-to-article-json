export default elm => ({
  width: parseInt(elm.getAttribute('width') || elm.style.width, 10) ||
    undefined,
  height: parseInt(elm.getAttribute('height') || elm.style.height, 10) ||
    undefined
});
