import styles from "./app.module.css"
import util from "./util.module.css"
import "picnic";

import { useState } from 'preact/hooks';
import { AppHeader } from './Components/Header'

import { TTab } from "./types";
import { AppTabBody } from "./Components/AppTabBody";
import { useFileCombineState } from "./Hooks/useFileCombineState";
import { usePageExtractorState } from "./Hooks/usePageExtractorState";
import { cx } from "./util";
import { SwitchTabControls } from "./Components/SwitchTabButtons";

export function App() {
  const [activeTab, setActiveTab] = useState<TTab>("merge");

  /*--File Combiner--*/
  const combinerState = useFileCombineState();
 
  /*--Page Extractor--*/
  const extractorState = usePageExtractorState();

  return (
    <div className={styles.fullWidthApp}>
      <AppHeader 
        setActiveTab={setActiveTab}
      />
      <div className={`card ${util.container}`}>      
        <div className={`${styles.app_body}`}>

          <div className={cx(styles.sidebar, styles.show, util.inner_pad, util.hide_xs)}>
            <SwitchTabControls
              mergeText="Combine Files"
              extractText="Extract Pages"
              setActiveTab={setActiveTab}
            />
          </div>
          <div className={`${util.inner_pad} ${util.full_width}`}>
            <AppTabBody
              activeTab={activeTab}

              onClearAll={combinerState.fnClearFileList}
              fileList={combinerState.fileList}
              onFileListChanged={combinerState.setFileList}
              mergeInProgress={combinerState.merging}
              onBeginPDFMerge={combinerState.fnMergeFiles}
              downloadURL={combinerState.downloadURL}
              onMergedFileDownload={combinerState.fnFileDownloaded}
              downloadMergedFile={combinerState.shouldDownloadFile}


              extractSrc={extractorState.srcURL}
              extractedFile={extractorState.extractedURL}
              setSplitTarget={extractorState.fnHandleSrcChanged}

              onSplitFileDownload={extractorState.fnOnFileDownloaded}
              downloadSplitFile={extractorState.shouldDownload}

              onBeginPageExtract={extractorState.fnBeginPageExtraction}
              splitInProgress={extractorState.creatingExtract}
              nPages={extractorState.nPages}
              loading={extractorState.loadingSrc}

              filter={extractorState.filter}
              setFilter={extractorState.setFilter}

              previewSize={extractorState.previewSize}
              setPreviewSize={extractorState.setPreviewSize}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
