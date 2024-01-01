import { PDFDocument } from "pdf-lib";

export class PDFMerger
{
    static async MergeFiles(files: File[]) : Promise<Uint8Array>
    {
        const loadedPDFs_future = files.map(file => 
            file
                .arrayBuffer()
                .then(buffer => PDFDocument.load(buffer))
        );
        
        const loadedPDFs = await Promise.all(loadedPDFs_future);
        
        const mergedPDF = await PDFDocument.create();

        const pagesToCopy_future = loadedPDFs.map(pdf => mergedPDF.copyPages(pdf, pdf.getPageIndices()));

        const pagesToCopy = await Promise.all(pagesToCopy_future);

        for(const pageList of pagesToCopy)
        {
            pageList.forEach(page => mergedPDF.addPage(page));
        }

        const mergedBuffer = await mergedPDF.save();

        return mergedBuffer;
    }
}
