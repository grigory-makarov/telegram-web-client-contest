import PrimeFactorizationWorker from "./prime-factorization.worker";
import {InputMessage, OutputMessage} from "./message";
import {fromEvent} from "rxjs";
import {filter, first, map} from "rxjs/operators";

export class PrimeFactorizationService {
    private _worker: Worker | null = null;

    public get worker(): Worker {
        if (!this._worker) {
            this._worker = new PrimeFactorizationWorker();
        }

        return this._worker!;
    }


    public async factorize(number: bigint): Promise<bigint[]> {
        const messageId = Math.random();

        this.worker.postMessage({id: messageId, number} as InputMessage);

        return fromEvent<MessageEvent>(this.worker, "message").pipe(
            map(event => event.data as OutputMessage),
            filter(message => message.id === messageId),
            map(message => message.primeFactors),
            first()
        ).toPromise();
    }
}
