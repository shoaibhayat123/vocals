export enum moodTypes {
    bouncy = 'bouncy',
    dark = 'dark',
    energetic = 'energetic',    
};
export const moodValues = Object.keys(moodTypes).map((k: any) => moodTypes[k]);
