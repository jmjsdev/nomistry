import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { NameAvailabilityReport } from '@/types';
import { formatDate } from './utils';

export function exportReportToPDF(reports: NameAvailabilityReport[]) {
  const doc = new jsPDF();

  // Titre
  doc.setFontSize(20);
  doc.text('Rapport de Disponibilité - Nomistry', 14, 20);

  doc.setFontSize(10);
  doc.text(`Généré le ${formatDate(new Date())}`, 14, 28);

  let yPosition = 40;

  reports.forEach((report, index) => {
    if (index > 0) {
      doc.addPage();
      yPosition = 20;
    }

    // Nom et score
    doc.setFontSize(16);
    doc.text(`Nom: ${report.name}`, 14, yPosition);
    yPosition += 8;

    doc.setFontSize(12);
    doc.text(`Score de disponibilité: ${report.overallScore}%`, 14, yPosition);
    yPosition += 10;

    // Tableau des domaines
    if (report.domains.length > 0) {
      doc.setFontSize(14);
      doc.text('Noms de domaine:', 14, yPosition);
      yPosition += 6;

      autoTable(doc, {
        startY: yPosition,
        head: [['Extension', 'Statut', 'Registrar']],
        body: report.domains.map((d) => [
          d.tld,
          d.status === 'available' ? 'Disponible' : 'Pris',
          d.registrar || '-',
        ]),
        theme: 'grid',
        styles: { fontSize: 9 },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 10;
    }

    // Tableau des marques
    if (report.trademarks.length > 0) {
      doc.setFontSize(14);
      doc.text('Marques déposées:', 14, yPosition);
      yPosition += 6;

      autoTable(doc, {
        startY: yPosition,
        head: [['Pays/Office', 'Statut']],
        body: report.trademarks.map((t) => [
          `${t.country} (${t.office})`,
          t.status === 'available' ? 'Disponible' : 'Existe',
        ]),
        theme: 'grid',
        styles: { fontSize: 9 },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 10;
    }

    // Tableau des réseaux sociaux
    if (report.socialMedia.length > 0) {
      doc.setFontSize(14);
      doc.text('Réseaux sociaux:', 14, yPosition);
      yPosition += 6;

      autoTable(doc, {
        startY: yPosition,
        head: [['Plateforme', 'Statut']],
        body: report.socialMedia.map((s) => [
          s.platform,
          s.status === 'available' ? 'Disponible' : 'Pris',
        ]),
        theme: 'grid',
        styles: { fontSize: 9 },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 10;
    }

    // Tableau des App Stores
    if (report.appStores.length > 0) {
      doc.setFontSize(14);
      doc.text('App Stores:', 14, yPosition);
      yPosition += 6;

      autoTable(doc, {
        startY: yPosition,
        head: [['Store', 'Statut']],
        body: report.appStores.map((a) => [
          a.store === 'ios' ? 'Apple App Store' : 'Google Play Store',
          a.status === 'available' ? 'Disponible' : 'Pris',
        ]),
        theme: 'grid',
        styles: { fontSize: 9 },
      });
    }
  });

  // Sauvegarde du PDF
  doc.save(`nomistry-rapport-${Date.now()}.pdf`);
}
