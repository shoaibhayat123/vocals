export enum licenseTypes {
    free = 'free',
    basic = 'basic',
    premium = 'premium',
    premiumStem = 'premiumStem',


};
export const licenseValues = Object.keys(licenseTypes).map((k: any) => licenseTypes[k]);
