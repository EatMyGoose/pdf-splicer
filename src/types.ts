export type TTab = "merge" | "extract";

export type TFilename = string;
export type TUrl = string;

export interface IFileUrl
{
    filename: TFilename,
    url: TUrl,
}