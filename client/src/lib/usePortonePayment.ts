declare global {
  interface Window {
    IMP?: {
      init: (impCode: string) => void;
      request_pay: (params: Record<string, unknown>, callback: (rsp: ImpResponse) => void) => void;
    };
  }
}

interface ImpResponse {
  success: boolean;
  error_code?: string;
  error_msg?: string;
  imp_uid?: string;
  merchant_uid?: string;
  paid_amount?: number;
  status?: string;
}

interface PaymentParams {
  merchantUid: string;
  name: string;
  amount: number;
  buyerName?: string;
  buyerEmail?: string;
}

export function usePortonePayment() {
  const storeId = import.meta.env.VITE_PORTONE_STORE_ID as string | undefined;
  const channelKey = import.meta.env.VITE_PORTONE_CHANNEL_KEY as string | undefined;

  const requestPayment = (
    params: PaymentParams,
    onSuccess: (impUid: string, merchantUid: string, amount: number) => void,
    onFail?: (errorMsg: string) => void
  ) => {
    if (!storeId || !channelKey) {
      alert("결제 시스템이 준비 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    if (!window.IMP) {
      alert("결제 모듈을 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    window.IMP.init(storeId);

    window.IMP.request_pay(
      {
        pg: `html5_inicis.${channelKey}`,
        pay_method: "card",
        merchant_uid: params.merchantUid,
        name: params.name,
        amount: params.amount,
        buyer_name: params.buyerName || "AI루나 사용자",
        buyer_email: params.buyerEmail || "",
        buyer_tel: "010-0000-0000",
      },
      (rsp: ImpResponse) => {
        if (rsp.success && rsp.imp_uid && rsp.merchant_uid) {
          onSuccess(rsp.imp_uid, rsp.merchant_uid, rsp.paid_amount || params.amount);
        } else {
          const msg = rsp.error_msg || "결제에 실패했습니다.";
          onFail ? onFail(msg) : alert(msg);
        }
      }
    );
  };

  return { requestPayment, isReady: !!(storeId && channelKey) };
}
