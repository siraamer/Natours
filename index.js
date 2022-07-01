import fs from 'fs';
import http from 'http';
import url from 'url';
import replaceTemplate from './modules/replaceTemplate.js';
/////////////////////////////////////
// !FILES
// Blocking, Syncronous way
// const txtIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(txtIn);
// const txtOut = `This is what we know about the avocado: ${txtIn}.\n Created on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', txtOut);
// console.log('file written!');

// Non-blocking, asyncronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//   if (err) return console.log('Error');
//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3) => {
//       console.log(data3);
//       fs.writeFile(`./txt/final.txt`, `${data2} ${data3}`, 'utf-8', (err) => {
//         console.log('Your File Has Been Written! ');
//       });
//     });
//   });
// });
// console.log('will read File');

/////////////////////////////////////
// !SERVER

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
