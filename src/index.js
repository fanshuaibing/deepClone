const cache = []



const deepclone = (source) => {
  if (source instanceof Object) {
    const cacheDist = findCache(source)
    if (cacheDist) {
      return cacheDist
    }
    else {
      let dist
      if (source instanceof Function) {
        dist = function () {
          return source.apply(this, arguments)
        }
      }
      else if (source instanceof RegExp) {
        dist = new RegExp(source.source, source.flags)
      }
      else if (source instanceof Date) {
         dist = new Date(source);
      }
      else if (source instanceof Array) {
        dist = []
      }
      else {
        dist = new Object()
      }
      cache.push([source, dist])
      for (let key in source) {
        if(source.hasOwnProperty(key)){
          dist[key] = deepclone(source[key])
        }
      }
      return dist
    }
  }
  return source

}
function findCache(source) {
  for (let i = 0; i < cache.length; i++) {
    if (cache[i][0] === source) {
      return cache[i][1];
    }
  }
  return undefined;
}

module.exports = deepclone
