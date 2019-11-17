import {Int128Coder, IntCoder} from "../serialization/coders";
import {Data} from "../serialization/data";
import {Request} from "./request";


export class PqRequest extends Request {
    /**
     * 128-bit integer
     */
    public readonly nonce: bigint;

    constructor({nonce}: { nonce: bigint }) {
        super();
        this.nonce = nonce;
    }

    protected encodeBody(): Data {
        const data = Data.allocate({initialCapacity: 20});
        IntCoder.shared.encode(0x60469778, data);
        Int128Coder.shared.encode(this.nonce, data);
        return data;
    }
}
