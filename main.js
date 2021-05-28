const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const port = process.env.PORT || 8080;
const config = { headless: false, defaultViewport: {
    width: 1300,
    height: 900
},
  timeout: 15000
}

const getSource = async function(url, ele){
  const browser = await puppeteer.launch(config);
  const page = await browser.newPage();
  await page.goto(url);
  let html_ele = ele ? ele: 'html';
  await page.waitForSelector(html_ele);
  let html = await page.content();
  let req_url = await page.url();
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
