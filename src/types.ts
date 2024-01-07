export type TTab = "merge" | "extract";

export type TFilename = string;
export type TUrl = string;

export interface IFileUrl
{
    filename: TFilename,
    url: TUrl,
}

export function IsTTab(value: string)
{
    return value == "merge" || value == "extract";
}