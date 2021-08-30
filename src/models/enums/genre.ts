export enum genreTypes {
    hiphop = 'hiphop',
    pop = 'pop',
    trap = 'trap',    
};
export const genreValues = Object.keys(genreTypes).map((k: any) => genreTypes[k]);
