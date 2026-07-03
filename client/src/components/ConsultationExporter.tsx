import React from 'react';
import { Download, Image, FileText } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface ConsultationExporterProps {
  consultationData: {
    type: 'saju' | 'tarot' | 'yuk';
    messages: Array<{ role: 'user' | 'assistant'; content: string }>;
    timestamp: Date;
  };
}

export function ConsultationExporter({ consultationData }: ConsultationExporterProps) {
  const exportAsImage = async () => {
    const element = document.getElementById('consultation-content');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#0a0415',
        scale: 2,
      });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `consultation-${consultationData.type}-${Date.now()}.png`;
      link.click();
    } catch (error) {
      console.error('Failed to export as image:', error);
      alert('이미지 저장에 실패했습니다.');
    }
  };

  const exportAsPDF = async () => {
    const element = document.getElementById('consultation-content');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#0a0415',
        scale: 2,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`consultation-${consultationData.type}-${Date.now()}.pdf`);
    } catch (error) {
      console.error('Failed to export as PDF:', error);
      alert('PDF 저장에 실패했습니다.');
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={exportAsImage}
        className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105"
        style={{
          background: 'oklch(0.70 0.18 60)',
          color: 'oklch(0.10 0.02 270)',
        }}
      >
        <Image size={18} />
        이미지 저장
      </button>
      <button
        onClick={exportAsPDF}
        className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105"
        style={{
          background: 'oklch(0.70 0.18 60)',
          color: 'oklch(0.10 0.02 270)',
        }}
      >
        <FileText size={18} />
        PDF 저장
      </button>
    </div>
  );
}
