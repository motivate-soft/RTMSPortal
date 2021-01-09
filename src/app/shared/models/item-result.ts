
class BaseResult
{
    Message: string;
    Success: boolean;
}

export class ItemResult<T> extends BaseResult
{
    Item: T;
}
