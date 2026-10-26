import { defineModule } from "@/lib/content/define";

/**
 * Fontes: MD 08 (KNN e exemplo das frutas), MD 09 (Teorema de Bayes, Naive Bayes, compradores de computador),
 * MD 14 (regressão linear por MQO, árvore de regressão), MD 12 (regressão logística passo a passo, Challenger),
 * Aula12 (relembrando a logística). Fora do material: índice de Gini e entropia em detalhe.
 * Correções: K ímpar só evita empate em classificação binária (MD 08 s7); o MD 14 arredonda m antes de prever 69,61 kg.
 */
export const module08 = defineModule({
  slug: "algoritmos-classicos",
  title: "Algoritmos clássicos",
  description: "KNN, Naive Bayes, regressão linear, regressão logística e árvores de decisão: como cada um pensa.",
  objectives: [
    "Classificar um exemplo com KNN e explicar o efeito de k e da escala",
    "Aplicar o Teorema de Bayes e o Naive Bayes a um caso numérico",
    "Ajustar e interpretar regressão linear, regressão logística e árvores",
  ],
  estimatedMinutes: 45,
  questionsPerAttempt: 10,
  slides: [
    {
      id: "abertura",
      tags: [],
      blocks: [
        { type: "heading", eyebrow: "Módulo 8", text: "Cinco jeitos de aprender com dados" },
        { type: "text", md: "Cada algoritmo faz uma suposição diferente sobre o mundo. Entender essa suposição é o que permite escolher o certo e explicar por que ele erra." },
        {
          type: "card-grid",
          columns: 3,
          cards: [
            { icon: "Users", title: "Vizinhança", description: "KNN: parecido com quem está perto." },
            { icon: "Scale", title: "Probabilidade", description: "Naive Bayes: evidências atualizam crenças." },
            { icon: "ChartLine", title: "Funções e regras", description: "Regressões ajustam curvas; árvores fazem perguntas." },
          ],
        },
      ],
    },
    {
      id: "knn",
      tags: ["knn"],
      blocks: [
        { type: "heading", eyebrow: "MD 08", text: "KNN: K vizinhos mais próximos" },
        {
          type: "steps",
          steps: [
            { title: "Medir distâncias", description: "Do ponto novo até todos os pontos de treino." },
            { title: "Ordenar", description: "Do mais próximo ao mais distante." },
            { title: "Pegar os K primeiros", description: "Os vizinhos mais próximos." },
            { title: "Votar", description: "Classificação: classe mais frequente. Regressão: média dos vizinhos." },
          ],
        },
        { type: "callout", variant: "fun", md: "O KNN não tem fase de treino de verdade: ele guarda os dados e faz todo o trabalho na hora de prever (\"lazy learner\")." },
      ],
    },
    {
      id: "analogia-vizinhos",
      tags: ["knn"],
      blocks: [
        {
          type: "analogy",
          icon: "Users",
          concept: { title: "KNN", description: "A classe de um ponto é decidida pelos K exemplos mais parecidos com ele." },
          analogy: { title: "\"Diga-me com quem andas\"", description: "Para adivinhar o time de alguém, você olha os 5 amigos mais próximos: se 4 são torcedores do Bahia, aposta no Bahia." },
        },
      ],
    },
    {
      id: "knn-detalhes",
      tags: ["knn"],
      blocks: [
        { type: "heading", eyebrow: "MD 08", text: "K, distância e escala" },
        {
          type: "text",
          md: "- **K pequeno** (1): sensível a ruído → overfitting. **K grande**: fronteira suave demais → underfitting.\n- K ímpar evita empate **em problemas de duas classes**; com 3+ classes ainda pode empatar.\n- **Euclidiana**: linha reta, a mais usada. **Manhattan**: soma das diferenças, como andar em quarteirões.\n- **Normalize antes**: peso em gramas (120–170) esmagaria textura (2–9).",
        },
        {
          type: "mini-check",
          question: "Frutas normalizadas: nova (0,80; 0,71). Distâncias: A maçã 0,25 · B maçã 0,35 · D pera 0,93 · C pera 0,98. Com K = 3, qual a classe?",
          options: ["Pera", "Maçã", "Empate", "Impossível decidir"],
          answerIndex: 1,
          explanation: "Os 3 mais próximos são A (maçã), B (maçã) e D (pera): 2 × 1 para maçã. É o exemplo do MD 08.",
        },
      ],
    },
    {
      id: "knn-interativo",
      tags: ["knn"],
      blocks: [
        { type: "heading", eyebrow: "Mão na massa", text: "Mova o ponto novo e mude o K" },
        {
          type: "interactive-3d",
          sceneId: "knn-space",
          caption: "Leve o ponto amarelo para a fronteira entre as nuvens e varie k: com k = 1 a decisão muda a cada passo; com k alto ela fica estável, mas pode ignorar detalhes locais.",
        },
      ],
    },
    {
      id: "bayes-teorema",
      tags: ["bayes"],
      blocks: [
        { type: "heading", eyebrow: "MD 09", text: "Teorema de Bayes" },
        {
          type: "code",
          language: "text",
          code: "P(A | B) = P(B | A) · P(A) / P(B)\n\nP(A)       a priori: crença antes da evidência\nP(B | A)   verossimilhança: chance da evidência se A for verdade\nP(A | B)   a posteriori: crença atualizada",
        },
        {
          type: "text",
          md: "**Naive Bayes** calcula a probabilidade de cada classe dada as features e escolhe a maior. É \"ingênuo\" porque **assume que as features são independentes entre si** dentro de cada classe, e por isso multiplica as probabilidades.",
        },
      ],
    },
    {
      id: "bayes-exemplo",
      tags: ["bayes"],
      blocks: [
        { type: "heading", eyebrow: "MD 09 · quem compra computador?", text: "Naive Bayes na mão" },
        {
          type: "code",
          language: "text",
          code: "Cliente: idade ≤ 30, renda média, estudante, crédito bom\n\nP(sim) = 9/14 = 0,643        P(não) = 5/14 = 0,357\nsim: 0,222 · 0,444 · 0,667 · 0,667 · 0,643 ≈ 0,028\nnão: 0,600 · 0,400 · 0,200 · 0,600 · 0,357 ≈ 0,010\n\nNormalizando: P(sim | X) = 0,028 / 0,038 ≈ 73,7%",
          caption: "O slide chama esses produtos de P(X|classe); na verdade são P(X|classe) · P(classe), ainda sem normalizar.",
        },
        {
          type: "callout",
          variant: "tip",
          title: "Variantes",
          md: "**Gaussiana** (contínuas, assume normal), **Categórica**, **Multinomial** (contagens, ex.: palavras em spam) e **Bernoulli** (presença/ausência).",
        },
      ],
    },
    {
      id: "regressao-linear",
      tags: ["regressao-linear"],
      blocks: [
        { type: "heading", eyebrow: "MD 14", text: "Regressão linear e mínimos quadrados" },
        {
          type: "text",
          md: "Ajusta **y = m·x + b** escolhendo m e b que minimizam a soma dos erros ao quadrado (**MQO**). Simples: uma feature. Múltipla: várias.\n\nExemplo do MD 14 (altura × peso, 9 pessoas): **m ≈ 0,53** e **b ≈ −20,08**. Para 170 cm: ≈ **69,6 kg**.",
        },
        {
          type: "callout",
          variant: "warning",
          title: "Detalhe numérico",
          md: "Com m arredondado (0,53 · 170 − 20,08) dá 70,02 kg. O 69,61 do slide vem do m sem arredondar (0,5276). Arredonde só no fim.",
        },
      ],
    },
    {
      id: "regressao-interativa",
      tags: ["regressao-linear"],
      blocks: [
        {
          type: "interactive-3d",
          sceneId: "regression-fit",
          caption: "Ajuste a reta à mão e depois clique em \"Mostrar o ajuste do treino (MQO)\": é a reta que deixa o MSE mínimo.",
        },
      ],
    },
    {
      id: "logistica",
      tags: ["logistica"],
      blocks: [
        { type: "heading", eyebrow: "MD 12", text: "Regressão logística: classificação com probabilidade" },
        {
          type: "text",
          md: "Na véspera do Challenger (1986), a NASA olhou só os voos **com falha** nos anéis de vedação e concluiu que a temperatura era \"inconclusiva\". Com todos os dados, uma logística mostraria o risco subindo no frio.\n\nUma reta não serve para 0/1: ela sai de [0, 1]. A **sigmoide** σ(z) = 1/(1 + e^(−z)) espreme qualquer z numa **probabilidade**.",
        },
        { type: "callout", variant: "fun", title: "Pergunta de plateia", md: "\"Se é classificação, por que se chama regressão?\" Porque ela é uma regressão do **log-odds** (log da chance); a classe só aparece quando se aplica o limiar." },
      ],
    },
    {
      id: "logistica-passos",
      tags: ["logistica"],
      blocks: [
        { type: "heading", eyebrow: "MD 12 · aprovado no EDAG?", text: "Os cinco passos com números" },
        {
          type: "steps",
          steps: [
            { title: "Combinação linear", description: "x = 4 horas, w = 1,5, b = −3 → z = 1,5·4 − 3 = 3." },
            { title: "Sigmoide", description: "ŷ = σ(3) ≈ 0,9526: 95% de chance de aprovação." },
            { title: "Perda (entropia cruzada)", description: "y = 1 → L = −ln(0,9526) ≈ 0,0486." },
            { title: "Gradiente descendente", description: "∂L/∂w = (ŷ − y)·x = −0,1896; w ← 1,5 − 0,1·(−0,1896) = 1,519." },
            { title: "Predição", description: "ŷ ≥ 0,5 → classe 1 (aprovado). Multiclasse usa softmax e entropia cruzada categórica." },
          ],
        },
      ],
    },
    {
      id: "arvores",
      tags: ["arvores"],
      blocks: [
        { type: "heading", eyebrow: "MD 07 · MD 14", text: "Árvores de decisão" },
        {
          type: "text",
          md: "Fazem uma sequência de perguntas (\"prazo < 5 dias?\") até chegar a uma folha. Cada divisão escolhe a pergunta que deixa os grupos mais **puros**:\n\n- **Gini** = 1 − Σp². Nó com 8 sim e 2 não: 1 − (0,8² + 0,2²) = **0,32**.\n- **Entropia** = −Σ p·log₂p (0 = puro).\n\nNa **árvore de regressão** (CART, função `rpart` com `method = \"anova\"`), a folha prevê a **média** dos exemplos dela. **Poda** e profundidade máxima evitam overfitting.",
        },
      ],
    },
    {
      id: "comparacao",
      tags: ["comparacao"],
      blocks: [
        { type: "heading", eyebrow: "Quando usar cada um", text: "Pontos fortes e fracos" },
        {
          type: "card-grid",
          columns: 2,
          cards: [
            { icon: "Users", title: "KNN", description: "Simples e sem treino; lento para prever em bases grandes e sensível à escala." },
            { icon: "Scale", title: "Naive Bayes", description: "Muito rápido, ótimo com texto; a suposição de independência raramente é verdadeira." },
            { icon: "ChartLine", title: "Regressão linear/logística", description: "Interpretáveis (coeficientes); só capturam relações lineares sem features extras." },
            { icon: "Workflow", title: "Árvore", description: "Explicável como regras, aceita escalas diferentes; uma árvore funda decora o treino." },
          ],
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
            "KNN: distância + voto dos K vizinhos; normalize; k pequeno overfit, k grande underfit.",
            "Bayes: posteriori ∝ verossimilhança × priori. Naive assume features independentes.",
            "Regressão linear: MQO minimiza a soma dos erros ao quadrado.",
            "Logística: z linear → sigmoide → probabilidade → entropia cruzada → gradiente → limiar.",
            "Árvores: perguntas que maximizam a pureza (Gini/entropia); poda contra overfitting.",
          ],
        },
      ],
    },
  ],
});
