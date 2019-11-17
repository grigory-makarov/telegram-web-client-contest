import {Request} from "./request";
import {Data} from "../serialization/data";
import {Int128Coder, Int512Coder, Int64Coder, IntCoder} from "../serialization/coders";
import {MtProto} from "@telegram/mt-proto";

export class PqInnerData {
    public readonly pq: bigint;
    public readonly p: bigint;
    public readonly q: bigint;
    public readonly nonce: bigint;
    public readonly serverNonce: bigint;
    public readonly newNonce: bigint;

    constructor({pq, p, q, nonce, serverNonce, newNonce}: { pq: bigint, p: bigint, q: bigint, nonce: bigint, serverNonce: bigint, newNonce: bigint }) {
        this.pq = pq;
        this.q = q;
        this.p = p;
        this.nonce = nonce;
        this.serverNonce = serverNonce;
        this.newNonce = newNonce;
    }

    public encode(): Data {
        const data = Data.allocate({initialCapacity: 96});

        IntCoder.shared.encode(0x83c95aec, data); // %(p_q_inner_data)
        data.writeByteString(this.pq.toString(16));
        Int64Coder.shared.encode(this.p, data);
        Int64Coder.shared.encode(this.q, data);
        Int128Coder.shared.encode(this.nonce, data);
        Int128Coder.shared.encode(this.serverNonce, data);
        Int512Coder.shared.encode(this.newNonce, data);
        return data;
    }
}


export class DhParamsRequest extends Request {
    public readonly pqData: PqInnerData;
    public readonly publicKeyFingerprint: bigint;

    constructor({data, publicKeyFingerprint}: { data: PqInnerData, publicKeyFingerprint: bigint }) {
        super();
        this.pqData = data;
        this.publicKeyFingerprint = publicKeyFingerprint;
    }

    public async encryptPqData(): Promise<Data> {
        const data = await this.pqData.encode();
        const writtenBytes = data.select(0, data.offset).bytes;
        const hashedBytes = new Uint8Array(await crypto.subtle.digest("SHA-1", writtenBytes));
        const bytesToEncrypt = new Uint8Array(writtenBytes.length + hashedBytes.length);

        bytesToEncrypt.set(hashedBytes);
        bytesToEncrypt.set(writtenBytes, hashedBytes.length);

        const publicKey = await MtProto.shared.keyService.loadKeyByFingerprint(this.publicKeyFingerprint);
        const algorithm = {
            name: "RSA-OAEP",
            hash: {name: "SHA-1"},
            modulusLength: publicKey.modulus.length,
            extractable: true,
            publicExponent: new Uint8Array([1, 0, 1])
        };

        const usage = ["encrypt", "decrypt", "sign", "verify", "deriveKey", "deriveBits", "wrapKey", "unwrapKey"];
        const cryptoKey = await crypto.subtle.importKey("spki", publicKey.bytes, algorithm, true, usage);
        const buffer = await crypto.subtle.encrypt({name: "RSA-OAEP"}, cryptoKey, bytesToEncrypt);
        return new Data(buffer);
    }

    protected async encodeBody(): Promise<Data> {
        const data = Data.allocate({initialCapacity: 2048});

        IntCoder.shared.encode(0xd712e4be, data); // %(req_DH_params)
        Int128Coder.shared.encode(this.pqData.nonce, data);
        Int128Coder.shared.encode(this.pqData.serverNonce, data);
        Int64Coder.shared.encode(this.pqData.p, data);
        Int64Coder.shared.encode(this.pqData.q, data);
        Int64Coder.shared.encode(this.publicKeyFingerprint, data);

        const encryptedData = await this.encryptPqData();
        data.writeBytes(encryptedData.bytes);

        return data;
    }
}
