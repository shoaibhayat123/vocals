export enum SearchType {
    Single = 'single',
    Multi = 'multi'
};
export const SearchTypeValues = Object.keys(SearchType).map((k: any) => SearchType[k]);
