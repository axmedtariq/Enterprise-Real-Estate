import PDFDocument from 'pdfkit';
import { Response } from 'express';
import { IProperty } from '../models/property';

export const generatePropertyPDF = (property: IProperty, res: Response) => {
    // 1. INITIALIZE DOCUMENT WITH NOBLE DIMENSIONS
    const doc = new PDFDocument({ 
        size: 'A4', 
        margin: 0, // We will handle margins manually for "Full Bleed" luxury look
        info: {
            Title: `Prospectus - ${property.title}`,
            Author: 'Sovereign Estate Global'
        }
    });

    // Stream directly to client
    doc.pipe(res);

    // 2. BRANDED HEADER (Gold Accent Bar)
    doc.rect(0, 0, 600, 100).fill('#020617'); // Midnight Blue Header
    doc.fillColor('#d4af37').fontSize(24).text("SOVEREIGN ESTATE", 50, 40, { characterSpacing: 2 });
    doc.fontSize(8).fillColor('#ffffff').text("INSTITUTIONAL GRADE ASSET REGISTER", 50, 70, { characterSpacing: 4 });

    // 3. ASSET TITLE & VALUATION
    doc.moveDown(4);
    doc.fillColor('#020617').fontSize(32).text(property.title.toUpperCase(), 50, 140, { lineGap: 10 });
    
    // Price Ribbon
    doc.rect(50, 190, 200, 30).fill('#d4af37');
    doc.fillColor('#000000').fontSize(14).text(`VALUATION: $${(property.price / 1000000).toFixed(1)}M`, 65, 200, { font: 'Helvetica-Bold' });

    // 4. ARCHITECTURAL INTELLIGENCE (Grid Layout)
    doc.fillColor('#64748b').fontSize(10).text("ASSET SPECIFICATIONS", 50, 250);
    doc.moveTo(50, 265).lineTo(540, 265).stroke('#e2e8f0');

    const yPos = 280;
    doc.fillColor('#020617').fontSize(12);
    doc.text(`LOCATION: ${property.location.address}`, 50, yPos);
    doc.text(`CATEGORY: ${property.category.toUpperCase()}`, 50, yPos + 25);
    doc.text(`STATUS: SECURED / VERIFIED`, 50, yPos + 50);

    // 5. DESCRIPTION (Noble Serif Style)
    doc.moveDown(6);
    doc.fillColor('#1e293b').fontSize(14).text("EXECUTIVE SUMMARY", 50);
    doc.fontSize(11).fillColor('#475569').text(property.description, {
        width: 480,
        align: 'justify',
        lineGap: 5
    });

    // 6. FOOTER & AUTHENTICITY SEAL
    const footerY = 750;
    doc.rect(0, footerY, 600, 100).fill('#f8fafc');
    doc.fillColor('#94a3b8').fontSize(8).text("© 2026 SOVEREIGN ESTATE GLOBAL. ALL RIGHTS RESERVED.", 50, footerY + 40);
    doc.fillColor('#d4af37').text("SCAN FOR 3D SPATIAL TOUR", 400, footerY + 40, { underline: true });

    // Finalize
    doc.end();
};