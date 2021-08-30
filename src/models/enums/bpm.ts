export enum bpmTypes {
    low = 'low',
    high = 'high',
    medium = 'medium',    
};
export const bpmValues = Object.keys(bpmTypes).map((k: any) => bpmTypes[k]);
