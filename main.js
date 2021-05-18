const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const port = process.env.PORT || 8080;

const cookieString = "SINAGLOBAL=1388680669733.5664.1605506532909; UOR=,,login.sina.com.cn; wvr=6; SSOLoginState=1621302818; _s_tentry=login.sina.com.cn; Apache=1117751146131.3472.1621302822041; wb_view_log_7568552152=1680*10502; ULV=1621302822075:54:8:3:1117751146131.3472.1621302822041:1621260774356; cross_origin_proto=SSL; ALF=1652840315; SUBP=0033WrSXqPxfM725Ws9jqgMF55529P9D9WFGCkTC9e6.vBxhVjMELmy-5JpX5KzhUgL.FoMfSonfSKzpSKz2dJLoIp7LxKML1KBLBKnLxKqL1hnLBoMNSKqRSK-EeK-E; webim_unReadCount=%7B%22time%22%3A1621305302913%2C%22dm_pub_total%22%3A3%2C%22chat_group_client%22%3A0%2C%22chat_group_notice%22%3A0%2C%22allcountNum%22%3A41%2C%22msgbox%22%3A0%7D"

const addCookies = async (cookies_str, page, domain) => {
  let cookies = cookies_str.split(';').map(
      pair => {
      let name = pair.trim().slice(0, pair.trim().indexOf('='));
      let value = pair.trim().slice(pair.trim().indexOf('=') + 1);
      return {name, value, domain}
  });
  await Promise.all(cookies.map(pair => {
      return page.setCookie(pair)
  }))
};

const getSource = async function(url, ele){
  const browser = await puppeteer.launch({ headless: true, defaultViewport: {
    width: 1300,
    height: 900
} });
  const page = await browser.newPage();
  // console.log('getSource', url);
  await addCookies(cookieString, page, 'https://weibo.com/');
  await page.goto(url);
  let html_ele = ele ? ele: 'html'
  await page.waitForSelector(html_ele);
  let html = await page.content();
  let req_url = await page.url()
  console.log(req_url)
  await browser.close();
  return {
  'html': html ? html : '',
  'req_url': req_url
  }
};

app.get('/api/source', async function(req, res) {
  const url = req.query.url;
  const ele = req.query.element;
  let data  = {}
  try{
    data = await getSource(url, ele);
  }catch(e){
    console.log(e);}
  res.send({
    'url': url,
    'source': data['html'],
    'req_url': data['req_url']
  });
});

app.listen(port);
console.log('Server started at http://localhost:' + port);
