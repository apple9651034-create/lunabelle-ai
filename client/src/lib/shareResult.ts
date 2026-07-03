/* 사주/타로 결과 소셜 공유 유틸리티
 * 카카오톡, 인스타그램 공유 기능
 */

export interface ShareData {
  title: string;
  description: string;
  imageUrl?: string;
  url?: string;
}

// 카카오톡 공유 (Kakao SDK 필요)
export function shareToKakao(data: ShareData) {
  if (!window.Kakao) {
    alert('카카오톡 공유 기능을 사용할 수 없습니다.');
    return;
  }

  window.Kakao.Link.sendDefault({
    objectType: 'feed',
    content: {
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl || 'https://via.placeholder.com/400x300?text=AI+Luna',
      link: {
        mobileWebUrl: window.location.href,
        webUrl: window.location.href,
      },
    },
    buttons: [
      {
        title: '앱에서 보기',
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      },
    ],
  });
}

// 인스타그램 공유 (클립보드 복사 후 안내)
export function shareToInstagram(data: ShareData) {
  const text = `✨ ${data.title}\n\n${data.description}\n\n#AI루나 #운명 #사주 #타로 #점술`;
  
  // 클립보드에 복사
  navigator.clipboard.writeText(text).then(() => {
    alert('공유 텍스트가 복사되었습니다.\n인스타그램 앱을 열어 스토리나 게시물에 붙여넣기 해주세요.');
    
    // 인스타그램 앱으로 이동 시도
    const instagramUrl = 'instagram://';
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      window.location.href = instagramUrl;
    }
  }).catch(() => {
    alert('클립보드 복사에 실패했습니다. 수동으로 복사해주세요.');
  });
}

// 일반 웹 공유 (Web Share API)
export async function shareViaWebShare(data: ShareData) {
  if (!navigator.share) {
    alert('이 브라우저에서는 공유 기능을 지원하지 않습니다.');
    return;
  }

  try {
    await navigator.share({
      title: data.title,
      text: data.description,
      url: window.location.href,
    });
  } catch (err) {
    console.error('공유 실패:', err);
  }
}

// 사주 결과 공유 데이터 생성
export function generateSajuShareData(fourPillars: any, personality: string): ShareData {
  const pillars = `${fourPillars.yearString} ${fourPillars.monthString} ${fourPillars.dayString} ${fourPillars.hourString}`;
  
  return {
    title: '✨ AI 루나 사주 분석 결과',
    description: `나의 사주 명식: ${pillars}\n\n${personality.substring(0, 100)}...`,
    url: window.location.href,
  };
}

// 타로 결과 공유 데이터 생성
export function generateTarotShareData(spreadName: string, interpretation: string): ShareData {
  return {
    title: `🃏 AI 루나 타로 ${spreadName}`,
    description: `${interpretation.substring(0, 150)}...`,
    url: window.location.href,
  };
}
