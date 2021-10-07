export enum FaqCategory {
    Subscription = 'Subscription',
    Troubleshooting = 'Troubleshooting',
    RoyaltyFreeMusic = 'Royalty-Free-Music',
    SFXLicensing = 'SFX-Licensing',
    Technical = 'Technical',
    Security = 'Security',


};
export const CategoryValues = Object.keys(FaqCategory).map((k: any) => FaqCategory[k]);
