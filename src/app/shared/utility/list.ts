import { List } from 'linqts';

export function list<T>(data: T[]) : List<T> {
    if(data){
        return new List<T>(data);
    }
    return new List<T>();
}
