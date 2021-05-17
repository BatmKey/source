const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const port = process.env.PORT || 8080;

const getSource = async function(url, ele){
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  console.log('getSource', url);
  await page.goto(url);
  let html_ele = ele ? ele: 'html'
  await page.waitForSelector(html_ele);
  let html = await page.content();
  await browser.close();
  return html
};

app.get('/api/source', async function(req, res) {
  const url = req.query.url;
  const ele = req.query.element;
  let source = ''
  try{
  source = await getSource(url, ele);
  }catch(e){
    console.log(e);
    let source = '';}
  res.send({
    'url': url,
    'source': source
  });
});

app.listen(port);
console.log('Server started at http://localhost:' + port);
