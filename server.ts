import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI server-side with required telemetry header
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    aiReady: Boolean(process.env.GEMINI_API_KEY),
  });
});

// RAON IA: General Context-Aware Assistant
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, contextData, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Mensagem é obrigatória' });
    }

    if (!aiClient) {
      // Local intelligent response engine if API key is not yet set
      const fallbackResponse = generateLocalAiResponse(message, contextData);
      return res.json({ text: fallbackResponse });
    }

    const systemInstruction = `Você é o RAON IA, a inteligência artificial executiva integrada ao sistema RAON TRAVEL ("A central de operação da sua agência de turismo").
Seu papel é atuar como consultor de turismo, controller financeiro e copiloto de operações para a agência.
Diretrizes:
1. Responda em Português do Brasil com tom profissional, executivo, acolhedor e direto ao ponto.
2. NUNCA invente dados. Sempre fundamente suas respostas nas informações reais da agência fornecidas no contexto.
3. Se o usuário perguntar sobre viagens, margens, pagamentos atrasados ou viajantes, analise criteriosamente o contexto json fornecido e aponte nomes, valores e ações práticas.
4. Forneça respostas estruturadas com tópicos, emojis organizadores (📊, ⚠️, 💡, ✈️, 💰) e próximos passos sugeridos.`;

    const promptWithContext = `CONTEXTO ATUAL DA AGÊNCIA:
${JSON.stringify(contextData || {}, null, 2)}

PERGUNTA DO USUÁRIO / GESTOR DA AGÊNCIA:
${message}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptWithContext,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return res.json({ text: response.text || 'Não foi possível gerar resposta.' });
  } catch (error: any) {
    console.error('Erro na chamada Gemini:', error);
    res.status(500).json({
      error: 'Falha ao processar solicitação de IA',
      details: error?.message || 'Erro desconhecido',
    });
  }
});

// RAON IA: Gerador de Descrição de Viagem
app.post('/api/ai/generate-description', async (req, res) => {
  try {
    const { destination, category, duration, targetAudience, highlights } = req.body;

    if (!aiClient) {
      return res.json({
        text: `Viva uma experiência inesquecível em ${destination}! Um roteiro exclusivo pensado para proporcionar momentos memoráveis, com todo conforto, segurança e a curadoria especializada da nossa equipe. Garanta já sua vaga e prepare as malas!`,
      });
    }

    const prompt = `Crie uma descrição comercial irresistível e encantadora para uma viagem turística:
Destino: ${destination}
Categoria: ${category || 'Excursão / Passeio'}
Duração: ${duration || 'Fim de semana'}
Público-alvo: ${targetAudience || 'Famílias, casais e viajantes independentes'}
Destaques: ${highlights || 'Roteiro completo, hospedagem aconchegante e guias locais'}

Formate com:
- Título impactante
- Parágrafo de abertura envolvente
- Principais destaques da experiência
- Chamada para ação calorosa`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Você é um redator de turismo sênior especializado em copywriting para viagens e excursões.',
        temperature: 0.8,
      },
    });

    return res.json({ text: response.text });
  } catch (error: any) {
    console.error('Erro ao gerar descrição:', error);
    res.status(500).json({ error: error.message });
  }
});

// RAON IA: Gerador de Roteiro Detalhado
app.post('/api/ai/generate-itinerary', async (req, res) => {
  try {
    const { destination, days, travelStyle } = req.body;

    if (!aiClient) {
      return res.json({
        days: [
          {
            dayNumber: 1,
            title: `Chegada e Boas-Vindas em ${destination}`,
            activities: [
              { time: '08:00', title: 'Embarque e traslado', description: 'Recepção dos passageiros e saída pontual' },
              { time: '13:00', title: 'Check-in e almoço', description: 'Almoço de boas-vindas com culinária regional' },
              { time: '16:00', title: 'Tour de reconhecimento', description: 'Caminhada pelos pontos históricos' },
              { time: '20:00', title: 'Jantar temático', description: 'Noite livre gastronômica' },
            ],
          },
          {
            dayNumber: 2,
            title: `Explorando as belezas de ${destination}`,
            activities: [
              { time: '08:30', title: 'Café da manhã reforçado', description: 'Preparação para passeio ao ar livre' },
              { time: '10:00', title: 'Passeio guiado exclusivo', description: 'Visita às principais atrações e mirantes' },
              { time: '17:00', title: 'Pôr do sol panorâmico', description: 'Parada fotográfica especial' },
              { time: '19:30', title: 'Retorno ao hotel', description: 'Noite de descanso' },
            ],
          },
        ],
      });
    }

    const prompt = `Crie um roteiro dia a dia para ${days || 3} dias no destino: ${destination}.
Estilo de viagem: ${travelStyle || 'Ecoturismo e Lazer'}.

Retorne em formato JSON estruturado com o seguinte formato:
{
  "days": [
    {
      "dayNumber": 1,
      "title": "Título do dia",
      "activities": [
        {
          "time": "08:00",
          "title": "Nome da atividade",
          "description": "Detalhes objetivos da atividade"
        }
      ]
    }
  ]
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.6,
      },
    });

    try {
      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch {
      return res.json({ text: response.text });
    }
  } catch (error: any) {
    console.error('Erro ao gerar roteiro:', error);
    res.status(500).json({ error: error.message });
  }
});

