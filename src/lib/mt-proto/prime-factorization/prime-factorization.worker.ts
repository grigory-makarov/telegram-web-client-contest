import {fromEvent} from "rxjs";
import {map} from "rxjs/operators";
import {InputMessage, OutputMessage} from "./message";

const context: Worker = self as any;

fromEvent<MessageEvent>(context, "message").pipe(
    map(event => event.data as InputMessage),
    map(message => ({
        id: message.id,
        primeFactors: computePrimeFactors(message.number)
    } as OutputMessage)),
    map(message => context.postMessage(message))
).subscribe();

function computePrimeFactors(number: bigint): bigint[] {
    const primeFactors: bigint[] = [];
    let current = number;
    let primeFactor = 0n;

    for (let i = 2n; i <= current / i; i++) {
        if (current % i === 0n) {
            primeFactor = i;
            primeFactors.push(primeFactor);
            current /= i;
        }
    }

    if (primeFactor < current) {
        primeFactors.push(current);
    } else {
        primeFactors.push(primeFactor);
    }

    return primeFactors;
}


export default null as any;
