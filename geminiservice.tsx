import { GoogleGenAI, Type } from "@google/genai";

// Initialize GoogleGenAI with the API key from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDesiCaption = async (topic: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a cool, trendy, and emotional social media caption for a post about: ${topic}. 
      Make it India-centric, maybe use some Hinglish words, and add relevant emojis. 
      Format the output as JSON with fields: 'caption' and 'hashtags' (array).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            caption: { type: Type.STRING },
            hashtags: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["caption", "hashtags"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      caption: "Jai Hind! 🇮🇳 Loving the vibes today.",
      hashtags: ["#Bharat", "#DesiVibes"]
    };
  }
};

/**
 * AI Content Moderation: Flags harmful, inappropriate, or non-India-respectful content.
 */
export const checkContentSafety = async (caption: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Act as a content moderator for Bharatgram, an Indian social media platform. 
      Analyze this caption for harmful content, hate speech, explicit material, or extreme disrespect to Indian culture/values.
      
      Caption: "${caption}"
      
      Return a JSON object:
      {
        "isSafe": boolean,
        "reason": "Short friendly Hinglish explanation if not safe, otherwise empty"
      }`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isSafe: { type: Type.BOOLEAN },
            reason: { type: Type.STRING }
          },
          required: ["isSafe", "reason"]
        }
      }
    });

    return JSON.parse(response.text || '{"isSafe": true, "reason": ""}');
  } catch (error) {
    console.error("Safety Check Error:", error);
    // Fail safe in case of API error, or could fail closed depending on policy
    return { isSafe: true, reason: "" };
  }
};

export const chatWithBharatAI = async (message: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: message,
      config: {
        systemInstruction: "You are Bharat AI, the smart assistant for Bharatgram. You are friendly, helpful, and you love Indian culture. You speak a mix of English and Hindi (Hinglish) sometimes to keep it friendly and relatable. Answer user queries about the app or general light conversation.",
      }
    });
    return response.text;
  } catch (error) {
    return "Arre yaar, I'm having a bit of trouble connecting. Try again later? 🇮🇳";
  }
};
