import {AuthService} from "./auth-service";
import {RsaKeyService} from "./rsa-key-service";
import {PrimeFactorizationService} from "./prime-factorization/prime-factorization-service";
import {Transport} from "./transport/transport";
import {HttpTransport} from "./transport/http-transport";

export class MtProto {
    public static readonly shared = new MtProto();

    private constructor() {
    }

    private _keyService: RsaKeyService | null = null;

    public get keyService(): RsaKeyService {
        if (!this._keyService) {
            this._keyService = new RsaKeyService();
        }

        return this._keyService;
    }

    private _authService: AuthService | null = null;

    public get authService(): AuthService {
        if (!this._authService) {
            this._authService = new AuthService(this);
        }

        return this._authService;
    }

    private _primeFactorizationService: PrimeFactorizationService | null = null;

    public get primeFactorizationService(): PrimeFactorizationService {
        if (!this._primeFactorizationService) {
            this._primeFactorizationService = new PrimeFactorizationService();
        }

        return this._primeFactorizationService;
    }

    private _transport: Transport | null = null;

    public get transport(): Transport {
        if (!this._transport) {
            this._transport = new HttpTransport();
        }

        return this._transport;
    }
}
