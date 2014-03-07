if (input.replace(/http(s?):\/\/\S+/g, function (m, isHttps) {
  return Array(isHttps?24:23).join('x');
}).length > 140) throw new Error('tweet is too long!');
