import { TTab } from "../types";
import { ISplicerControls, SplicerControls } from "./SplicerControls";
import { IPageExtractorControls, PageExtractorControls,  } from "./PageExtractorControls";

interface IAppTabBody extends ISplicerControls, IPageExtractorControls
{
    activeTab: TTab   
}

export function AppTabBody(props: IAppTabBody)
{
    switch(props.activeTab)
    {
        case "extract":
            return <PageExtractorControls {...props}/>
        case "merge":
            return <SplicerControls {...props}/>;
        default:
            return <h1>Missing</h1>
    }
}

