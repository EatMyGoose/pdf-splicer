
export function SwapInPlace<T>(arr: T[], idx1: number, idx2: number) : void
{
    let temp: T = arr[idx1];
    arr[idx1] = arr[idx2];
    arr[idx2] = temp;
}

export function cx(...classes: string[] ) : string
{
    return classes.join(" ");
}