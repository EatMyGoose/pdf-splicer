export class UniqueURL
{
    private objectUrl: string | undefined = undefined;

    SetPDFURL(arr: Uint8Array): string
    {
        this.Release();
        const blob = new Blob([arr], {type: "application/pdf"});
        const url = URL.createObjectURL(blob);
        this.objectUrl = url;
        return url;
    }

    SetFile(file: File) : string
    {
        this.Release();
        const url = URL.createObjectURL(file);
        this.objectUrl = url;
        return url;
    }

    GetURL()
    {
        return this.objectUrl;
    }

    Release()
    {
        if(this.objectUrl === undefined) return;

        URL.revokeObjectURL(this.objectUrl);
        this.objectUrl = undefined;
    }
}