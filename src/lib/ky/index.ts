import ky from "ky";
import { normalizeError, normalizeResponse } from "./hooks";

const api = ky.create({
  hooks: {
    afterResponse: [normalizeResponse],
    beforeError: [normalizeError],
  },
});

export default api;
