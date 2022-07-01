import fs from 'fs';
import http from 'http';
import url from 'url';
import replaceTemplate from './modules/replaceTemplate.js';


const data = fs.readFileSync(`./dev-data/data.json`, 'utf-8');
const dataObject = JSON.parse(data);

const tempOverview = fs.readFileSync(
  `./templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(`./templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(
  `./templates/template-product.html`,
  'utf-8'
);

const server = http.createServer((request, response) => {
  const { query, pathname } = url.parse(request.url, true);

  //! Overview Page
  if (pathname === '/' || pathname === '/overview') {
    response.writeHead(200, { 'Content-type': 'text/html' });

    const cardHtml = dataObject
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardHtml);
    response.end(output);

    //! Product Page
  } else if (pathname === '/product') {
    const product = dataObject[query.id];
    const output = replaceTemplate(tempProduct, product);
    response.end(output);

    //! API Page
  } else if (pathname === '/api') {
    response.writeHead(200, { 'Content-type': 'application/json' });
    response.end(data);

    //! Not Found Page
  } else {
    response.writeHead(404);
    response.end('<h1>Page Not Found!');
  }
});

server.listen(2000, () => console.log('SERVER OKAY!'));
