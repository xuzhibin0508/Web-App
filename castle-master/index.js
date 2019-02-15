const express = require('express');
const app = express();

// ...

let server = app.listen(3000, function () {
  let host = server.address().address;
  let port = server.address().port;
  console.log('Your App is running at http://%s:%s', host, port);
});

const cheerio1 = require('cheerio');
let getMichelin = (res) => {
  let michelins = [];
  // 访问成功，请求页面所返回的数据会包含在res.text中。

  /* 使用cheerio模块的cherrio.load()方法，将HTMLdocument作为参数传入函数
     以后就可以使用类似jQuery的$(selectior)的方式来获取页面元素
   */
  let $ = cheerio1.load(res.text);
  // 找到目标数据所在的页面元素，获取数据
  $('div.poi_card-display-title').each((idx, ele) => {
    // cherrio中$('selector').each()用来遍历所有匹配到的DOM元素
    // 参数idx是当前遍历的元素的索引，ele就是当前便利的DOM元素
    let hotel = $(ele).text();
    hotel = hotel.replace(/\ +/g, "");
    hotel = hotel.replace(/[\r\n]/g, "");
    michelins.push(hotel)              // 存入最终结果数组
  });
//  console.log(michelin);
  return michelins;
};

let michelin = [];
const superagent = require('superagent');
for (let count = 1; count <= 343; count++) {
  // show:true  显示内置模拟浏览器

  superagent.get(`https://restaurant.michelin.fr/restaurants/france/page-${count}`).end((err, res) => {
    if (err) {
      // 如果访问失败或者出错，会这行这里
      console.log(`抓取https://restaurant.michelin.fr/restaurants/france/page-${count}失败 - ${err}`)
    } else {
      // 访问成功，请求页面所返回的数据会包含在res
      // 抓取数据
      pageRes = res;
      let b = getMichelin(res);
      for (let k = 0; k < b.length; k++) {
        michelin.push(b[k]);
      }
    }
  })
}


const cheerio = require('cheerio');
let getHotel = (htmlStr) => {
  let hotels = [];
  let prices = [];
  let whole = [];
  // 访问成功，请求页面所返回的数据会包含在res.text中。

  /* 使用cheerio模块的cherrio.load()方法，将HTMLdocument作为参数传入函数
     以后就可以使用类似jQuery的$(selectior)的方式来获取页面元素
   */
  let $ = cheerio.load(htmlStr);
  // 找到目标数据所在的页面元素，获取数据
  $('h3.mainTitle3 a span').each((idx, ele) => {
    // cherrio中$('selector').each()用来遍历所有匹配到的DOM元素
    // 参数idx是当前遍历的元素的索引，ele就是当前便利的DOM元素
    let hotel = $(ele).text();
    hotels.push(hotel)              // 存入最终结果数组
  });
  $('span.price span.price').each((idx, ele) => {
    // cherrio中$('selector').each()用来遍历所有匹配到的DOM元素
    // 参数idx是当前遍历的元素的索引，ele就是当前便利的DOM元素
    let price = $(ele).text();
    prices.push(price)              // 存入最终结果数组
  });
 // console.log(hotels)
 // console.log(prices)

  for (var i = 0; i < hotels.length; i++) {
    let all = {
      hotel: hotels[i],
      price: prices[i]
    };
    whole.push(all);
  }
  return whole
};

var url = [
  'https://www.relaischateaux.com/us/destinations/europe/france/',
  'https://www.relaischateaux.com/us/destinations/europe/france?page=2/',
  'https://www.relaischateaux.com/us/destinations/europe/france?page=3/',
  'https://www.relaischateaux.com/us/destinations/europe/france?page=4/',
  'https://www.relaischateaux.com/us/destinations/europe/france?page=5/',
  'https://www.relaischateaux.com/us/destinations/europe/france?page=6/',
  'https://www.relaischateaux.com/us/destinations/europe/france?page=7/',
  'https://www.relaischateaux.com/us/destinations/europe/france?page=8/',
];
var hotel = [];      // 自动化测试包，处理动态页面
for (let count = 0; count < url.length; count++) {
  // show:true  显示内置模拟浏览器
  const Nightmare = require('nightmare');
  const nightmare = Nightmare({ show: false });
  nightmare
    .goto(url[count])
    .wait("div.overmapWrap")
    .evaluate(() => document.querySelector('div.overmapWrap').innerHTML)
    .then(htmlStr => {
      // 获取数据
      var a = getHotel(htmlStr);
      for (var j = 0; j < a.length; j++) {
        hotel.push(a[j]);
      }
    })
    .catch(error => {
    //  console.log(`抓取失败 - ${error}`);
    })
}

var restaurant=[];




app.get('/', async (req, res, next) => {
  for(var m = 0; m <hotel.length ; m++){
    for(var n = 0; n < michelin.length; n++){
      a=hotel[m].hotel.replace(/\s+/g, '');
      if(a.toLowerCase()==michelin[n].toLowerCase()){
        restaurant.push(hotel[m]);
      }
    }
  }
  res.send({"Michelin restaurants and prices":restaurant});
//  res.send({
//    restaurant:restaurant,
//    hotel:hotel
//  });
});
