/* global PRIVATEASER*/
'use strict';
var fs=reauire('fs');
var path = require('path'); //系统路径模块
(() => {
  const render = (actors) => {
    const fragment = document.createDocumentFragment();
    const div = document.createElement('div');
    const template = actors.map(actor => {
      return `
        <div class="actor"><br>&nbsp;
          <span>${actor.name}</span>
          <span>${actor.price}</span>
        </div>
      `;
    }).join('');

    div.innerHTML = template;
    fragment.appendChild(div);
    document.querySelector('#actors').innerHTML = '';
    document.querySelector('#actors').appendChild(fragment);
  };

  const button = document.querySelector('#compute');

  button.addEventListener('click', function onClick () {
    const name = document.querySelector('#bar .js-name').value,
    const price = document.querySelector('#bar .js-price-by-hour').value;
    var file = path.join(__dirname, 'test.json'); 
    var result=JSON.parse(fs.readFileSync( file));
    var actors;
    for(i=0;i<=result.length;i++){
      if(name!=null&&result[i].hotel==name){
        actors=result[i];
      }else if(price!=null&&result[i].price==price){
        actors=result[i];
      }else{
        actors=result;
      }
    }
    render(actors);

    return;
  });
})();
