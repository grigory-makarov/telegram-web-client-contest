import {Data} from "../serialization/data";
import {Request} from "../request/request";
import {Observable} from "rxjs";

export abstract class Transport {
    public abstract send(request: Request): Observable<Data>;
}
