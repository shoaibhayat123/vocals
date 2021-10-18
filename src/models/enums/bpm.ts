export enum bpmTypes {
low= "low",
medium= "medium",
high= "high" 
};
export const bpmValues = Object.keys(bpmTypes).map((k: any) => bpmTypes[k]);
