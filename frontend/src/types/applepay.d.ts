// src/types/applepay.d.ts
interface ApplePaySession {
    onvalidatemerchant: (event: ApplePayValidateMerchantEvent) => void;
    onpaymentauthorized: (event: ApplePayPaymentAuthorizedEvent) => void;
    oncancel: (event: Event) => void;
  
    begin(): void;
    completeMerchantValidation(merchantSession: any): void;
    completePayment(status: number): void;
  }
  
  interface ApplePaySessionConstructor {
    new (version: number, paymentRequest: ApplePayPaymentRequest): ApplePaySession;
    canMakePayments(): Promise<boolean>;
    readonly STATUS_SUCCESS: number;
    readonly STATUS_FAILURE: number;
  }
  
  declare var ApplePaySession: ApplePaySessionConstructor;
  
  interface ApplePayPaymentRequest {
    countryCode: string;
    currencyCode: string;
    total: ApplePayLineItem;
    supportedNetworks: string[];
    merchantCapabilities: string[];
  }
  
  interface ApplePayLineItem {
    label: string;
    amount: string;
  }
  
  interface ApplePayValidateMerchantEvent extends Event {
    validationURL: string;
  }
  
  interface ApplePayPaymentAuthorizedEvent extends Event {
    payment: {
      token: any;
    };
  }
  