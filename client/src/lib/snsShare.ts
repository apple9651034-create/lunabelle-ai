/**
 * SNS 공유 유틸리티
 * 상담 내역을 카카오톡, 인스타그램 등으로 공유
 */

export interface ShareContent {
  title: string;
  description: string;
  imageUrl?: string;
  url?: string;
}

/**
 * 카카오톡 공유
 */
export async function shareToKakaoTalk(content: ShareContent) {
  // 카카오 SDK 로드 확인
  if (!window.Kakao) {
    console.error('Kakao SDK not loaded');
    return;
  }

  // 카카오 SDK 초기화 (필요시)
  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(process.env.VITE_KAKAO_APP_ID || '');
  }

  try {
    window.Kakao.Link.sendDefault({
      objectType: 'feed',
      content: {
        title: content.title,
        description: content.description,
        imageUrl: content.imageUrl || 'https://ai-luna.manus.space/logo.png',
        link: {
          mobileWebUrl: content.url || window.location.href,
          webUrl: content.url || window.location.href,
        },
      },
      buttons: [
        {
          title: '보러 가기',
          link: {
            mobileWebUrl: content.url || window.location.href,
            webUrl: content.url || window.location.href,
          },
        },
      ],
    });
  } catch (error) {
    console.error('카카오톡 공유 실패:', error);
    alert('카카오톡 공유에 실패했습니다.');
  }
}

/**
 * 인스타그램 스레드 공유 (웹 링크로 유도)
 */
export async function shareToInstagramThread(content: ShareContent) {
  const text = `${content.title}\n\n${content.description}`;
  const encodedText = encodeURIComponent(text);
  const url = `https://instagram.com/`;
  
  // 인스타그램은 웹에서 직접 공유 불가능하므로 앱 열기 또는 링크 복사
  try {
    // 클립보드에 복사
    await navigator.clipboard.writeText(text);
    alert('내용이 클립보드에 복사되었습니다. 인스타그램 스레드에 붙여넣기 해주세요.');
  } catch (error) {
    console.error('클립보드 복사 실패:', error);
    alert('내용 복사에 실패했습니다.');
  }
}

/**
 * 일반 텍스트 공유 (클립보드)
 */
export async function shareToClipboard(content: string) {
  try {
    await navigator.clipboard.writeText(content);
    alert('클립보드에 복사되었습니다!');
  } catch (error) {
    console.error('클립보드 복사 실패:', error);
    alert('복사에 실패했습니다.');
  }
}

/**
 * 웹 공유 API (모바일 환경)
 */
export async function shareViaWebShare(content: ShareContent) {
  if (!navigator.share) {
    console.warn('Web Share API not supported');
    return false;
  }

  try {
    await navigator.share({
      title: content.title,
      text: content.description,
      url: content.url || window.location.href,
    });
    return true;
  } catch (error) {
    console.error('Web Share 실패:', error);
    return false;
  }
}

/**
 * 상담 내용을 텍스트로 포맷팅
 */
export function formatConsultationForShare(consultationType: string, messages: any[]): string {
  const timestamp = new Date().toLocaleString('ko-KR');
  let text = `🌙 AI 루나 ${consultationType} 상담 기록\n`;
  text += `📅 ${timestamp}\n`;
  text += `${'='.repeat(40)}\n\n`;

  messages.forEach((msg) => {
    if (msg.role === 'user') {
      text += `👤 나: ${msg.content}\n\n`;
    } else {
      text += `🌙 루나: ${msg.content}\n\n`;
    }
  });

  text += `${'='.repeat(40)}\n`;
  text += `✨ AI 루나 - 운명 예측 채팅\n`;
  text += `https://ai-luna.manus.space`;

  return text;
}
