import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface MathProblem {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export async function generateMathProblem(userContext: string): Promise<MathProblem> {
  const prompt = `
Kamu adalah guru matematika SMP yang ramah dan pengertian.
Buatlah 1 soal cerita matematika tentang operasi hitung campuran (melibatkan minimal 3 dari: penjumlahan, pengurangan, perkalian, pembagian, atau tanda kurung).
Tingkat kesulitan: Kelas 7-9 SMP.

Konteks cerita HARUS BERDASARKAN informasi kegiatan siswa berikut ini:
"${userContext}"

Buat ceritanya singkat (maksimal 3 kalimat) agar cepat dibaca oleh anak yang sibuk.
Pastikan soalnya masuk akal dengan konteks yang diberikan.

Berikan 4 pilihan jawaban dalam bentuk angka saja atau dengan satuan yang relevan.
Berikan juga penjelasan langkah demi langkah cara menyelesaikannya.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          question: {
            type: Type.STRING,
            description: "Teks soal cerita matematika.",
          },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "4 pilihan jawaban (misal: '15 kg', '20 kg', dst).",
          },
          correctAnswer: {
            type: Type.STRING,
            description: "Jawaban yang benar, harus sama persis dengan salah satu isi dari array options.",
          },
          explanation: {
            type: Type.STRING,
            description: "Penjelasan langkah demi langkah cara menyelesaikan soal.",
          },
        },
        required: ["question", "options", "correctAnswer", "explanation"],
      },
    },
  });

  const jsonStr = response.text?.trim() || "{}";
  return JSON.parse(jsonStr) as MathProblem;
}
