import {Transport} from "./transport";
import {Data} from "../serialization/data";
import {Request} from "../request/request";
import {Observable} from "rxjs";

export class HttpTransport extends Transport {
    public send(request: Request): Observable<Data> {
        return new Observable<Data>(observer => {
            const http = new XMLHttpRequest();
            http.responseType = "arraybuffer";
            http.onerror = error => observer.error(error);

            http.onreadystatechange = () => {
                if (http.readyState === 4 && http.status >= 200 && http.status < 300) {
                    observer.next(new Data(http.response));
                    observer.complete();
                }
            };

            http.open("POST", "https://venus.web.telegram.org/apiw_test1");
            request.encode()
                .then(data => http.send(data.bytes))
                .catch(error => console.error(error));
        });
    }
}
