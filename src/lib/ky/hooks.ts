import camelize from "camelize-ts";
import { HTTPError, NormalizedOptions } from "ky";
import logger from "../bunyan";

const ContentType = {
  JSON: "json",
  TEXT: "text",
} as const;
type ContentType = (typeof ContentType)[keyof typeof ContentType];

function parseJson(text: string) {
  try {
    const data = JSON.parse(text);
    return { data, contentType: ContentType.JSON };
  } catch {
    return { data: text, contentType: ContentType.TEXT };
  }
}

export async function normalizeResponse(
  request: Request,
  options: NormalizedOptions,
  response: Response
) {
  const { headers, status, statusText } = response;
  const text = await response.text();
  const json = parseJson(text);
  const data = Object.assign({}, json, { status, statusText });

  const camelizedData = camelize(data);
  const nextResponse = new Response(JSON.stringify(camelizedData), {
    headers,
    status,
    statusText,
  });

  return nextResponse;
}

class NormalizedError extends HTTPError {
  code: string;
  status: number;

  constructor(error: HTTPError, options: { code: string; status: number }) {
    super(error.response, error.request, error.options);
    this.code = options.code;
    this.status = options.status;
    this.name = "NormalizedError";
  }
}

export async function normalizeError(error: HTTPError) {
  const json = await error.response.json();

  logger.error(json);

  const normalizedError = new NormalizedError(error, {
    code: json.data.code,
    status: json.status,
  });

  if (json.data.message) {
    normalizedError.message = json.data.message;
  }

  return normalizedError;
}
