import {PqRequest} from "./request/pq-request";
import {Data} from "./serialization/data";
import {first, map, tap} from "rxjs/operators";
import {PqResponse} from "./response/pq-response";
import {assert} from "@telegram/foundation";
import {MtProto} from "./mt-proto";
import {DhParamsRequest, PqInnerData} from "./request/dh-params-request";

export class AuthService {
    constructor(private readonly mtProto: MtProto) {
    }

    public async authenticate() {
        const pqResponse = await this.requestPq();
        const [p, q] = await this.mtProto.primeFactorizationService.factorize(pqResponse.pq);
        return this.requestDhParams(pqResponse, p, q);
    }

    public requestPq(): Promise<PqResponse> {
        const request = new PqRequest({nonce: this.randomBigInt({sizeInBits: 128})});

        return this.mtProto.transport.send(request).pipe(
            map(data => new PqResponse(data)),
            tap(response => assert(request.nonce === response.nonce)),
            first()
        ).toPromise();
    }

    public requestDhParams(pqResponse: PqResponse, p: bigint, q: bigint): Promise<void> {
        const newNonce = this.randomBigInt({sizeInBits: 512});
        const pqData = new PqInnerData({
            p, q, newNonce,
            serverNonce: pqResponse.serverNonce,
            pq: pqResponse.pq,
            nonce: pqResponse.nonce
        });

        const dhParamsRequest = new DhParamsRequest({
            data: pqData,
            publicKeyFingerprint: pqResponse.fingerprints[0]
        });

        return MtProto.shared.transport.send(dhParamsRequest).pipe(
            map(() => void 0),
            first()
        ).toPromise();
    }

    private randomBigInt({sizeInBits}: { sizeInBits: number }): bigint {
        assert(sizeInBits % 8 === 0);
        const data = Data.allocate({initialCapacity: sizeInBits / 8});
        crypto.getRandomValues(data.bytes);
        data.resetPointer();
        return data.readBigInt({sizeInBits: 128});
    }
}
