/* 대화 내역 다운로드 유틸리티
 * 텍스트 및 이미지 형식으로 대화 내역 저장
 */

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export function downloadChatAsText(messages: ChatMessage[], filename: string = 'chat_history.txt') {
  const content = messages
    .map((msg, idx) => {
      const role = msg.role === 'user' ? '👤 당신' : '✨ AI 루나';
      const timestamp = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString('ko-KR') : '';
      return `[${idx + 1}] ${role} ${timestamp}\n${msg.content}\n`;
    })
    .join('\n' + '='.repeat(50) + '\n\n');

  const header = `AI 루나 상담 기록\n생성일: ${new Date().toLocaleString('ko-KR')}\n총 메시지: ${messages.length}개\n\n${'='.repeat(50)}\n\n`;

  const fullContent = header + content;

  const blob = new Blob([fullContent], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

export async function downloadChatAsImage(
  messages: ChatMessage[],
  filename: string = 'chat_history.png'
) {
  // 동적으로 html2canvas 임포트
  const html2canvas = (await import('html2canvas')).default;

  // 임시 컨테이너 생성
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    left: -9999px;
    top: -9999px;
    width: 1200px;
    background: oklch(0.12 0.03 270);
    padding: 40px;
    font-family: 'Noto Serif KR', serif;
    color: oklch(0.94 0.015 90);
  `;

  // 헤더
  const header = document.createElement('div');
  header.style.cssText = `
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 2px solid oklch(0.78 0.15 85);
  `;
  header.innerHTML = `
    <h1 style="font-size: 28px; margin: 0 0 10px 0; color: oklch(0.78 0.15 85);">✨ AI 루나 상담 기록</h1>
    <p style="margin: 0; font-size: 14px; color: oklch(0.60 0.02 290);">생성일: ${new Date().toLocaleString('ko-KR')}</p>
    <p style="margin: 5px 0 0 0; font-size: 14px; color: oklch(0.60 0.02 290);">총 메시지: ${messages.length}개</p>
  `;

  // 메시지
  const messagesContainer = document.createElement('div');
  messagesContainer.style.cssText = 'line-height: 1.8;';

  messages.forEach((msg, idx) => {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
      margin-bottom: 20px;
      padding: 15px;
      border-radius: 10px;
      background: ${msg.role === 'user' ? 'oklch(0.50 0.28 290 / 20%)' : 'oklch(0.17 0.04 270)'};
      border-left: 4px solid ${msg.role === 'user' ? 'oklch(0.50 0.28 290)' : 'oklch(0.78 0.15 85)'};
    `;

    const role = msg.role === 'user' ? '👤 당신' : '✨ AI 루나';
    const timestamp = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString('ko-KR') : '';

    messageDiv.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 8px; color: ${msg.role === 'user' ? 'oklch(0.50 0.28 290)' : 'oklch(0.78 0.15 85)'};">
        [${idx + 1}] ${role} ${timestamp}
      </div>
      <div style="white-space: pre-wrap; word-break: break-word; color: oklch(0.85 0.015 90);">
        ${msg.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
      </div>
    `;

    messagesContainer.appendChild(messageDiv);
  });

  container.appendChild(header);
  container.appendChild(messagesContainer);
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      backgroundColor: 'oklch(0.12 0.03 270)',
      scale: 2,
      logging: false,
      useCORS: true,
    });

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = filename;
    link.click();
  } finally {
    document.body.removeChild(container);
  }
}

export function downloadChatAsJSON(messages: ChatMessage[], filename: string = 'chat_history.json') {
  const data = {
    exportDate: new Date().toISOString(),
    totalMessages: messages.length,
    messages: messages.map(msg => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp?.toISOString(),
    })),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
