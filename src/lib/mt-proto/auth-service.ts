import {PqRequest} from "./request/pq-request";
import {Data} from "./serialization/data";
import {first, map, tap} from "rxjs/operators";
import {PqResponse} from "./response/pq-response";
import {assert} from "@telegram/foundation";
import {MtProto} from "./mt-proto";

export class AuthService {
    constructor(private readonly mtProto: MtProto) {
    }

    public async authenticate() {
        const pqResponse = await this.requestPq();
        const publicKey = await this.mtProto.keyService.loadKeyByFingerprint(pqResponse.fingerprints[0]);
        const [p, q] = await this.mtProto.primeFactorizationService.factorize(pqResponse.pq);
    }

    public requestPq(): Promise<PqResponse> {
        const request = new PqRequest({nonce: this.generateNonce()});

        return this.mtProto.transport.send(request).pipe(
            map(data => new PqResponse(data)),
            tap(response => assert(request.nonce === response.nonce)),
            first()
        ).toPromise();
    }

    private generateNonce(): bigint {
        const data = Data.allocate({initialCapacity: 16});
        crypto.getRandomValues(data.bytes);
        data.resetPointer();
        return data.readBigInt({sizeInBits: 128});
    }
}
