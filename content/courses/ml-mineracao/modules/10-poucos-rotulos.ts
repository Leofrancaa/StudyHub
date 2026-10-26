import { defineModule } from "@/lib/content/define";

/**
 * Fontes: Aula11 (cenário 10 mil de 100 mil rótulos, pseudo-labeling, medidas de confiança, estratégias de seleção,
 * self-training, active learning, human-in-the-loop, self-supervised), Mineração 1ª aula (Unidade 3: agrupamento,
 * associação, outliers). Fora do material: k-means, regras de associação (suporte, confiança, lift) e detecção de anomalias,
 * pois os slides da Unidade 3 ainda não estavam na pasta.
 */
export const module10 = defineModule({
  slug: "poucos-rotulos",
  title: "Aprender com poucos rótulos",
  description: "Agrupamento, associação, anomalias e como aproveitar dados sem rótulo com pseudo-labeling e active learning.",
  objectives: [
    "Aplicar k-means e regras de associação (suporte, confiança, lift)",
    "Explicar pseudo-labeling, medidas de confiança e self-training",
    "Escolher quando usar active learning e self-supervised learning",
  ],
  estimatedMinutes: 40,
  questionsPerAttempt: 10,
  slides: [
    {
      id: "abertura",
      tags: [],
      blocks: [
        { type: "heading", eyebrow: "Módulo 10", text: "Rótulo é caro. Dado sem rótulo é barato." },
        { type: "text", md: "Rotular custa tempo de especialista. Este módulo mostra como **encontrar estrutura sem rótulos** e como **multiplicar o valor de poucos rótulos**." },
        {
          type: "card-grid",
          columns: 3,
          cards: [
            { icon: "Network", title: "Não supervisionado", description: "Grupos, associações e anomalias." },
            { icon: "Layers", title: "Semi-supervisionado", description: "Pseudo-labeling e self-training." },
            { icon: "Users", title: "Humano no ciclo", description: "Active learning e self-supervised." },
          ],
        },
      ],
    },
    {
      id: "cenario",
      tags: ["cenario"],
      blocks: [
        { type: "heading", eyebrow: "Aula 11", text: "E se só 10% tivesse rótulo?" },
        { type: "text", md: "100 mil pedidos no Olist, mas só **10 mil** com `is_late` conhecido (0 ou 1) e **90 mil** com `is_late = null`." },
        {
          type: "card-grid",
          columns: 3,
          cards: [
            { icon: "Target", title: "Supervisionado", description: "Usa só os 10 mil rotulados." },
            { icon: "Network", title: "Não supervisionado", description: "Usa as features de todos, sem olhar rótulo." },
            { icon: "Layers", title: "Semi-supervisionado", description: "Usa os 10 mil rotulados E os 90 mil sem rótulo." },
          ],
        },
      ],
    },
    {
      id: "kmeans",
      tags: ["kmeans"],
      blocks: [
        { type: "heading", eyebrow: "Unidade 3 · agrupamento", text: "K-means" },
        {
          type: "steps",
          steps: [
            { title: "Escolher k", description: "Quantos grupos procurar." },
            { title: "Inicializar", description: "Posicionar k centróides (ex.: k-means++)." },
            { title: "Atribuir", description: "Cada ponto vai para o centróide mais próximo." },
            { title: "Atualizar", description: "Cada centróide vai para a média dos seus pontos." },
            { title: "Repetir", description: "Até as atribuições pararem de mudar." },
          ],
        },
      ],
    },
    {
      id: "kmeans-interativo",
      tags: ["kmeans"],
      blocks: [
        { type: "heading", eyebrow: "Mão na massa", text: "Rode o k-means passo a passo" },
        {
          type: "interactive-3d",
          sceneId: "kmeans",
          caption: "Alterne \"Atribuir\" e \"Mover centróides\" e acompanhe a inércia (soma das distâncias²) cair. Teste k = 2 e k = 5: o algoritmo sempre acha k grupos, mesmo que não façam sentido.",
        },
      ],
    },
    {
      id: "kmeans-cuidados",
      tags: ["kmeans"],
      blocks: [
        { type: "heading", eyebrow: "Na prática", text: "Cuidados com o k-means" },
        {
          type: "text",
          md: "- **Escolher k**: método do cotovelo (inércia × k) ou silhueta.\n- **Escala**: usa distância, então normalize.\n- **Inicialização**: começos ruins dão grupos ruins; k-means++ e várias execuções ajudam.\n- **Forma**: supõe grupos mais ou menos esféricos e de tamanho parecido.",
        },
        {
          type: "mini-check",
          question: "O que acontece com a inércia quando k aumenta?",
          options: ["Sempre cai (ou fica igual)", "Sempre sobe", "Fica constante", "Vira negativa"],
          answerIndex: 0,
          explanation: "Mais centróides, pontos mais perto deles. Por isso não se escolhe k minimizando a inércia: com k = n ela é zero. Procura-se o \"cotovelo\".",
        },
      ],
    },
    {
      id: "associacao",
      tags: ["associacao"],
      blocks: [
        { type: "heading", eyebrow: "Unidade 3 · associação", text: "Quem compra X também compra Y?" },
        {
          type: "code",
          language: "text",
          code: "100 cestas · pão em 40 · manteiga em 25 · pão E manteiga em 20\n\nSuporte(pão → manteiga)   = 20/100 = 0,20   (frequência da regra)\nConfiança(pão → manteiga) = 20/40  = 0,50   (P(manteiga | pão))\nLift                      = 0,50 / 0,25 = 2  (> 1: associação positiva)",
        },
        { type: "callout", variant: "tip", md: "Lift = 1 significa independência; lift < 1, que um item \"afasta\" o outro. Algoritmo clássico: **Apriori**." },
      ],
    },
    {
      id: "anomalias",
      tags: ["anomalias"],
      blocks: [
        { type: "heading", eyebrow: "Unidade 3 · outliers", text: "Detecção de anomalias" },
        {
          type: "text",
          md: "Encontrar o que foge do padrão sem precisar de exemplos rotulados de falha: transações estranhas, vibração anormal de um motor, peça fora do comum.\n\n- Estatística: **z-score** alto, regra de **1,5·IQR**\n- Modelos: **Isolation Forest** (anomalias são isoladas com poucas divisões), distância ao vizinho, autoencoders",
        },
      ],
    },
    {
      id: "pseudo-labeling",
      tags: ["pseudo-labeling"],
      blocks: [
        { type: "heading", eyebrow: "Aula 11", text: "Pseudo-labeling" },
        {
          type: "steps",
          steps: [
            { title: "Treinar o modelo inicial", description: "Só com os exemplos rotulados por humanos." },
            { title: "Prever os não rotulados", description: "Gerar probabilidades para os 90 mil pedidos." },
            { title: "Selecionar os confiáveis", description: "Aplicar um limiar de confiança." },
            { title: "Criar o conjunto aumentado", description: "Rótulos reais + pseudo-rótulos aceitos." },
            { title: "Retreinar", description: "Repetir enquanto melhorar na validação." },
          ],
        },
        { type: "callout", variant: "warning", md: "O desafio, segundo a Aula 11, é **medir a confiança e traçar o limiar**. Limiar baixo aceita pseudo-rótulos errados." },
      ],
    },
    {
      id: "confianca",
      tags: ["confianca"],
      blocks: [
        { type: "heading", eyebrow: "Aula 11", text: "Medir confiança e escolher quem entra" },
        {
          type: "comparison",
          left: {
            title: "Medidas de confiança",
            points: ["Maior probabilidade (MPP): maior = mais confiante", "Margem p₁ − p₂: maior = mais confiante", "Entropia: MENOR = mais confiante", "Consistência e incerteza entre versões do modelo"],
          },
          right: {
            title: "Estratégias de seleção",
            points: ["Limiar fixo (ex.: ≥ 0,95)", "Limiar por classe", "Top-k mais confiáveis", "Percentil/quantil", "Limiar adaptativo durante o treino"],
          },
        },
        {
          type: "mini-check",
          question: "Previsão [atrasa 0,51; no prazo 0,49]. A margem é:",
          options: ["0,02 (pouca confiança)", "0,51", "1,00", "0,49"],
          answerIndex: 0,
          explanation: "Margem = 0,51 − 0,49 = 0,02: o modelo está quase em dúvida total.",
        },
      ],
    },
    {
      id: "self-training",
      tags: ["self-training"],
      blocks: [
        { type: "heading", eyebrow: "Aula 11", text: "Self-training" },
        {
          type: "code",
          language: "text",
          code: "L = (1/N_L) · Σ ℓ(f(xᵢ), yᵢ)  +  λ · (1/N_P) · Σ ℓ(f(xⱼ), ŷⱼ)\n       erro nos rótulos reais          erro nos pseudo-rótulos",
          caption: "Pseudo-labeling cria os rótulos; self-training é o processo iterativo de retreinar o próprio modelo com eles. λ controla quanto confiar nos pseudo-rótulos.",
        },
        {
          type: "analogy",
          icon: "Lightbulb",
          concept: { title: "Viés de confirmação no self-training", description: "Se o modelo aceita os próprios erros como verdade, ele os reforça a cada rodada." },
          analogy: { title: "Estudar pelo próprio gabarito", description: "Corrigir a lista com as suas respostas \"mais seguras\" ajuda se elas estão certas; se estão erradas, você decora o erro." },
        },
      ],
    },
    {
      id: "active-learning",
      tags: ["active-learning"],
      blocks: [
        { type: "heading", eyebrow: "Aula 11", text: "Active learning e human-in-the-loop" },
        {
          type: "text",
          md: "Em vez de rotular aleatoriamente, o modelo **pergunta**: \"quais exemplos você não consegue decidir e gostaria que um humano rotulasse?\". Escolha casos **informativos e diversos**.\n\nCiclo: treinar → consultar → anotar → acrescentar → treinar.\n\n- **Menor confiança**: 1 − maior probabilidade\n- **Margem**: menor diferença entre as duas maiores\n- **Entropia**: maior incerteza total",
        },
        { type: "callout", variant: "fun", md: "No **human-in-the-loop**, o especialista revisa as dúvidas do modelo continuamente; foi o tema da tese de doutorado do professor (PUC-Rio)." },
      ],
    },
    {
      id: "self-supervised",
      tags: ["self-supervised"],
      blocks: [
        { type: "heading", eyebrow: "Aula 11", text: "Self-supervised learning" },
        {
          type: "text",
          md: "O modelo aprende com dados **sem rótulo**, criando automaticamente uma tarefa a partir da própria estrutura dos dados:\n\n- **Texto**: esconder uma palavra (\"pagou com [MASK]\") e prever qual era\n- **Imagem**: prever um pedaço recortado ou a rotação aplicada\n- **Tabela**: esconder uma coluna e prevê-la\n\nO que ele aprende (representações) é depois ajustado com poucos rótulos. É a base dos grandes modelos de linguagem.",
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
            "K-means alterna atribuir e mover centróides; escolha k pelo cotovelo e normalize.",
            "Associação: suporte, confiança e lift (> 1 = associação positiva).",
            "Pseudo-labeling: aceitar previsões confiáveis como rótulos; o desafio é o limiar.",
            "Confiança: MPP e margem (maior = mais confiante), entropia (menor = mais confiante).",
            "Active learning pergunta ao humano os casos mais incertos; self-supervised cria a tarefa a partir dos dados.",
          ],
        },
      ],
    },
  ],
});
