export enum FaqCategory {
    Subscription = 'subscription',
    Troubleshooting = 'troubleshooting',
    RoyaltyFreeMusic = 'royaltyfreemusic',
    SFXLicensing = 'sfxlicensing',
    Technical = 'technical',
    Security = 'security',


};
export const CategoryValues = Object.keys(FaqCategory).map((k: any) => FaqCategory[k]);