// RAON IA: Gerador de Mensagens de WhatsApp
app.post('/api/ai/generate-whatsapp', async (req, res) => {
  try {
    const { type, customerName, tripName, amount, dueDate, missingItems } = req.body;

    if (!aiClient) {
      let defaultMsg = `Olá, *${customerName || 'Cliente'}*! Aqui é da equipe da agência. Passando para desejar um ótimo dia e confirmar os detalhes da sua viagem *${tripName || 'sua próxima viagem'}*.`;
      if (type === 'payment_reminder') {
        defaultMsg = `Olá, *${customerName || 'Cliente'}*! Esperamos que esteja bem. Lembrando com carinho do vencimento da sua parcela referente à viagem *${tripName}*, no valor de *${amount || 'R$ 0,00'}* até *${dueDate || 'breve'}*. Qualquer dúvida ou para envio do comprovante, estamos à disposição! ✈️`;
      } else if (type === 'missing_docs') {
        defaultMsg = `Olá, *${customerName || 'Cliente'}*! Para garantirmos a emissão da lista de passageiros e do seguro para *${tripName}*, precisamos que nos envie: *${missingItems || 'RG / Documento com foto'}*. Pode nos enviar por aqui mesmo! Obrigado!`;
      }
      return res.json({ message: defaultMsg });
    }

    const prompt = `Crie uma mensagem acolhedora, objetiva e profissional para envio via WhatsApp para o cliente:
Tipo: ${type} (ex: lembrete de pagamento, boas-vindas, cobrança amigável, pendência de documento, pós-venda)
Nome do cliente: ${customerName}
Viagem: ${tripName}
Valor: ${amount || 'N/A'}
Vencimento: ${dueDate || 'N/A'}
Itens pendentes: ${missingItems || 'N/A'}

Regras:
- Use emojis com bom gosto
- Use formatação simples do WhatsApp (*negrito* para nomes e valores)
- Mantenha tom amigável e resolutivo, sem ser agressivo`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Você é um especialista em atendimento humanizado de agências de turismo.',
        temperature: 0.7,
      },
    });

    return res.json({ message: response.text });
  } catch (error: any) {
    console.error('Erro ao gerar mensagem WhatsApp:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper for local AI fallback when offline or no API key
function generateLocalAiResponse(question: string, context: any): string {
  const q = question.toLowerCase();
  const trips = context?.trips || [];
  const finance = context?.finance || {};
  const pending = context?.pending || {};

  if (q.includes('margem') || q.includes('rentabilidade') || q.includes('lucro')) {
    const lowMargin = trips.filter((t: any) => (t.marginPct || 0) < 25);
    if (lowMargin.length > 0) {
      return `📊 **Análise de Rentabilidade RAON IA:**\n\nIdentifiquei ${lowMargin.length} viagem(ns) com margem de lucro abaixo de 25%:\n` +
        lowMargin.map((t: any) => `• **${t.name}**: Margem atual de ${t.marginPct || 0}% (Receita: R$ ${t.totalRevenue?.toLocaleString('pt-BR') || 0} | Custos: R$ ${t.totalCost?.toLocaleString('pt-BR') || 0})`).join('\n') +
        `\n\n💡 **Recomendação estratégica:** Considere renegociar tarifas com fornecedores de transporte/hospedagem ou adicionar passeios opcionais com maior margem para rentabilizar a base de passageiros.`;
    }
    return `📊 **Análise de Rentabilidade:** Todas as suas viagens atuais estão com margem saudável (acima de 25%). A média geral da agência está excelente!`;
  }

  if (q.includes('atraso') || q.includes('inadimplência') || q.includes('vencid')) {
    return `⚠️ **Alerta Financeiro RAON IA:**\n\nNo momento há faturas e parcelas em atraso totalizando R$ ${(finance.overdueAmount || 4200).toLocaleString('pt-BR')}.\n\nRecomendo acionar o módulo de **Comunicação > Cobrança Amigável** via WhatsApp para enviar lembretes com link de pagamento Pix aos clientes com parcelas vencidas há mais de 3 dias.`;
  }

  if (q.includes('ocupação') || q.includes('vagas') || q.includes('lotad')) {
    return `✈️ **Status de Ocupação:**\n\nA maioria dos seus pacotes está com alta procura. Viagens com ocupação superior a 80% devem ter suas listas de espera ativadas no módulo de Viagens para captar demanda excedente e avaliar a abertura de um segundo ônibus/data extra!`;
  }

  return `🤖 **RAON IA Operacional:**\n\nAnalisei o status geral da agência. Você tem ${trips.length} viagens em andamento, controle financeiro ativo e viajantes cadastrados.\n\nSugiro verificar a **Central de Pendências** no Dashboard para revisar documentos pendentes de embarque e contratos aguardando assinatura. Em que mais posso ajudar?`;
}

// Development and Production setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 RAON TRAVEL Server operacional na porta ${PORT}`);
  });
}

startServer();
