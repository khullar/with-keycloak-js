import Keycloak from "keycloak-js";

const keycloakConfig = {
  url: "http://0.0.0.0:8080", // Replace with your Keycloak URL
  realm: "gcc", // Replace with your Keycloak realm
  clientId: "gcc_client", // Replace with your Keycloak client ID
};

let keycloak;

if (typeof window !== "undefined") {
  keycloak = new Keycloak(keycloakConfig);
}

let isInitialized = false;

export const initKeycloak = () => {
  if (!isInitialized && keycloak) {
    isInitialized = true;
    return keycloak
      .init({ onLoad: "login-required", checkLoginIframe: false })
      .then((authenticated) => authenticated)
      .catch((err) => {
        isInitialized = false;
        console.error("Failed to initialize Keycloak", err);
        throw err;
      });
  }
  return Promise.resolve(keycloak?.authenticated ?? false);
};

export const logout = () => {
  if (keycloak) {
    keycloak.logout();
  }
};

export const getToken = async () => {
  if (keycloak) {
    if (keycloak.isTokenExpired()) {
      try {
        await keycloak.updateToken(30);
      } catch (error) {
        console.error("Failed to refresh the token", error);
        keycloak.logout();
        return null;
      }
    }
    return keycloak.token ?? null;
  }
  return null;
};

export { keycloak };
