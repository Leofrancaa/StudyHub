import { defineModule } from "@/lib/content/define";

/**
 * Fontes: Aula14 (definição de visão computacional, campo multidisciplinar, tarefas e aplicações, CNN: convolução,
 * mapa de ativação, pooling, camada densa), Aula 20 (IA generativa, modelos fundacionais, engenharia de prompt,
 * StyleGAN). Correção: o mapa de ativação do slide 19 da Aula14 não bate com a imagem e o filtro do slide 18.
 * Fora do material: fórmula do tamanho de saída, padding, transfer learning, LLMs, tokens e alucinação.
 */
export const module12 = defineModule({
  slug: "visao-generativa",
  title: "Visão computacional e IA generativa",
  description: "Como a máquina \"enxerga\" com CNNs e como modelos generativos criam texto e imagens.",
  objectives: [
    "Distinguir as tarefas de visão computacional e suas aplicações",
    "Calcular convolução, tamanho de saída e max pooling numa CNN",
    "Explicar modelos fundacionais, engenharia de prompt e alucinação",
  ],
  estimatedMinutes: 45,
  questionsPerAttempt: 10,
  slides: [
    {
      id: "abertura",
      tags: [],
      blocks: [
        { type: "heading", eyebrow: "Módulo 12", text: "Ver e criar" },
        { type: "text", md: "A visão humana é incrível, mas às vezes demorada. A **visão computacional** reproduz/simula a visão com máquinas; a **IA generativa** vai além e **cria** conteúdo novo." },
        {
          type: "card-grid",
          columns: 3,
          cards: [
            { icon: "Eye", title: "Visão", description: "Tarefas: classificar, detectar, segmentar." },
            { icon: "Layers", title: "CNN", description: "Convolução, pooling e camada densa." },
            { icon: "Sparkles", title: "Generativa", description: "Modelos fundacionais e prompts." },
          ],
        },
      ],
    },
    {
      id: "tarefas",
      tags: ["tarefas"],
      blocks: [
        { type: "heading", eyebrow: "Aula 14", text: "Principais tarefas" },
        {
          type: "card-grid",
          columns: 2,
          cards: [
            { icon: "Image", title: "Classificação", description: "\"Esta imagem tem um gato.\" Um rótulo para a imagem inteira." },
            { icon: "Target", title: "Localização", description: "Rótulo + uma caixa (bounding box) ao redor do objeto." },
            { icon: "Search", title: "Detecção", description: "Várias caixas, uma por objeto, cada uma com sua classe." },
            { icon: "Puzzle", title: "Segmentação", description: "Classe por pixel. Semântica: \"pixels de pessoa\". De instância: \"pessoa 1, pessoa 2\"." },
          ],
        },
        { type: "callout", variant: "tip", md: "Aplicações da Aula 14: **indústria** (inspeção de qualidade), **medicina** (detecção de anomalias), **segurança** (reconhecimento facial), **automobilístico** (carros autônomos)." },
      ],
    },
    {
      id: "imagem-matriz",
      tags: ["imagem"],
      blocks: [
        { type: "heading", eyebrow: "Aula 14", text: "Para a máquina, imagem é matriz" },
        {
          type: "text",
          md: "- Escala de cinza: uma matriz de pixels, geralmente de **0 (preto) a 255 (branco)**.\n- Colorida (RGB): **três matrizes** (canais vermelho, verde e azul). Uma foto 100×100 RGB tem 100·100·3 = **30.000** números.\n\nUma rede densa comum ligaria cada pixel a cada neurônio: parâmetros demais e nenhuma noção de vizinhança. A **CNN** resolve isso.",
        },
      ],
    },
    {
      id: "convolucao",
      tags: ["convolucao"],
      blocks: [
        { type: "heading", eyebrow: "Aula 14", text: "Camada convolucional" },
        {
          type: "text",
          md: "Um **filtro** (kernel) pequeno **desliza** sobre a imagem. Em cada posição, multiplica elemento a elemento e soma: o resultado vira um valor do **mapa de ativação** (mapa de características).",
        },
        {
          type: "analogy",
          icon: "Search",
          concept: { title: "Filtro convolucional", description: "O mesmo detector de padrão é aplicado em todas as posições da imagem." },
          analogy: { title: "Lupa que procura riscos", description: "O inspetor passa a mesma lupa pela chapa inteira, quadradinho por quadradinho, anotando onde viu um risco." },
        },
      ],
    },
    {
      id: "convolucao-interativa",
      tags: ["convolucao"],
      blocks: [
        { type: "heading", eyebrow: "Mão na massa", text: "Deslize o filtro" },
        {
          type: "interactive-3d",
          sceneId: "convolution",
          caption: "Mova o filtro e veja a soma dos produtos virar uma célula do mapa de ativação. Compare \"Borda vertical\", o filtro da Aula 14 e a identidade.",
        },
      ],
    },
    {
      id: "conta-aula14",
      tags: ["convolucao"],
      blocks: [
        { type: "heading", eyebrow: "Aula 14 · slide 18", text: "Fazendo a conta" },
        {
          type: "code",
          language: "text",
          code: "Imagem 5×5                Filtro\n13  8 18 63  7            0 1 0\n 5  3  1  2 33            1 1 0\n 1  9  0  7 16            0 0 1\n 3 16  5  8 18\n 5  7 81 36  9\n\nCanto superior esquerdo: 8 + 5 + 3 + 0 = 16\n\nMapa de ativação (3×3):\n 16  29  82\n 18  18  27\n109  57  29",
        },
        { type: "callout", variant: "warning", md: "**Correção do material**: o mapa de ativação mostrado no slide 19 da Aula 14 não bate com a imagem e o filtro do slide 18. Refazendo a conta, o resultado correto é o acima." },
        {
          type: "mini-check",
          question: "Imagem 5×5, filtro 3×3, stride 1, sem padding. Qual o tamanho do mapa de ativação?",
          options: ["3×3", "5×5", "2×2", "4×4"],
          answerIndex: 0,
          explanation: "O = (I − K)/S + 1 = (5 − 3)/1 + 1 = 3.",
        },
      ],
    },
    {
      id: "tamanho-saida",
      tags: ["convolucao"],
      blocks: [
        { type: "heading", eyebrow: "Além do slide", text: "Stride, padding e tamanho da saída" },
        {
          type: "code",
          language: "text",
          code: "O = (I − K + 2P) / S + 1\n\nI tamanho da entrada   K tamanho do filtro\nP padding (bordas de zeros)   S stride (passo do filtro)\n\n32×32, K = 5, P = 0, S = 1  →  28×28\n32×32, K = 3, P = 1, S = 1  →  32×32  (padding \"same\")\n 7×7,  K = 3, P = 0, S = 2  →   3×3",
        },
        { type: "callout", variant: "tip", md: "Cada filtro gera **um** mapa. Uma camada com 32 filtros gera 32 mapas, cada um especializado num padrão (bordas, texturas, cantos...)." },
      ],
    },
    {
      id: "pooling-densa",
      tags: ["pooling", "cnn"],
      blocks: [
        { type: "heading", eyebrow: "Aula 14", text: "Pooling e camada densa" },
        {
          type: "code",
          language: "text",
          code: "Max pooling 2×2 (stride 2)\n\n15  9 |  4  2\n11  5 |  8  6          15   8\n------+------    →\n 8  7 |  3 17           8  17\n 2  3 |  7  3",
          caption: "Exemplo do slide 20: de cada janela, fica só o maior valor. Reduz as dimensões mantendo o essencial.",
        },
        {
          type: "steps",
          steps: [
            { title: "Convolução", description: "Filtros extraem padrões → mapas de ativação." },
            { title: "Pooling", description: "Reduz as dimensões (max pooling)." },
            { title: "Camada densa", description: "Totalmente conectada: combina tudo e classifica." },
          ],
        },
      ],
    },
    {
      id: "transfer",
      tags: ["cnn", "transfer"],
      blocks: [
        { type: "heading", eyebrow: "Aula 14 · momento interativo", text: "Treinando a primeira CNN" },
        {
          type: "code",
          language: "python",
          code: 'modelo = keras.Sequential([\n    keras.Input(shape=(28, 28, 1)),\n    keras.layers.Conv2D(32, 3, activation="relu"),\n    keras.layers.MaxPooling2D(2),\n    keras.layers.Flatten(),\n    keras.layers.Dense(10, activation="softmax"),\n])\nmodelo.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"])',
        },
        {
          type: "text",
          md: "**Transfer learning**: com poucas imagens da fábrica, reaproveita-se uma CNN já treinada em milhões de imagens (ImageNet), congelando as camadas que detectam bordas e texturas e retreinando só as últimas.",
        },
      ],
    },
    {
      id: "generativa",
      tags: ["generativa", "fundacionais"],
      blocks: [
        { type: "heading", eyebrow: "Aula 20", text: "IA generativa e modelos fundacionais" },
        {
          type: "comparison",
          left: { title: "IA discriminativa", points: ["Aprende a separar classes", "\"Esta peça tem defeito?\"", "Saída: rótulo ou número"] },
          right: { title: "IA generativa", points: ["Aprende a distribuição dos dados", "\"Gere a imagem de uma peça com defeito\"", "Saída: texto, imagem, áudio, código novos"] },
        },
        {
          type: "text",
          md: "**Modelos fundacionais (FMs)**: treinados em volumes enormes de dados não rotulados (self-supervised, módulo 10) e depois adaptados para muitas tarefas. **LLMs** são FMs de linguagem: preveem o próximo token. A Aula 20 mostra o StyleGAN gerando rostos que parecem reais.",
        },
      ],
    },
    {
      id: "prompt",
      tags: ["prompt", "alucinacao"],
      blocks: [
        { type: "heading", eyebrow: "Aula 20", text: "Engenharia de prompt" },
        { type: "callout", variant: "tip", md: "\"A qualidade do seu prompt implicará diretamente na qualidade da resposta.\"" },
        {
          type: "text",
          md: "- **Contexto e papel**: quem é o modelo e para quem responde\n- **Tarefa clara** e **formato da saída** (tabela, JSON, tópicos)\n- **Exemplos** (few-shot) quando o formato importa\n- **Restrições**: tamanho, tom, o que não fazer\n\n**Alucinação**: o modelo gera algo plausível, mas falso (uma citação inventada, um número errado). Ele prevê texto provável, não verifica fatos: confira o que importa.",
        },
      ],
    },
    {
      id: "resumo",
      tags: [],
      blocks: [
        {
          type: "summary",
          points: [
            "Tarefas: classificação, localização, detecção e segmentação (semântica e de instância).",
            "Imagem = matriz de pixels; RGB = 3 canais.",
            "Convolução: filtro desliza e soma produtos; O = (I − K + 2P)/S + 1.",
            "CNN: convolução → pooling (max) → camada densa. Transfer learning reaproveita redes treinadas.",
            "IA generativa cria conteúdo; modelos fundacionais se adaptam a muitas tarefas; prompt bom = resposta boa; cuidado com alucinação.",
          ],
        },
      ],
    },
  ],
});
