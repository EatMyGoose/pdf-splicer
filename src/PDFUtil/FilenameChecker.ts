export function HasPDFExtension(filename: string) : boolean
{
    const splits = filename.split(".").map(s => s.toLowerCase());
    const hasPdfExtension = (
        splits.length > 0 && 
        splits[splits.length - 1] === "pdf"
    );
    return hasPdfExtension;
}