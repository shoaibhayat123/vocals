export enum FileType {
    image = 'image',
    file = 'file',
    video = 'video',
    taggedAudio = 'tagged audio',
    untaggedAudio = 'untagged audio'

};
export const FileTypeValues = Object.keys(FileType).map((k: any) => FileType[k]);
