export enum promocodeTypes {
    Percentage = 'percentage',
    Amount = 'amount',


};
export const promocodeValues = Object.keys(promocodeTypes).map((k: any) => promocodeTypes[k]);
