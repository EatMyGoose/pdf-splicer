import { PDFDocument } from "pdf-lib";

export type TPageIndices = number[];

export class PDFPageExtractor
{
    static async Load(file: File) : Promise<PDFDocument>
    {
        const doc = await (
            file
                .arrayBuffer()
                .then(buffer => PDFDocument.load(buffer, { ignoreEncryption: true }))
        );

        return doc;
    }

    private static async CopyPageRange(srcDoc: PDFDocument, pages: TPageIndices): Promise<PDFDocument>
    {
        const dest = await PDFDocument.create();
        const copiedPages = await dest.copyPages(srcDoc, pages);

        copiedPages.forEach(page => dest.addPage(page));

        return dest;
    }

    static async Extract(srcDoc: PDFDocument, pages: TPageIndices): Promise<Uint8Array>
    {
        const doc: PDFDocument = await PDFPageExtractor.CopyPageRange(srcDoc, pages);

        const buffer: Uint8Array = await doc.save();

        return buffer;
    }
}