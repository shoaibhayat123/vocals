"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileTypeValues = exports.FileType = void 0;
var FileType;
(function (FileType) {
    FileType["image"] = "image";
    FileType["file"] = "file";
    FileType["video"] = "video";
    FileType["taggedAudio"] = "tagged audio";
    FileType["untaggedAudio"] = "untagged audio";
})(FileType = exports.FileType || (exports.FileType = {}));
;
exports.FileTypeValues = Object.keys(FileType).map(function (k) { return FileType[k]; });
