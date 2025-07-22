import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import cors from 'cors'; // Para permitir requisições do seu frontend

dotenv.config(); // Carrega as variáveis de ambiente do .env

const app = express();
const port = 3001; // Porta do seu backend

// Configurações CORS para permitir requisições do seu frontend React
app.use(cors({
  origin: 'http://localhost:3000' // Altere para a URL do seu frontend em produção
}));
app.use(express.json()); // Permite que o Express leia JSON no corpo da requisição

const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
  console.error('Erro: A variável de ambiente GEMINI_API_KEY não está definida.');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(geminiApiKey);

// Endpoint para gerar vídeo
app.post('/api/generate-video', async (req, res) => {
  const { prompt, aspectRatio = "16:9", duration = "8s" } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'O campo "prompt" é obrigatório.' });
  }

  try {
    console.log(`Recebido pedido para gerar vídeo com prompt: "${prompt}"`);
    
    // O modelo Veo 3 é acessado através do serviço de vídeo, não diretamente do gerador de texto
    // Você usaria a API de vídeo específica.
    // **Importante:** A Google fornece um SDK específico para o Veo 3.
    // A chamada abaixo é um exemplo genérico da API Gemini, o Veo 3 tem um serviço e métodos dedicados.
    // Para Veo 3, você usaria algo como `client.models.generateVideos` como no exemplo Python anterior.
    // Este exemplo abaixo é mais para demonstração de como interagir com o Gemini,
    // e o Veo 3 precisa de uma configuração mais específica de cliente.

    // Exemplo **conceitual** de como você chamaria uma API do Google para vídeo (o SDK específico pode variar):
    // const videoService = genAI.getService('video'); // Isso é um placeholder, o SDK real pode ser diferente
    // const operation = await videoService.models.generateVideos({
    //   model: "veo-3.0-generate",
    //   prompt: prompt,
    //   config: {
    //     aspect_ratio: aspectRatio,
    //     duration: duration,
    //   }
    // });

    // --- Usando um placeholder para simular a resposta do Veo 3 ---
    // Em um cenário real, você teria a lógica de polling ou webhook aqui para verificar o status
    // da operação assíncrona do Veo 3 e retornar a URL do vídeo final.
    console.log("Simulando geração de vídeo...");
    await new Promise(resolve => setTimeout(Math.random() * 5000 + 2000, resolve)); // Simula um atraso

    const simulatedVideoUrl = `https://example.com/videos/generated-${Date.now()}.mp4`; // URL de vídeo de exemplo
    console.log(`Vídeo simulado gerado: ${simulatedVideoUrl}`);

    res.json({ videoUrl: simulatedVideoUrl });

  } catch (error) {
    console.error('Erro ao chamar a API do Veo 3:', error);
    res.status(500).json({ error: 'Falha ao gerar o vídeo.', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Backend rodando em http://localhost:${port}`);
});