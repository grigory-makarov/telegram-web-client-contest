import {Int64Coder, IntCoder} from "../serialization/coders";
import {Data} from "../serialization/data";

export abstract class Response {
    public authKeyId: bigint;
    public messageId: bigint;
    public bodyLength: number;

    constructor(data: Data) {
        this.authKeyId = Int64Coder.shared.decode(data);
        this.messageId = Int64Coder.shared.decode(data);
        this.bodyLength = IntCoder.shared.decode(data);
    }
}
