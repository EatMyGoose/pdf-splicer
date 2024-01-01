import { UniqueURL } from "./UniqueURL";

export class UniqueURLList
{
    private list: UniqueURL[] = [];

    Clear()
    {
        this.list.forEach(url => url.Release());
        this.list = []; 
    }

    Push(elem :UniqueURL)
    {
        this.list.push(elem);
    }

    Assign(arr: UniqueURL[])
    {
        this.Clear();
        this.list = arr;
    }

    Get(): UniqueURL[]
    {
        return this.list;
    }
}