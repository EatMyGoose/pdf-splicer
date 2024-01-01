import { JSX } from "preact/jsx-runtime";
import { Spinner } from "./Spinner";

interface ILoadable
{
    loading: boolean
    children: JSX.Element|string;
}

export function Loadable(props: ILoadable)
{
    if(props.loading) return <Spinner/>;
    else return <>{props.children}</>;
}