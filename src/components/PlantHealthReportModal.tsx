import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { X, Printer, Download, AlertTriangle, CheckCircle2, Calendar, MapPin, FileText } from 'lucide-react';
import { ScanResult } from '../types';
import { ARECANUT_DISEASES } from '../data/diseases';

interface PlantHealthReportModalProps {
  scan: ScanResult;
  onClose: () => void;
  /** Real Grad-CAM data URL returned by the FastAPI backend, when available. */
  gradCamImage?: string | null;
}

export const PlantHealthReportModal: React.FC<PlantHealthReportModalProps> = ({
  scan,
  onClose,
  gradCamImage,
}) => {
  const disease =
    ARECANUT_DISEASES.find((d) => d.id === scan.diseaseId) ||
    ARECANUT_DISEASES[0];

  const [isDownloading, setIsDownloading] = useState(false);

  /**
   * Directly creates and downloads an A4 PDF in the browser.
   * No popup window and no browser print dialog are used.
   */
  const handleDownloadPdf = async () => {
    if (isDownloading) return;

    setIsDownloading(true);

    try {
      /*
       * DIRECT PDF GENERATION
       *
       * This no longer depends on browser printing or the scrollable modal.
       * jsPDF receives every report field directly and creates the pages.
       *
       * Every page gets the official report header.
       * Content is flowed automatically so nothing below the preview is lost.
       */
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const PAGE_W = 210;
      const PAGE_H = 297;
      const M = 12;
      const CONTENT_W = PAGE_W - M * 2;
      const HEADER_H = 27;
      const BODY_TOP = 44;
      const BOTTOM = 14;

      let y = BODY_TOP;

      const green = [13, 59, 36] as [number, number, number];
      const green2 = [23, 107, 58] as [number, number, number];
      const muted = [102, 115, 106] as [number, number, number];
      const dark = [23, 35, 27] as [number, number, number];
      const light = [250, 251, 248] as [number, number, number];
      const border = [215, 220, 216] as [number, number, number];
      const red = [217, 83, 79] as [number, number, number];
      const amber = [230, 162, 60] as [number, number, number];

      const safeText = (value: unknown) =>
        String(value ?? '').replace(/\s+/g, ' ').trim();

      const addHeader = () => {
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, 0, PAGE_W, HEADER_H, 'F');

        pdf.setFillColor(...green);
        pdf.roundedRect(M, 7, 12, 12, 2.5, 2.5, 'F');

        pdf.setTextColor(255, 255, 255);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(11);
        pdf.text('A', M + 4.1, 15);

        pdf.setTextColor(...green);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(16);
        pdf.text('ArecaCare AI', M + 16, 13);

        pdf.setFillColor(234, 245, 236);
        pdf.roundedRect(M + 50, 7.5, 39, 6, 1.5, 1.5, 'F');
        pdf.setTextColor(...green2);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(6.5);
        pdf.text('OFFICIAL DIAGNOSTIC REPORT', M + 52, 11.4);

        pdf.setTextColor(...muted);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(7.3);
        pdf.text(
          'AI-Based Arecanut Plant Disease Detection & Smart Farm Advisory System',
          M + 16,
          18
        );
        pdf.setFontSize(7);
        pdf.text(
          'CSE Data Science Project • Precision Agricultural Pathology Framework',
          M + 16,
          22
        );

        pdf.setDrawColor(...border);
        pdf.line(151, 7, 151, 22);

        pdf.setTextColor(...green);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(7.5);
        pdf.text(`REPORT #${safeText(scan.id)}`, PAGE_W - M, 10, {
          align: 'right',
        });

        pdf.setTextColor(...muted);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(7);
        pdf.text(safeText(scan.date), PAGE_W - M, 15, {
          align: 'right',
        });
        pdf.text(safeText(scan.farmName), PAGE_W - M, 20, {
          align: 'right',
        });

        pdf.setDrawColor(...green);
        pdf.setLineWidth(0.7);
        pdf.line(M, 28, PAGE_W - M, 28);

        y = BODY_TOP;
      };

      const newPage = () => {
        pdf.addPage();
        addHeader();
      };

      const ensure = (needed: number) => {
        if (y + needed > PAGE_H - BOTTOM) {
          newPage();
        }
      };

      const wrap = (value: unknown, width: number, size = 8) => {
        pdf.setFontSize(size);
        return pdf.splitTextToSize(safeText(value), width);
      };

      const textBlock = (
        value: unknown,
        x: number,
        width: number,
        size = 8,
        color = dark,
        lineHeight = 4.2,
      ) => {
        pdf.setTextColor(...color);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(size);
        const lines = wrap(value, width, size);
        lines.forEach((line: string) => {
          ensure(lineHeight);
          pdf.text(line, x, y);
          y += lineHeight;
        });
        return lines.length * lineHeight;
      };

      const sectionTitle = (title: string) => {
        ensure(10);
        pdf.setTextColor(...green);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(9);
        pdf.text(title.toUpperCase(), M, y);
        y += 2;
        pdf.setDrawColor(...border);
        pdf.setLineWidth(0.25);
        pdf.line(M, y, PAGE_W - M, y);
        y += 5;
      };

      const labelValue = (
        label: string,
        value: string,
        x: number,
        width: number,
      ) => {
        pdf.setTextColor(...muted);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(7);
        pdf.text(label, x, y);

        const valueLines = wrap(value, width, 8);
        pdf.setTextColor(...dark);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8);

        valueLines.forEach((line: string, index: number) => {
          pdf.text(line, x, y + 4 + index * 3.8);
        });

        return Math.max(10, 5 + valueLines.length * 3.8);
      };

      const imageToDataUrl = async (srcUrl: string) => {
        if (!srcUrl) return null;

        try {
          if (srcUrl.startsWith('data:')) {
            return srcUrl;
          }

          const response = await fetch(srcUrl);
          if (!response.ok) return null;

          const blob = await response.blob();

          return await new Promise<string | null>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () =>
              resolve(
                typeof reader.result === 'string'
                  ? reader.result
                  : null
              );
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(blob);
          });
        } catch {
          return null;
        }
      };

      const drawImageCard = (
        imageData: string | null,
        title: string,
        subtitle: string,
        x: number,
        cardW: number,
        cardH: number,
      ) => {
        pdf.setFillColor(...light);
        pdf.setDrawColor(...border);
        pdf.roundedRect(x, y, cardW, cardH, 3, 3, 'FD');

        pdf.setTextColor(...dark);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(7.5);
        pdf.text(title, x + 4, y + 7);

        pdf.setTextColor(...muted);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(6);
        pdf.text(subtitle, x + cardW - 4, y + 7, {
          align: 'right',
        });

        const ix = x + 4;
        const iy = y + 11;
        const iw = cardW - 8;
        const ih = cardH - 16;

        if (imageData) {
          try {
            pdf.addImage(
              imageData,
              'JPEG',
              ix,
              iy,
              iw,
              ih,
              undefined,
              'FAST'
            );
          } catch {
            pdf.setFillColor(245, 247, 245);
            pdf.rect(ix, iy, iw, ih, 'F');
          }
        } else {
          pdf.setFillColor(245, 247, 245);
          pdf.roundedRect(ix, iy, iw, ih, 2, 2, 'F');

          pdf.setTextColor(...green);
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(8);
          pdf.text(
            'Grad-CAM image not attached',
            x + cardW / 2,
            iy + ih / 2 - 2,
            { align: 'center' }
          );

          pdf.setTextColor(...muted);
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(6.5);
          const msg = pdf.splitTextToSize(
            'The scan result contains the AI prediction, but no rendered Grad-CAM image was stored with this report.',
            iw - 10
          );
          pdf.text(
            msg,
            x + cardW / 2,
            iy + ih / 2 + 4,
            { align: 'center' }
          );
        }
      };

      const diseaseName = safeText(scan.diseaseName);
      const scientific = safeText(disease.scientificName);
      const rawKannada = String(disease.kannadaName ?? '');
      const kannada =
        /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(rawKannada)
          ? ''
          : rawKannada;

      const originalImage = await imageToDataUrl(
        safeText(scan.imageUrl)
      );

      const gradcamImage = await imageToDataUrl(
        safeText(gradCamImage || '')
      );

      addHeader();

      // FARM / SPECIMEN INFORMATION
      ensure(29);
      pdf.setFillColor(...light);
      pdf.setDrawColor(...border);
      pdf.roundedRect(M, y, CONTENT_W, 27, 4, 4, 'FD');

      const colW = CONTENT_W / 4;
      const metaY = y + 7;

      const metaHeight1 = labelValue(
        'Farm / Location:',
        `${safeText(scan.farmName)} ${safeText(scan.plotLocation)}`,
        M + 5,
        colW - 10
      );

      const metaHeight2 = labelValue(
        'Plant Organ Scanned:',
        `${safeText(scan.plantPart)} Specimen • 224x224 RGB Sensor`,
        M + colW + 5,
        colW - 10
      );

      const metaHeight3 = labelValue(
        'Ambient Weather:',
        `${safeText(scan.weatherSnapshot.temp)}°C, ${safeText(scan.weatherSnapshot.humidity)}% RH ${safeText(scan.weatherSnapshot.condition)}`,
        M + colW * 2 + 5,
        colW - 10
      );

      const metaHeight4 = labelValue(
        'Diagnosis Verification:',
        `${safeText(scan.status)} • Confidence: ${safeText(scan.confidence)}%`,
        M + colW * 3 + 5,
        colW - 10
      );

      y += Math.max(
        27,
        metaHeight1,
        metaHeight2,
        metaHeight3,
        metaHeight4
      );

      y += 7;

      // IMAGES — always two columns.
      ensure(73);
      const imageGap = 5;
      const imageW = (CONTENT_W - imageGap) / 2;
      const imageH = 66;

      drawImageCard(
        originalImage,
        'Original Field Sample',
        'High-Resolution Input',
        M,
        imageW,
        imageH
      );

      drawImageCard(
        gradcamImage,
        'MobileNetV2 Attention Map (Grad-CAM)',
        'MobileNetV2 • Grad-CAM',
        M + imageW + imageGap,
        imageW,
        imageH
      );

      y += imageH + 5;

      if (!gradcamImage) {
        textBlock(
          'Grad-CAM visualizes model attention. It does not independently confirm a disease or pathogen.',
          M,
          CONTENT_W,
          6.5,
          muted,
          3.5
        );
      }

      y += 3;

      // DIAGNOSIS
      ensure(28);
      pdf.setFillColor(
        ...(scan.status === 'Healthy'
          ? ([234, 245, 236] as [number, number, number])
          : ([254, 242, 242] as [number, number, number]))
      );
      pdf.setDrawColor(
        ...(scan.status === 'Healthy'
          ? ([23, 107, 58] as [number, number, number])
          : ([240, 190, 190] as [number, number, number]))
      );
      pdf.roundedRect(M, y, CONTENT_W, 24, 4, 4, 'FD');

      pdf.setTextColor(...muted);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(6.5);
      pdf.text('AI PATHOLOGICAL CLASSIFICATION', M + 5, y + 6);

      pdf.setTextColor(...dark);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text(diseaseName, M + 5, y + 13);

      pdf.setTextColor(...muted);
      pdf.setFont('helvetica', 'italic');
      pdf.setFontSize(6.8);
      pdf.text(
        kannada
          ? `${scientific} • ${kannada}`
          : scientific,
        M + 5,
        y + 18
      );

      pdf.setTextColor(...muted);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(6.5);
      pdf.text('AI Confidence', PAGE_W - M - 42, y + 7);

      pdf.setTextColor(...green2);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(13);
      pdf.text(
        `${safeText(scan.confidence)}%`,
        PAGE_W - M - 5,
        y + 14,
        { align: 'right' }
      );

      const severityColor =
        scan.severity === 'High'
          ? red
          : scan.severity === 'Medium'
          ? amber
          : green2;

      pdf.setFillColor(...severityColor);
      pdf.roundedRect(
        PAGE_W - M - 42,
        y + 17,
        37,
        5,
        1.5,
        1.5,
        'F'
      );
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(6);
      pdf.text(
        `${safeText(scan.severity)} Severity`,
        PAGE_W - M - 23.5,
        y + 20.5,
        { align: 'center' }
      );

      y += 31;

      // PATHOLOGY
      sectionTitle('Pathology & Observed Symptoms');

      textBlock(
        disease.description,
        M,
        CONTENT_W,
        7.5,
        dark,
        4
      );

      y += 2;

      for (const symptom of disease.symptoms) {
        const lines = wrap(symptom, CONTENT_W - 9, 7.2);
        ensure(lines.length * 4 + 5);

        pdf.setFillColor(...light);
        pdf.setDrawColor(...border);
        const boxH = Math.max(8, lines.length * 4 + 4);
        pdf.roundedRect(M, y - 3, CONTENT_W, boxH, 2, 2, 'FD');

        pdf.setFillColor(...green2);
        pdf.circle(M + 4, y + 1, 0.8, 'F');

        pdf.setTextColor(...dark);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(7.2);
        pdf.text(lines, M + 8, y + 2);

        y += boxH + 2;
      }

      // TREATMENT
      sectionTitle(
        'Recommended Agricultural Next Steps & Treatment Schedule'
      );

      for (const treatment of disease.treatments) {
        const title = safeText(treatment.title);
        const timing = safeText(treatment.timing);
        const dosage = treatment.dosage
          ? `Dosage: ${safeText(treatment.dosage)}`
          : '';
        const description = safeText(treatment.description);

        const titleLines = wrap(title, CONTENT_W - 48, 7.5);
        const descLines = wrap(description, CONTENT_W - 10, 7);
        const dosageLines = dosage
          ? wrap(dosage, CONTENT_W - 10, 7)
          : [];

        const cardH =
          7 +
          titleLines.length * 4 +
          (dosageLines.length ? dosageLines.length * 4 + 3 : 0) +
          descLines.length * 4 +
          6;

        ensure(cardH + 3);

        pdf.setFillColor(255, 255, 255);
        pdf.setDrawColor(...border);
        pdf.roundedRect(M, y, CONTENT_W, cardH, 3, 3, 'FD');

        pdf.setFillColor(234, 245, 236);
        pdf.roundedRect(M + 4, y + 4, 27, 5, 1.2, 1.2, 'F');

        pdf.setTextColor(...green2);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(5.8);
        pdf.text(
          safeText(treatment.type || 'Treatment'),
          M + 17.5,
          y + 7.3,
          { align: 'center' }
        );

        pdf.setTextColor(...dark);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(7.5);
        pdf.text(
          titleLines,
          M + 35,
          y + 8
        );

        pdf.setTextColor(...amber);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(6.5);
        pdf.text(
          timing,
          PAGE_W - M - 4,
          y + 8,
          { align: 'right' }
        );

        let cardY = y + 8 + titleLines.length * 4;

        if (dosageLines.length) {
          pdf.setFillColor(...light);
          const dH = dosageLines.length * 4 + 3;
          pdf.roundedRect(M + 4, cardY, CONTENT_W - 8, dH, 1.5, 1.5, 'F');

          pdf.setTextColor(...green2);
          pdf.setFont('courier', 'bold');
          pdf.setFontSize(6.5);
          pdf.text(dosageLines, M + 6, cardY + 4);

          cardY += dH + 2;
        }

        pdf.setTextColor(...muted);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(7);
        pdf.text(descLines, M + 4, cardY + 3);

        y += cardH + 4;
      }

      // CPCRI
      ensure(19);
      pdf.setFillColor(...light);
      pdf.setDrawColor(...border);
      const refLines = wrap(
        disease.cpcriReference,
        CONTENT_W - 10,
        7
      );
      const refH = 11 + refLines.length * 4;

      pdf.roundedRect(M, y, CONTENT_W, refH, 3, 3, 'FD');

      pdf.setTextColor(...green);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(7);
      pdf.text(
        'ICAR-CPCRI Standard Reference:',
        M + 5,
        y + 7
      );

      pdf.setTextColor(...muted);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7);
      pdf.text(
        refLines,
        M + 5,
        y + 12
      );

      y += refH + 7;

      // DISCLAIMER + SIGN-OFF
      ensure(28);

      pdf.setDrawColor(...border);
      pdf.line(M, y, PAGE_W - M, y);
      y += 6;

      const disclaimer =
        'This report is generated by ArecaCare AI (MobileNetV2 Vision Model). AI outputs are preliminary and should be verified with an agricultural extension officer before heavy chemical interventions.';

      pdf.setTextColor(...muted);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(6.8);
      pdf.text(
        [
          'Disclaimer:',
          ...pdf.splitTextToSize(disclaimer, CONTENT_W * 0.68),
        ],
        M,
        y
      );

      pdf.setTextColor(150, 155, 150);
      pdf.setFont('courier', 'normal');
      pdf.setFontSize(5.8);
      pdf.text(
        'Generated via ArecaCare AI • MobileNetV2 • CSE Data Science Capstone System',
        M,
        y + 15
      );

      pdf.setDrawColor(150, 155, 150);
      pdf.setLineDashPattern([1.5, 1.5], 0);
      pdf.line(
        PAGE_W - M - 43,
        y + 9,
        PAGE_W - M,
        y + 9
      );
      pdf.setLineDashPattern([], 0);

      pdf.setTextColor(...green);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(7);
      pdf.text(
        'Agronomist / Officer Sign-off',
        PAGE_W - M,
        y + 15,
        { align: 'right' }
      );

      pdf.setTextColor(...muted);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(6.2);
      pdf.text(
        'District Agricultural Extension',
        PAGE_W - M,
        y + 20,
        { align: 'right' }
      );

      pdf.save(`ArecaCare_AI_Report_${safeText(scan.id)}.pdf`);
    } catch (error) {
      console.error('Direct PDF generation failed:', error);
      window.alert(
        'Could not generate the PDF. Please check that the report images are loaded and try again.'
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Top Action Bar (hidden on print) */}
        <div className="no-print bg-[#0D3B24] text-white px-6 py-4 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-[#176B3A] rounded-lg">
              <FileText className="w-5 h-5 text-[#EAF5EC]" />
            </span>
            <div>
              <h3 className="font-semibold text-base sm:text-lg">ArecaCare AI — Plant Health Diagnostic Report</h3>
              <p className="text-xs text-[#EAF5EC]/70">Reference ID: {scan.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadPdf}
                disabled={isDownloading}
                className="flex items-center gap-2 bg-[#176B3A] hover:bg-[#12532d] disabled:opacity-60 disabled:cursor-wait text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isDownloading ? 'Preparing…' : 'Save PDF'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Report Container */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6 bg-white" id="printable-health-report">
          {/* Official Letterhead */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-[#0D3B24]">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#0D3B24] flex items-center justify-center text-white font-bold text-xl">
                🌴
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-extrabold text-[#0D3B24] tracking-tight">ArecaCare AI</h1>
                  <span className="text-[10px] font-mono uppercase bg-[#EAF5EC] text-[#176B3A] px-2 py-0.5 rounded font-bold border border-[#176B3A]/20">
                    Official Diagnostic Report
                  </span>
                </div>
                <p className="text-xs text-[#66736A]">
                  AI-Based Arecanut Plant Disease Detection & Smart Farm Advisory System
                </p>
                <p className="text-[11px] text-[#66736A]">
                  CSE Data Science Project • Precision Agricultural Pathology Framework
                </p>
              </div>
            </div>

            <div className="text-right sm:border-l sm:pl-6 border-gray-200">
              <div className="text-xs font-mono font-semibold text-[#0D3B24]">REPORT #{scan.id}</div>
              <div className="text-xs text-[#66736A] flex items-center gap-1 sm:justify-end mt-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{scan.date}</span>
              </div>
              <div className="text-xs text-[#66736A] flex items-center gap-1 sm:justify-end mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{scan.farmName}</span>
              </div>
            </div>
          </div>

          {/* Farm & Plant Specimen Meta Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAFBF8] p-4 rounded-xl border border-gray-200 text-xs">
            <div>
              <span className="text-[#66736A] block">Farm / Location:</span>
              <span className="font-semibold text-[#17231B]">{scan.farmName}</span>
              <span className="text-[11px] text-[#66736A] block">{scan.plotLocation}</span>
            </div>
            <div>
              <span className="text-[#66736A] block">Plant Organ Scanned:</span>
              <span className="font-semibold text-[#17231B] capitalize">{scan.plantPart} Specimen</span>
              <span className="text-[11px] text-[#66736A] block">224x224 RGB Sensor</span>
            </div>
            <div>
              <span className="text-[#66736A] block">Ambient Weather:</span>
              <span className="font-semibold text-[#17231B]">{scan.weatherSnapshot.temp}°C, {scan.weatherSnapshot.humidity}% RH</span>
              <span className="text-[11px] text-[#66736A] block">{scan.weatherSnapshot.condition}</span>
            </div>
            <div>
              <span className="text-[#66736A] block">Diagnosis Verification:</span>
              <span className={`font-semibold inline-flex items-center gap-1 ${
                scan.status === 'Healthy' ? 'text-[#176B3A]' : 'text-[#D9534F]'
              }`}>
                {scan.status === 'Healthy' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                {scan.status}
              </span>
              <span className="text-[11px] text-[#66736A] block">Confidence: {scan.confidence}%</span>
            </div>
          </div>

          {/* Scanned Image & Grad-CAM Visuals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50 p-3">
              <div className="text-xs font-semibold text-[#17231B] mb-2 flex items-center justify-between">
                <span>Original Field Sample</span>
                <span className="text-[10px] font-mono text-[#66736A]">High-Resolution Input</span>
              </div>
              <div className="aspect-4/3 rounded-lg overflow-hidden bg-black/5">
                <img src={scan.imageUrl} alt="Sample scan" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50 p-3">
              <div className="text-xs font-semibold text-[#17231B] mb-2 flex items-center justify-between">
                <span>MobileNetV2 Attention Map (Grad-CAM)</span>
                <span className="text-[10px] font-mono text-[#176B3A] font-bold">
                  MobileNetV2 · Grad-CAM
                </span>
              </div>
              <div className="aspect-4/3 rounded-lg overflow-hidden relative bg-black/5">
                {gradCamImage ? (
                  <img
                    src={gradCamImage}
                    alt="MobileNetV2 Grad-CAM attention map"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-6 text-center bg-[#FAFBF8]">
                    <div>
                      <div className="font-semibold text-sm text-[#0D3B24]">
                        Grad-CAM image not attached to this saved report
                      </div>
                      <p className="text-[11px] text-[#66736A] mt-1">
                        The scan result contains the AI prediction, but no rendered
                        Grad-CAM image was stored with this report.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-[10px] text-[#66736A] mt-2">
                Grad-CAM visualizes model attention. It does not independently confirm
                a disease or pathogen.
              </p>
            </div>
          </div>

          {/* Primary Diagnosis Banner */}
          <div className={`p-4 rounded-xl border ${
            scan.status === 'Healthy' 
              ? 'bg-[#EAF5EC] border-[#176B3A]/30 text-[#0D3B24]'
              : 'bg-red-50 border-red-200 text-red-950'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-[#66736A]">
                  AI Pathological Classification
                </div>
                <h2 className="text-xl sm:text-2xl font-bold mt-0.5">
                  {scan.diseaseName}
                </h2>
                <p className="text-xs italic text-[#66736A] mt-0.5 font-mono">
                  {disease.scientificName} • {disease.kannadaName}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-[#66736A]">AI Confidence</div>
                  <div className="text-2xl font-black text-[#176B3A]">{scan.confidence}%</div>
                </div>
                <div className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  scan.severity === 'High' ? 'bg-[#D9534F] text-white' :
                  scan.severity === 'Medium' ? 'bg-[#E6A23C] text-white' : 'bg-[#176B3A] text-white'
                }`}>
                  {scan.severity} Severity
                </div>
              </div>
            </div>
          </div>

          {/* Disease Symptoms & Pathogen Info */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-[#0D3B24] uppercase tracking-wider border-b pb-1">
              Pathology & Observed Symptoms
            </h4>
            <p className="text-xs text-[#17231B] leading-relaxed">
              {disease.description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {disease.symptoms.map((symptom, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-[#FAFBF8] p-2.5 rounded-lg border border-gray-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#176B3A] mt-1.5 shrink-0" />
                  <span className="text-[#17231B]">{symptom}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step-by-Step Agronomic Advisory */}
          <div
            className="space-y-3 pdf-page-break-before"
            style={{ breakBefore: 'page', pageBreakBefore: 'always' }}
          >
            <h4 className="font-bold text-sm text-[#0D3B24] uppercase tracking-wider border-b pb-1">
              Recommended Agricultural Next Steps & Treatment Schedule
            </h4>
            <div className="space-y-2.5">
              {disease.treatments.map((treatment, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white border border-gray-200 rounded-xl space-y-1"
                  style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-xs text-[#0D3B24] flex items-center gap-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EAF5EC] text-[#176B3A]">
                        {treatment.type}
                      </span>
                      {treatment.title}
                    </span>
                    <span className="text-[11px] font-medium text-[#E6A23C]">{treatment.timing}</span>
                  </div>
                  {treatment.dosage && (
                    <div className="text-[11px] font-mono text-[#176B3A] font-semibold bg-[#FAFBF8] p-1.5 rounded border border-gray-100">
                      Dosage: {treatment.dosage}
                    </div>
                  )}
                  <p className="text-xs text-[#66736A] leading-relaxed">
                    {treatment.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Research & CPCRI Benchmark reference */}
          <div
            className="bg-[#FAFBF8] p-3 rounded-xl border border-gray-200 text-[11px] text-[#66736A] space-y-1"
            style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
          >
            <div className="font-semibold text-[#0D3B24]">ICAR-CPCRI Standard Reference:</div>
            <div>{disease.cpcriReference}</div>
          </div>

          {/* Sign-off & Verification Footer */}
          <div
            className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
            style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
          >
            <div className="space-y-1">
              <div className="text-[11px] text-[#66736A] max-w-md">
                <strong>Disclaimer:</strong> This report is generated by ArecaCare AI (MobileNetV2 Vision Model). AI outputs are preliminary and should be verified with an agricultural extension officer before heavy chemical interventions.
              </div>
              <div className="text-[10px] font-mono text-gray-400">
                Generated via ArecaCare AI • MobileNetV2 • CSE Data Science Capstone System
              </div>
            </div>

            <div className="text-right border-t sm:border-t-0 pt-2 sm:pt-0 shrink-0">
              <div className="w-32 h-10 border-b border-gray-400 border-dashed mb-1 mx-auto sm:ml-auto"></div>
              <div className="font-semibold text-[#0D3B24]">Agronomist / Officer Sign-off</div>
              <div className="text-[10px] text-[#66736A]">District Agricultural Extension</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
