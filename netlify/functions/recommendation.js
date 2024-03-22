// recommendation.js

import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY;

/** OpenAI config */
if (!OPENAI_API_KEY) throw new Error("OpenAI API key is missing or invalid.");
export const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

/** Supabase config */
const privateKey = SUPABASE_API_KEY;
if (!privateKey) throw new Error(`Expected env var SUPABASE_API_KEY`);
const url = SUPABASE_URL;
if (!url) throw new Error(`Expected env var SUPABASE_URL`);
export const supabase = createClient(url, privateKey);

export async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  const { userQuery } = JSON.parse(event.body);

  try {
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: userQuery,
    });

    const embedding = embeddingResponse.data[0].embedding;

    const { data } = await supabase.rpc("match_movies", {
      query_embedding: embedding,
      match_threshold: 0.75,
      match_count: 10,
    });

    const match = data.map((obj) => obj.content).join("\n");

    const chatMessages = [
      {
        role: "system",
        content: `You are an enthusiastic movie expert who loves recommending movies to people. You will be given a piece of information which matched from the vector database of movies. Your job is to return one JSON object which contains movie title, release year, and a short description of one movie, based on the provided information (like this: {"title": "MOVIE_TITLE_GOES_HERE", "release": "RELEASE_YEAR_GOES_HERE", "description": "DESCRIPTION_GOES_HERE"}). If you are unsure and cannot find the answer in the context, please do not make up the answer, but return JSON with an error property (like this: {"error": "ERROR_MESSAGE_GOES_HERE"}). Make sure to return JSON only, without code blocks.`,
      },
      {
        role: "user",
        content: `Information from the database: ${match}`,
      },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: chatMessages,
      temperature: 0.5,
      frequency_penalty: 0.5,
    });

    const recommendationResponse = JSON.parse(
      response.choices[0].message.content
    );

    return {
      statusCode: 200,
      body: JSON.stringify(recommendationResponse),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
