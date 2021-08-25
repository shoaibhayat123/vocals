export enum Status {
    completed = 'completed',
    pending = 'pending',
    proceed = 'proceed',
    checkout = 'checkout',
    cancelled = 'cancelled'
};
export const StatusValues = Object.keys(Status).map((k: any) => Status[k]);

