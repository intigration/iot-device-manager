import HttpWrapper from "../utils/http.wrapper";

// Peripheral / Mote Related Services

export async function moteEncryptedCredentials(moteSerial) {
  return HttpWrapper.accountAndTokenHttp().get(`/gateway-services/auth/v1/peripheral/${moteSerial}/initialcredentials`);
}

export async function getMotes() {
  return HttpWrapper.accountAndTokenHttp().get(`/device-services/peripheral/v1/list`);
}

// Gateway Related Services

export async function getGateways() {
  return HttpWrapper.accountAndTokenHttp().get(`/gateway-services/box/v1.0/boxes`);
}

export async function gatewayEncryptedCredentials(serialNumber) {
  return HttpWrapper.accountAndTokenHttp().get(`/gateway-services/auth/v1/box/${serialNumber}/initialcredentials`);
}

export async function gatewayCsr(serialNumber) {
  return HttpWrapper.accountAndTokenHttp().get(`/gateway-services/auth/v1/box/${serialNumber}/initialcredentials?csr=csr`);
}

export async function gatewayDid(serialNumber) {
  return HttpWrapper.accountAndTokenHttp().get(`/gateway-services/auth/v1/box/${serialNumber}/deployment-info`)
}

export async function updateBackendOnMatInjectionSuccess(gatewaySerial) {
  return HttpWrapper.accountAndTokenHttp().post(`/gateway-services/gateway/v1/boxes/${gatewaySerial}/dmatstatus`);
}

export async function unlockGatewayOnBackend(gatewaySerial) {
  return HttpWrapper.accountAndTokenHttp().post(`/gateway-services/gateway/v1/${gatewaySerial}/unblock`);
}
