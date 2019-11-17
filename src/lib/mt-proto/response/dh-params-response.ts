import {Response} from "./response";
import {Data} from "../serialization/data";
import {IntCoder} from "../serialization/coders";

export class DhParamsResponse extends Response {
    // public readonly nonce: bigint;
    // public readonly serverNonce: bigint;


    constructor(data: Data) {
        super(data);

        const result = IntCoder.shared.decode(data);
        console.log(result);
        console.log(result === 0xd0e8075c);

        // this.nonce = Int128Coder.shared.decode(data);

    }
}
