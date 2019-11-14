import {notImplemented} from "@telegram/foundation";
import {Response} from "./response";
import {Data} from "../serialization/data";
import {Int128Coder, Int64Coder, IntCoder, VectorCoder} from "../serialization/coders";

export class PqResponse extends Response {
    public nonce: bigint;
    public serverNonce: bigint;
    public pq: bigint;
    public fingerprints: bigint[];

    constructor(data: Data) {
        super(data);

        IntCoder.shared.decode(data); // %(resPQ)

        this.nonce = Int128Coder.shared.decode(data);
        this.serverNonce = Int128Coder.shared.decode(data);

        const pqBytes = new Data(data.readBytes());
        this.pq = Int64Coder.shared.decode(pqBytes);

        const fingerprintsCoder = new VectorCoder(Int64Coder.shared);
        this.fingerprints = fingerprintsCoder.decode(data);
    }

    public async factorize(): Promise<{ p: bigint, q: bigint }> {
        return notImplemented();
    }
}
