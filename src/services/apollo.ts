import {
  AUTH_BASE_URL,
  HRM_BASE_URL,
  LINKUP_BASE_URL,
  USER_AGENT,
} from "@/config";
import api from "@/lib/ky";
import camelize from "camelize-ts";
import crypto from "crypto";

type Options = {
  companyCode: string;
  employeeCode: string;
  password: string;
  serviceLocation: string;
};

class Apollo {
  companyCode: string;
  srvLoc: string;
  employeeCode: string;
  password: string;

  constructor(options: Options) {
    this.companyCode = options.companyCode;
    this.employeeCode = options.employeeCode;
    this.password = options.password;
    this.srvLoc = options.serviceLocation;
  }

  async login() {
    const nowUnix = Math.floor(Date.now() / 1000);
    const hash = await this.fetchMagicHash(
      "POST",
      "/token",
      nowUnix,
      this.srvLoc
    );

    const username = `${this.companyCode}-${this.employeeCode}`;
    const url = new URL("/token", AUTH_BASE_URL);
    const formData = new URLSearchParams({
      grant_type: "password",
      userName: username,
      password: this.password,
    });

    const headers = new Headers({
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
      "User-Agent": USER_AGENT as string,
    });

    url.searchParams.append("time", nowUnix.toString(10));
    url.searchParams.append("hash", hash);
    url.searchParams.append("_sd", "HRM");

    const resp = await api.post(url, {
      headers,
      body: formData.toString(),
    });

    if (!resp.ok) {
      const json: { data: ErrorResponse } = await resp.json();

      throw new Error(json.data.Error.Title);
    }

    const json: { data: LoginResponse } = await resp.json();
    return camelize(json);
  }

  async fetchAccessToken(code: string) {
    const url = new URL("/api/auth/checkticket", LINKUP_BASE_URL);
    url.searchParams.append("code", code);
    url.searchParams.append("response_type", "id_token");

    const headers = new Headers({ "User-Agent": USER_AGENT as string });
    const resp = await api.get(url, { headers });

    if (!resp.ok) {
      const json: { data: ErrorResponse } = await resp.json();

      throw new Error(json.data.Error.Title);
    }

    const json: { data: TokenResponse } = await resp.json();

    return camelize(json);
  }

  async refreshToken(token: string) {
    const url = new URL("/api/auth/refreshtoken", LINKUP_BASE_URL);
    const headers = new Headers({
      Authorization: token,
      "User-Agent": USER_AGENT as string,
    });

    url.searchParams.append("response_type", "id_token");

    const resp = await api.get(url, { headers });

    if (!resp.ok) {
      const json: { data: ErrorResponse } = await resp.json();

      throw new Error(json.data.Error.Title);
    }

    const json: { data: TokenResponse } = await resp.json();

    return json;
  }

  async fetchUserData(token: string) {
    const url = new URL("/api/userInfo", LINKUP_BASE_URL);
    const headers = new Headers({
      Authorization: token,
      "User-Agent": USER_AGENT as string,
    });

    const resp = await api.get(url, { headers });

    if (!resp.ok) {
      const json: { data: ErrorResponse } = await resp.json();

      throw new Error(json.data.Error.Title);
    }

    const json: { data: UserResponse } = await resp.json();

    return json;
  }

  async fetchLocations(token: string) {
    const url = new URL("/api/locations/AppEnableList", HRM_BASE_URL);
    const headers = new Headers({
      Authorization: token,
      "User-Agent": USER_AGENT as string,
    });

    const resp = await api.get(url, { headers });

    if (!resp.ok) {
      const json: { data: ErrorResponse } = await resp.json();

      throw new Error(json.data.Error.Title);
    }

    const json: { data: LocationResponse } = await resp.json();

    return camelize(json);
  }

  async punch(type: 1 | 2, token: string, location: string) {
    const url = new URL("/api/checkin/punch/locate", HRM_BASE_URL);
    const locations = await this.fetchLocations(token);

    const lat = 0;
    const long = 0;
    const locId = "00000000-0000-0000-0000-000000000000";

    const locationData = Object.entries(locations.data.data).reduce(
      (acc, pair) => {
        const data = pair[1];

        if (data.locationName === location) {
          const lat = data.latitude;
          const long = data.longitude;
          const locId = data.punchesLocationId;

          return { lat, long, locId };
        }

        return acc;
      },
      { lat, long, locId }
    );

    const formData = new URLSearchParams({
      AttendanceType: type.toString(),
      Latitude: locationData.lat.toString(),
      Longitude: locationData.long.toString(),
      PunchesLocationId: locationData.locId,
      IsOverride: "true",
    });

    const headers = new Headers({
      Authorization: token,
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
      "User-Agent": USER_AGENT as string,
      actioncode: "Default",
      functioncode: "APP-LocationCheckin",
    });

    const resp = await api.post(url, {
      headers,
      method: "POST",
      body: formData.toString(),
    });

    if (!resp.ok) {
      const json: { data: ErrorResponse } = await resp.json();

      throw new Error(json.data.Error.Title);
    }

    const json: { data: PunchResponse } = await resp.json();

    return json;
  }

  private async fetchMagicHash(
    httpMethod: string,
    path: string,
    epoch: number,
    srvLoc: string
  ) {
    const str = `${httpMethod}${path}${epoch}${srvLoc}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(str);

    const hashBuf = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuf));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return hashHex;
  }
}

export default Apollo;
