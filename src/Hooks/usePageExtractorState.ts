import { useRef, useState } from "preact/hooks";
import { IFileUrl } from "../types";
import { PDFDocument } from "pdf-lib";
import { UniqueURL } from "../PDFUtil/UniqueURL";
import { PDFPageExtractor } from "../PDFUtil/PDFPageExtractor";

export function usePageExtractorState()
{
    const [filter, setFilter] = useState<string>("");
    const [previewSize, setPreviewSize] = useState<string>("Default");

    const [src, setSrc] = useState<File | undefined>(undefined);
    const nSrcPages = useRef<number>(0);

    const [srcURL, setSrcURL] = useState<IFileUrl | undefined>(undefined);
    const [loadingSrc, setLoadingSrc] = useState<boolean>(false);
    const [creatingExtract, setCreatingExtract] = useState<boolean>(false);

    const [extractedURL, setExtractedURL] = useState<IFileUrl | undefined>(undefined);

    const [shouldDownload, setShouldDownload] = useState<boolean>(false);

    const srcPDFDocRef = useRef<PDFDocument | undefined>(undefined);

    const srcFileURL = useRef(new UniqueURL());
    const extractedFileURL = useRef(new UniqueURL());

    function _ClearExtractedPages()
    {
        setExtractedURL(undefined);
        extractedFileURL.current.Release();
    }

    function fnOnFileDownloaded()
    {
        setShouldDownload(false);
    }

    const fnHandleSrcChanged = async (newTarget: File | undefined) => {
        if(newTarget === undefined)
        {
            //Clear extracted file
            _ClearExtractedPages();
            
            //clear source PDF
            srcFileURL.current.Release();
            setSrc(undefined);
            srcPDFDocRef.current = undefined;
            nSrcPages.current = 0;
            setSrcURL(undefined);
        }
        else
        {
            setLoadingSrc(true);
          
            const newDoc = await PDFPageExtractor.Load(newTarget);
            
            _ClearExtractedPages();
            
            srcFileURL.current.SetFile(newTarget);
            setSrc(newTarget);  
            srcPDFDocRef.current = newDoc;
            nSrcPages.current = newDoc.getPageCount();
            setSrcURL({
                filename: newTarget.name,
                url: srcFileURL.current.GetURL() as string
            })

            setLoadingSrc(false);
        }
    };

    const fnBeginPageExtraction = async (pageIndices: number[]) => {
        if(!srcPDFDocRef.current) 
        {
            console.error(`source doc missing`);
            return;
        }

        setCreatingExtract(true);
        
        const extractedBuffer: Uint8Array = await PDFPageExtractor.Extract(
            srcPDFDocRef.current, 
            pageIndices
        );

        extractedFileURL.current.SetPDFURL(extractedBuffer);

        setExtractedURL({
            filename: `extracted_${src?.name || ""}`,
            url: extractedFileURL.current.GetURL() as string,
        })

        //Signal that the file should be auto-downloaded
        setShouldDownload(true);

        setCreatingExtract(false);
    }

    return {
        filter, setFilter,
        previewSize, setPreviewSize,
        src, setSrc,
        nPages: nSrcPages.current,

        srcURL,
        extractedURL,

        loadingSrc,
        creatingExtract,

        shouldDownload,

        fnOnFileDownloaded,
        fnHandleSrcChanged,
        fnBeginPageExtraction,
    }
}