export enum Gender {
    Male = 'male',
    Female = 'female'
};
export const GenderValues = Object.keys(Gender).map((k: any) => Gender[k]);
