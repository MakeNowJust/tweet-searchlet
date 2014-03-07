input = (function () {
  var
  title = document.title,
  url = location.href,
  page = title + ' - ' + url;
  
  return input.replace(/\{[^}]*\}/g, function (m) {
    return eval(m);
  });
})();
