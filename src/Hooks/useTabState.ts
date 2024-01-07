import { IsTTab, TTab } from "../types";

interface ITabState
{
    currentTab: TTab,
    setTab: (newTab: TTab) => void
}

export function useTabState(defaultTab: TTab) : ITabState
{
    const params = new URLSearchParams(window.location.search);

    let tab = params.get("tab");

    function setTab(newTab: TTab)
    {
        const newSearchParams = new URLSearchParams();
        newSearchParams.append("tab", newTab);

        const newURL = new URL(window.location.href);
        newURL.searchParams.set("tab", newTab);

        window.history.pushState({}, "", newURL.href);
    }

    if(tab == null || !IsTTab(tab))
    {
        setTab(defaultTab);
        tab = defaultTab;
    }

    return {
        currentTab: tab as TTab,
        setTab
    }
}