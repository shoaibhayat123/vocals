export enum PaymentMethodStatus {
    CC = 'credit_card',
    CD = 'cash_on_delivery'
};
export const PaymentMethodStatusValues = Object.keys(PaymentMethodStatus).map((k: any) => PaymentMethodStatus[k]);
