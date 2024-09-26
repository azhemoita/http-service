'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const pdf = require('pdfkit');
const app = express();

app.use(bodyParser.json());

app.post('/generate-report', (req, res) => {
  const { guid, reportType, ...optionalParams } = req.body;

  if (!guid || !reportType) {
    return res.status(400).send('GUID и вид справки обязательны.');
  }

  const doc = new pdf();
  let buffers = [];
  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {
    const pdfData = Buffer.concat(buffers);
    const base64Pdf = pdfData.toString('base64');
    res.json({ pdf: base64Pdf });
  });

  doc.font('./font/ArialMT.ttf');

  doc.text(`GUID: ${guid}`);
  doc.text(`Вид справки: ${reportType}`);
  for (const [key, value] of Object.entries(optionalParams)) {
    doc.text(`${key}: ${value}`);
  }

  doc.end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
