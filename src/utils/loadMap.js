export function loadMap(key = '3f3789735d7d50290d52d154ded286b6', v='1.4.15') {
  return new Promise(function(resolve, reject) {
    if(typeof AMap !== 'undefined') {
      // eslint-disable-next-line no-undef
      resolve(AMap);
      return;
    }
    window.onCallback = function() {
      // eslint-disable-next-line no-undef
      resolve(AMap);
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://webapi.amap.com/maps?v=${v}&key=${key}&callback=onCallback`;
    script.onerror = reject;
    document.head.appendChild(script);
  })
}