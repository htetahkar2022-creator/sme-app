import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { CartItem } from '../types';

interface ShopSettings {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export const generateInvoicePDF = (
  items: CartItem[],
  total: number,
  settings: ShopSettings,
  logoUrl: string | null
) => {
  // 1/4 A4 is roughly 105mm x 148mm
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [105, 148]
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = 10;

  // Header - Logo
  if (logoUrl) {
    try {
      doc.addImage(logoUrl, 'PNG', pageWidth / 2 - 10, currentY, 20, 20);
      currentY += 25;
    } catch (e) {
      console.error('Error adding logo to PDF', e);
    }
  }

  // Shop Info
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(settings.name || 'My Shop', pageWidth / 2, currentY, { align: 'center' });
  currentY += 6;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(settings.address || '', pageWidth / 2, currentY, { align: 'center' });
  currentY += 4;
  doc.text(settings.phone || '', pageWidth / 2, currentY, { align: 'center' });
  currentY += 4;
  doc.text(settings.email || '', pageWidth / 2, currentY, { align: 'center' });
  currentY += 8;

  // Divider
  doc.setDrawColor(200);
  doc.line(10, currentY, pageWidth - 10, currentY);
  currentY += 5;

  // Invoice Title & Date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('RECEIPT', 10, currentY);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date().toLocaleString(), pageWidth - 10, currentY, { align: 'right' });
  currentY += 6;

  // Table
  (doc as any).autoTable({
    startY: currentY,
    head: [['Item', 'Qty', 'Price', 'Total']],
    body: items.map(item => [
      item.item_name,
      item.quantity.toString(),
      `$${item.price.toFixed(2)}`,
      `$${(item.price * item.quantity).toFixed(2)}`
    ]),
    theme: 'plain',
    styles: { fontSize: 7, cellPadding: 1 },
    headStyles: { fontStyle: 'bold', borderBottom: { lineWidth: 0.1, color: [200, 200, 200] } },
    margin: { left: 10, right: 10 },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { halign: 'center' },
      2: { halign: 'right' },
      3: { halign: 'right' }
    }
  });

  currentY = (doc as any).lastAutoTable.finalY + 5;

  // Footer - Total
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`GRAND TOTAL: $${total.toFixed(2)}`, pageWidth - 10, currentY, { align: 'right' });
  currentY += 10;

  // Thank you message
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('Thank you for shopping with us!', pageWidth / 2, currentY, { align: 'center' });

  // Open in new tab and trigger print
  const blob = doc.output('blob');
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
};
