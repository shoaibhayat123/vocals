export enum EnvironmentName {
    Production = 'production',
    Stage = 'stage',
    Test = 'test',
    Local = 'local',
};
export const EnvironmentNameValues = Object.keys(EnvironmentName).map((k: any) => EnvironmentName[k]);
