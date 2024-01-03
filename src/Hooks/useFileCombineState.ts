import { useRef, useState } from "preact/hooks";
import { UniqueURL } from "../PDFUtil/UniqueURL";
import { PDFMerger } from "../PDFUtil/PDFMerger";

export function useFileCombineState()
{
    const [fileList, setFileList] = useState<File[]>([]);
    const [merging, setMerging] = useState<boolean>(false);
    const [shouldDownloadFile, setShouldDownloadFile] = useState<boolean>(false);

    const uniqueURL = useRef<UniqueURL>(new UniqueURL());
    const [downloadURL, setDownloadURL] = useState<string|undefined>(undefined);

    const fnMergeFiles = async () => {
        setMerging(true);

        PDFMerger
            .MergeFiles(fileList)
            .then(buffer => {
                uniqueURL.current.SetPDFURL(buffer);
                setDownloadURL(uniqueURL.current.GetURL());
                setShouldDownloadFile(true);
            })
            .finally(()=> setMerging(false));
    };

    const fnClearFileList = () => {
        setFileList([]);
        uniqueURL.current.Release();
        setDownloadURL(undefined);
    };

    const fnFileDownloaded = () => {
        setShouldDownloadFile(false);
    }
    
    return {
        fileList, setFileList,
        merging,
        downloadURL,
        shouldDownloadFile,

        fnMergeFiles,
        fnClearFileList,
        fnFileDownloaded
    }
}