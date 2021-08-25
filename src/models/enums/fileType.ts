export enum FileType {
    image = 'image',
    file = 'file',
    video = 'video',
    audio = 'audio'
};
export const FileTypeValues = Object.keys(FileType).map((k: any) => FileType[k]);
