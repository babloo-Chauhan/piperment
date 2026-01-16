const PDFDocument = require("pdfkit");
const fs = require("fs");

module.exports = (order) => {
  const doc = new PDFDocument();
  const filePath = `invoices/order_${order.id}.pdf`;

  doc.pipe(fs.createWriteStream(filePath));
  doc.text(`Invoice for Order #${order.id}`);
  doc.text(`Total: ₹${order.total_amount}`);
  doc.end();

  return filePath;
};
