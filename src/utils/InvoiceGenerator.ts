import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CartItem } from '../types';

interface ShopSettings {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export const generateInvoicePDF = async (
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

  // Load Burmese Font
  try {
    const fontUrl = 'https://raw.githubusercontent.com/googlefonts/pyidaungsu/master/fonts/Pyidaungsu-Regular.ttf';
    const response = await fetch(fontUrl);
    const arrayBuffer = await response.arrayBuffer();
    
    // Convert ArrayBuffer to Base64
    let binary = '';
    const bytes = new Uint8Array(arrayBuffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = window.btoa(binary);

    doc.addFileToVFS('Pyidaungsu-Regular.ttf', base64);
    doc.addFont('Pyidaungsu-Regular.ttf', 'Pyidaungsu', 'normal');
    doc.setFont('Pyidaungsu');
  } catch (error) {
    console.error('Error loading Burmese font:', error);
    doc.setFont('helvetica');
  }

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
  // Use Pyidaungsu if available, otherwise fallback
  try {
    doc.setFont('Pyidaungsu', 'normal');
  } catch {
    doc.setFont('helvetica', 'bold');
  }
  doc.text(settings.name || 'My Shop', pageWidth / 2, currentY, { align: 'center' });
  currentY += 6;

  doc.setFontSize(8);
  try {
    doc.setFont('Pyidaungsu', 'normal');
  } catch {
    doc.setFont('helvetica', 'normal');
  }
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
  try {
    doc.setFont('Pyidaungsu', 'normal');
  } catch {
    doc.setFont('helvetica', 'bold');
  }
  doc.text('RECEIPT', 10, currentY);
  doc.setFontSize(7);
  try {
    doc.setFont('Pyidaungsu', 'normal');
  } catch {
    doc.setFont('helvetica', 'normal');
  }
  doc.text(new Date().toLocaleString(), pageWidth - 10, currentY, { align: 'right' });
  currentY += 6;

  // Table
  autoTable(doc, {
    startY: currentY,
    head: [['Item', 'Qty', 'Price', 'Total']],
    body: items.map(item => [
      item.item_name,
      item.quantity.toString(),
      `$${item.price.toFixed(2)}`,
      `$${(item.price * item.quantity).toFixed(2)}`
    ]),
    theme: 'plain',
    styles: { 
      fontSize: 7, 
      cellPadding: 1,
      font: doc.getFont().fontName === 'Pyidaungsu' ? 'Pyidaungsu' : 'helvetica'
    },
    headStyles: { fontStyle: 'bold' },
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
  try {
    doc.setFont('Pyidaungsu', 'normal');
  } catch {
    doc.setFont('helvetica', 'bold');
  }
  doc.text(`GRAND TOTAL: $${total.toFixed(2)}`, pageWidth - 10, currentY, { align: 'right' });
  currentY += 10;

  // Thank you message
  doc.setFontSize(8);
  try {
    doc.setFont('Pyidaungsu', 'normal');
  } catch {
    doc.setFont('helvetica', 'italic');
  }
  doc.text('Thank you for shopping with us!', pageWidth / 2, currentY, { align: 'center' });

  // Open in new tab and trigger print
  const blob = doc.output('blob');
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
};
