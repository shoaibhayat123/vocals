export enum Sort {
    ASC = 'asc',
    DESC = 'desc',
    ALPHA = 'alpha'
};
export const SortValues = Object.keys(Sort).map((k: any) => Sort[k]);
