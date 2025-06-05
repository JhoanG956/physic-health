

import { NextResponse } from 'next/server';
import multer from 'multer';
import { SpeechClient } from '@google-cloud/speech';
import path from 'path';

// Configura el almacenamiento en memoria para multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Crea el cliente de la API de Google Cloud Speech
const client = new SpeechClient();

// La función para manejar la solicitud de transcripción
export async function POST(req: Request) {
  try {
    // Usamos multer para procesar la solicitud POST con archivo
    const formData = await new Promise((resolve, reject) => {
      upload.single('file')(req as any, {} as any, (err: any) => {
        if (err) reject(err);
        resolve(req);
      });
    });

    const file = (formData as any).file;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const audioBytes = file.buffer.toString('base64');

    const audio = {
      content: audioBytes,
    };

    const config = {
      encoding: 'LINEAR16', // Ajusta el formato según lo que hayas grabado
      sampleRateHertz: 48000, // Ajusta el valor según tu grabación
      languageCode: 'es-ES', // Idioma en español
    };

    const request = {
      audio: audio,
      config: config,
    };

    // Solicita la transcripción a la API de Google Cloud Speech-to-Text
    const [response] = await client.recognize(request);

    // Extrae la transcripción de la respuesta
    const transcript = response.results
      .map((result: any) => result.alternatives[0].transcript)
      .join('\n');

    // Devuelve la transcripción como respuesta JSON
    return NextResponse.json({ transcript });
  } catch (error) {
    console.error('Error transcribiendo el audio:', error);
    return NextResponse.json({ error: 'Error al transcribir el audio' }, { status: 500 });
  }
}