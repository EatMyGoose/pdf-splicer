interface IFailable
{
    success: boolean,
    errorMsg: string
}

export interface IParseResult extends IFailable
{
    pageIndices: number[]
}

type originalToken = string;
type trimmedToken = string;

function make_integer_range(start: number, endInclusive: number)
{
    let range: number[] = [];

    if(start < endInclusive)
    {
        for(let i = start; i <= endInclusive; i++) range.push(i);
    }
    else
    {
        for(let i = start; i >= endInclusive; i--) range.push(i);
    }
    
    return range;
}

function make_failure(errMsg: string)
{
    return {
        pageIndices: [],
        success: false,
        errorMsg: errMsg
    }
}

function make_success(pageIndices: number[])
{
    return {
        pageIndices: pageIndices,
        success: true,
        errorMsg: ""
    }
}

function pageWithinRange(pageNumber: number, maxPage: number)
{
    const withinRange = pageNumber >= 1 && pageNumber <= maxPage;
    return withinRange;
}

function pageNumber2PageIndex(pageNumber: number)
{
    return pageNumber - 1;
}

function TryParseNumber(originalToken: string, trimmedToken: string, maxPage: number) : IParseResult | undefined
{
    if(!trimmedToken.match(/^[0-9]+$/)) return undefined;

    const pageNumber = Number.parseInt(trimmedToken);
    if(!pageWithinRange(pageNumber, maxPage))
    {
        return make_failure(`${originalToken} is out of range [1, ${maxPage}]`);
    }

    return make_success([pageNumber2PageIndex(pageNumber)]);
}

function TryParseRange(originalToken: string, trimmedToken: string, maxPage: number) : IParseResult | undefined
{
    if(!trimmedToken.match(/^[0-9]+-[0-9]+$/)) return undefined;

    const [leftStr, rightStr] = trimmedToken.split("-");

    const left = Number.parseInt(leftStr);
    const right = Number.parseInt(rightStr);

    let errAcc: string[] = [];

    if(!pageWithinRange(left, maxPage)) errAcc.push(`${left} is out of range [1, ${maxPage}]`);
    if(!pageWithinRange(right, maxPage)) errAcc.push(`${right} is out of range [1, ${maxPage}]`);

    if(errAcc.length > 0)
    {
        return make_failure(`${originalToken} - ${errAcc.join(", ")}`)
    }

    return make_success(
        make_integer_range(
            pageNumber2PageIndex(left), 
            pageNumber2PageIndex(right)));
}

function TryParseToken(originalToken: string, trimmedToken: string, maxPage: number) : IParseResult
{
    {
        const numberResult = TryParseNumber(originalToken, trimmedToken, maxPage);
        if(numberResult !== undefined) return  numberResult;
    }

    {
        const rangeResult = TryParseRange(originalToken, trimmedToken, maxPage);
        if(rangeResult !== undefined) return rangeResult;
    }

    return make_failure(`${originalToken} - invalid token`);
}

export function ParsePangeRange(
    input: string, 
    pageCount: number) : IParseResult
{

    const tokens: [originalToken, trimmedToken][] = (
        input
            .split(",")
            .map(token => [token, token.replace(/\s/g, "")] as [string,string])
            .filter(([_, trimmed]) => trimmed.length > 0)
    );

    const parseResults = tokens.map(([original, trimmed]) => TryParseToken(original, trimmed, pageCount));

    const allSucceeded = parseResults.every(result => result.success);

    if(allSucceeded)
    {
        const indices: number[] = parseResults.flatMap(result => result.pageIndices);
        return make_success(indices);
    }
    else
    {
        const errors: string[] = (
            parseResults
                .filter(result => !result.success)
                .map(result => result.errorMsg)
        );
        
        return make_failure(errors.join("\n"));
    }
}