import "./global.scss";
import {RsaKeyService} from "./lib/mt-proto/rsa-key-service";
import {HttpTransport} from "@telegram/mt-proto";
import {PrimeFactorizationService} from "./lib/mt-proto/prime-factorization/prime-factorization-service";
import {AuthService} from "./lib/mt-proto/auth-service";

async function main() {
    const keyService = new RsaKeyService();
    const transport = new HttpTransport();
    const primeFactorizationService = new PrimeFactorizationService();

    const authService = new AuthService(transport, primeFactorizationService, keyService);
    await authService.authenticate();
}

main();

const p = [86, 205, 103, 225];
const q = [98, 204, 142, 203];
const pq = [33, 127, 253, 221, 173, 204, 45, 107];
