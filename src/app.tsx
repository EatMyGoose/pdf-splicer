import styles from "./app.module.css"
import util from "./util.module.css"
import "picnic";

import { useMemo, useRef, useState } from 'preact/hooks';
import { AppHeader } from './Components/Header'

import { TReducer } from './TReducer';
import { PDFMerger } from './PDFUtil/PDFMerger';
import { UniqueURL } from "./PDFUtil/UniqueURL";
import { IFileUrl,  TTab } from "./types";
import { AppTabBody } from "./Components/AppTabBody";
import { PDFDocument } from "pdf-lib";
import { PDFPageExtractor } from "./PDFUtil/PDFPageExtractor";

export function App() {
  const [activeTab, setActiveTab] = useState<TTab>("merge");

  /*--File Combiner--*/
  const [fileList, setFileList] = useState<File[]>([]);
  const [merging, setMerging] = useState<boolean>(false);
  const [downloadURL, setDownloadURL] = useState<string|undefined>(undefined);
  const [downloadMergedFile, setDownloadMergedFile] = useState<boolean>(false);

  const uniqueURL = useMemo(() => new UniqueURL(), []);

  /*--Page Extractor--*/
  const [filter, setFilter] = useState<string>("");
  const [extractPreviewSize, setExtractPreviewSize] = useState<string>("Default");

  const [extractSrc, setExtractSrc] = useState<File | undefined>(undefined);
  const [extractSrcPages, setExtractSrcPages] = useState<number>(0);
    
  const [extractedFile, setExtractedFile] = useState<IFileUrl | undefined>(undefined);
  const [extractLoading, setExtractLoading] = useState<boolean>(false);
  const [extracting, setExtracting] = useState<boolean>(false);

  const [downloadExtractedFile, setDownloadExtractedFile] = useState<boolean>(false);

  const extractSrcRef = useRef<PDFDocument | undefined>(undefined);
  const extractSrcUrl = useMemo(() => new UniqueURL(), []);
  const extractedPagesUrl = useMemo(() => new UniqueURL(), []);

  /*--*/
  function handleFileAdded(reducerFunc: TReducer<File[]>)
  {
    setFileList(reducerFunc);
  }

  function handleClearAll()
  {
    setDownloadURL(undefined);
    uniqueURL.Release();
  }

  async function mergeFiles()
  {
    setMerging(true);
    PDFMerger
      .MergeFiles(fileList)
      .then(buffer => {
        uniqueURL.SetPDFURL(buffer);
        setDownloadURL(uniqueURL.GetURL());
        setDownloadMergedFile(true);
      })
      .finally(() => setMerging(false));
  } 

  function handleSplitTargetChanged(newTarget: File | undefined) : void
  {
    const async_impl = async () => {

        if(newTarget === undefined)
        {
          setExtractedFile(undefined);
          extractedPagesUrl.Release();

          extractSrcUrl.Release();
          setExtractSrc(undefined);  
          extractSrcRef.current = undefined;
          setExtractSrcPages(0);
        }
        else
        {
          setExtractLoading(true);
          
          const newDoc = await PDFPageExtractor.Load(newTarget);

          setExtractedFile(undefined);
          extractedPagesUrl.Release();

          extractSrcRef.current = newDoc;
          setExtractSrcPages(newDoc.getPageCount());
          extractSrcUrl.SetFile(newTarget);
          setExtractSrc(newTarget);  

          setExtractLoading(false);
        }
      }

      async_impl();
  } 

  function beginPageExtraction(pageIndices: number[]) : void
  {
    const async_impl = async () => {
      if(!extractSrcRef.current) 
      {
        console.error(`source doc missing`);
        return;
      }

      setExtracting(true);
      const extractedBuffer = await PDFPageExtractor.Extract(extractSrcRef.current, pageIndices);
      extractedPagesUrl.SetPDFURL(extractedBuffer);
      setExtractedFile({
        filename: "extracted",
        url: extractedPagesUrl.GetURL() as string,
      })

      setDownloadExtractedFile(true);
      setExtracting(false);
    };
    console.log("extracting");
    async_impl();
  }

  const extractURLOpt = extractSrcUrl.GetURL();
  const extractSrcFileURL: IFileUrl | undefined = (
    (extractSrc && extractURLOpt)?
    {filename: extractSrc.name, url: extractURLOpt}:
    undefined
  );

  return (
    <div className={styles.fullWidthApp}>
      <AppHeader/>
      <div className={`card ${util.container}`}>      
        <div className={`${styles.app_body}`}>

          <div className={`${styles.sidebar} ${styles.show} ${util.inner_pad}`}>
            <button onClick={() => setActiveTab("merge")}>
              Combine Files
            </button>
            <button onClick={() => setActiveTab("extract")}>
              Extract Pages
            </button>
          </div>
          <div className={`${util.inner_pad} ${util.full_width}`}>
            <AppTabBody
              activeTab={activeTab}

              onClearAll={handleClearAll}
              fileList={fileList}
              onFileListChanged={handleFileAdded}
              mergeInProgress={merging}
              onBeginPDFMerge={mergeFiles}
              downloadURL={downloadURL}
              onMergedFileDownload={() => setDownloadMergedFile(false)}
              downloadMergedFile={downloadMergedFile}

              extractSrc={extractSrcFileURL}
              extractedFile={extractedFile}
              setSplitTarget={handleSplitTargetChanged}

              onSplitFileDownload={() => setDownloadExtractedFile(false)}
              downloadSplitFile={downloadExtractedFile}

              onBeginPageExtract={beginPageExtraction}
              splitInProgress={extracting}
              nPages={extractSrcPages}
              loading={extractLoading}

              filter={filter}
              setFilter={setFilter}

              previewSize={extractPreviewSize}
              setPreviewSize={setExtractPreviewSize}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
