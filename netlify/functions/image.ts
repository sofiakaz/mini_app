import type { Handler } from "@netlify/functions"

export const handler: Handler = async (event) => {
  const url = event.queryStringParameters?.url

  if (!url) {
    return {
      statusCode: 400,
      body: "No url provided",
    }
  }

  try {
    const response = await fetch(url)
    const buffer = await response.arrayBuffer()

    return {
      statusCode: 200,
      headers: {
        "Content-Type":
          response.headers.get("content-type") || "image/jpeg",
        "Cache-Control": "public, max-age=86400",
      },
      body: Buffer.from(buffer).toString("base64"),
      isBase64Encoded: true,
    }
  } catch {
    return {
      statusCode: 500,
      body: "Image fetch failed",
    }
  }
}
