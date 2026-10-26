import { defineModule } from "@/lib/content/define";

/**
 * Fontes: MD 15 (viés-variância, regularização L1/L2, bagging, Random Forest, AdaBoost, Gradient Boosting,
 * XGBoost, stacking), Aula10 (XAI, previsão × explicação, SHAP no Olist).
 * Fora do material: valores de Shapley, aditividade, valor base e limitações do SHAP.
 * Correções: no stacking o meta-modelo recebe as previsões dos modelos base (MD 15 s33);
 * Lasso não é um detector de correlação (MD 15 s13–14).
 */
export const module09 = defineModule({
  slug: "ensembles-xai",
  title: "Ensembles e explicabilidade",
  description: "Combinar modelos para errar menos e explicar o que levou cada previsão.",
  objectives: [
    "Diferenciar bagging, boosting e stacking e o que cada um reduz",
    "Explicar Random Forest, AdaBoost, Gradient Boosting, XGBoost e regularização L1/L2",
    "Interpretar valores SHAP locais e globais sem confundir com causalidade",
  ],
  estimatedMinutes: 40,
  questionsPerAttempt: 10,
  slides: [
    {
      id: "abertura",
      tags: [],
      blocks: [
        { type: "heading", eyebrow: "Módulo 9", text: "Vários modelos, uma decisão melhor" },
        { type: "text", md: "Em dados tabulares, os campeões costumam ser **ensembles de árvores**. Mas quem opera o negócio não aceita só a nota: quer saber **por que** um pedido parece arriscado." },
        {
          type: "card-grid",
          columns: 3,
          cards: [
            { icon: "Users", title: "Ensembles", description: "Bagging, boosting e stacking." },
            { icon: "ShieldCheck", title: "Regularização", description: "L1 e L2 contra o sobreajuste." },
            { icon: "Eye", title: "Explicabilidade", description: "SHAP: quanto cada feature empurrou a previsão." },
          ],
        },
      ],
    },
    {
      id: "ideia-ensemble",
      tags: ["ensemble"],
      blocks: [
        { type: "heading", eyebrow: "MD 15", text: "O que é Ensemble Learning" },
        { type: "text", md: "Combinar dois ou mais modelos base para produzir previsões mais precisas. Funciona melhor quando os modelos **erram de formas diferentes**: os erros se compensam." },
        {
          type: "analogy",
          icon: "Users",
          concept: { title: "Ensemble", description: "Vários modelos imperfeitos e diferentes, combinados, superam cada um isoladamente." },
          analogy: { title: "Pedir ajuda aos universitários", description: "Um aluno pode errar; a resposta mais votada de uma turma inteira erra bem menos, desde que cada um tenha pensado sozinho." },
        },
      ],
    },
    {
      id: "bagging",
      tags: ["bagging"],
      blocks: [
        { type: "heading", eyebrow: "MD 15", text: "Bagging (Bootstrap Aggregating)" },
        {
          type: "steps",
          steps: [
            { title: "Bootstrap", description: "Sortear várias amostras do treino COM reposição: alguns exemplos repetem, outros ficam de fora." },
            { title: "Treinar em paralelo", description: "Um modelo base independente em cada amostra (homogêneo: geralmente árvores)." },
            { title: "Agregar", description: "Classificação: votação. Regressão: média." },
          ],
        },
        { type: "callout", variant: "tip", md: "Objetivo: **reduzir a variância**. Árvores fundas variam muito com os dados; a média de muitas é estável." },
      ],
    },
    {
      id: "random-forest",
      tags: ["random-forest"],
      blocks: [
        { type: "heading", eyebrow: "MD 15", text: "Random Forest" },
        {
          type: "text",
          md: "Bagging de árvores com uma aleatoriedade extra: em cada divisão, cada árvore só pode escolher entre um **subconjunto aleatório de features**. Isso deixa as árvores menos parecidas entre si (menos correlacionadas), e a média fica ainda melhor.\n\n- Classificação: **votação** · Regressão: **média**\n- Previsões das árvores são **independentes** (paralelizável)",
        },
        {
          type: "mini-check",
          question: "O que diferencia a Random Forest de um bagging comum de árvores?",
          options: ["Usa boosting", "Sorteia um subconjunto de features em cada divisão", "Usa uma única árvore", "Treina sequencialmente"],
          answerIndex: 1,
          explanation: "A amostragem de features descorrelaciona as árvores. O resto (bootstrap, votação) é bagging.",
        },
      ],
    },
    {
      id: "boosting",
      tags: ["boosting"],
      blocks: [
        { type: "heading", eyebrow: "MD 15", text: "Boosting: aprender com os próprios erros" },
        {
          type: "text",
          md: "Treina modelos **fracos em sequência**; cada novo modelo foca no que os anteriores erraram. Objetivo principal: **reduzir o viés**.",
        },
        {
          type: "card-grid",
          columns: 3,
          cards: [
            { icon: "Target", title: "AdaBoost", description: "Aumenta o peso das amostras erradas. Rápido; sensível a ruído e outliers." },
            { icon: "ChartLine", title: "Gradient Boosting", description: "Cada modelo prevê o erro residual do anterior, seguindo o gradiente negativo da perda." },
            { icon: "Zap", title: "XGBoost", description: "Gradient Boosting otimizado: regularização L1/L2, poda e velocidade. Muito usado." },
          ],
        },
      ],
    },
    {
      id: "bagging-boosting",
      tags: ["bagging", "boosting"],
      blocks: [
        { type: "heading", eyebrow: "Comparando", text: "Paralelo × sequencial" },
        {
          type: "comparison",
          left: { title: "Bagging / Random Forest", points: ["Modelos independentes, em paralelo", "Reduz variância", "Robusto a ruído", "Base: árvores fundas"] },
          right: { title: "Boosting", points: ["Modelos em sequência, dependentes", "Reduz viés", "Pode sobreajustar ruído se treinar demais", "Base: modelos fracos (árvores rasas)"] },
        },
      ],
    },
    {
      id: "stacking",
      tags: ["stacking"],
      blocks: [
        { type: "heading", eyebrow: "MD 15", text: "Stacking" },
        {
          type: "text",
          md: "Modelos base **heterogêneos** (ex.: regressão logística, árvore, KNN) fazem previsões; um **meta-modelo** aprende a combinar essas previsões para prever o alvo.\n\nAs previsões usadas para treinar o meta-modelo precisam ser **out-of-fold** (feitas em dados que cada modelo base não viu), senão o meta-modelo aprende com previsões otimistas.",
        },
        {
          type: "callout",
          variant: "warning",
          title: "Correção ao material",
          md: "O MD 15 diz que o meta-modelo \"não utiliza as variáveis preditoras, apenas a variável dependente\". Mais preciso: as **entradas** do meta-modelo são as previsões dos modelos base, e o **alvo** continua sendo y.",
        },
      ],
    },
    {
      id: "regularizacao",
      tags: ["regularizacao"],
      blocks: [
        { type: "heading", eyebrow: "MD 15", text: "Regularização L1 e L2" },
        { type: "text", md: "Acrescenta à perda uma **penalidade pelo tamanho dos pesos**: diminui a variância ao custo de um pouco de viés." },
        {
          type: "comparison",
          left: { title: "Lasso (L1): λ · Σ|w|", points: ["Pode zerar pesos → seleciona features", "Bom quando poucas features importam (esparso)", "Entre features correlacionadas, tende a ficar com uma, de forma instável"] },
          right: { title: "Ridge (L2): λ · Σw²", points: ["Encolhe pesos em direção a zero, sem zerar", "Bom quando muitas features contribuem", "Distribui o peso entre features correlacionadas"] },
        },
      ],
    },
    {
      id: "xai",
      tags: ["xai"],
      blocks: [
        { type: "heading", eyebrow: "Aula 10", text: "Previsão × explicação" },
        {
          type: "text",
          md: "**Explainable AI (XAI)**: técnicas para tornar o comportamento e as decisões de modelos compreensíveis para pessoas.\n\nNo Olist, o modelo diz \"este pedido tem 78% de risco\". O gestor quer saber: **foi o prazo prometido? o número de vendedores? o frete? o estado?**",
        },
      ],
    },
    {
      id: "shap-ideia",
      tags: ["shap"],
      blocks: [
        { type: "heading", eyebrow: "Aula 10", text: "SHAP: dividir o crédito da previsão" },
        {
          type: "code",
          language: "text",
          code: "previsão(pedido) = valor base + Σ contribuições SHAP\n\nvalor base   = previsão média do modelo nos dados de referência\nSHAP > 0     = a feature empurrou a previsão para cima\nSHAP < 0     = empurrou para baixo",
        },
        {
          type: "text",
          md: "Vem dos **valores de Shapley** (teoria dos jogos): quanto cada jogador contribuiu para o resultado de um time. Aqui, os jogadores são as features e o resultado é a previsão.",
        },
      ],
    },
    {
      id: "shap-local-global",
      tags: ["shap"],
      blocks: [
        { type: "heading", eyebrow: "Aula 10 · momento interativo", text: "Local e global" },
        {
          type: "code",
          language: "python",
          code: "import shap\n\nexplainer = shap.TreeExplainer(modelo)\nsv = explainer(X_test)\n\nshap.plots.waterfall(sv[0])   # LOCAL: por que ESTE pedido?\nshap.plots.beeswarm(sv)       # GLOBAL: o que mais pesa no modelo?",
          caption: "Instalação no projeto: uv add shap. TreeExplainer é rápido para modelos de árvore.",
        },
        { type: "callout", variant: "tip", md: "**Local** explica uma previsão (o operador). **Global** resume a importância média |SHAP| em toda a base (o gestor e o cientista)." },
      ],
    },
    {
      id: "shap-limites",
      tags: ["shap-limites"],
      blocks: [
        { type: "heading", eyebrow: "Cuidado", text: "O que o SHAP não diz" },
        {
          type: "card-grid",
          columns: 3,
          cards: [
            { icon: "Scale", title: "Não é causalidade", description: "Explica o MODELO, não o mundo. Frete alto empurrar o risco não prova que o frete causa atraso." },
            { icon: "Layers", title: "Features correlacionadas", description: "Dividem o crédito entre si; uma pode parecer pouco importante só porque a outra \"levou\" a contribuição." },
            { icon: "Search", title: "Depende do modelo", description: "Modelo errado ou com vazamento gera explicações convincentes e erradas." },
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
            "Bagging: amostras bootstrap, modelos em paralelo, reduz variância. Random Forest sorteia features por divisão.",
            "Boosting: modelos fracos em sequência corrigindo erros, reduz viés (AdaBoost, Gradient Boosting, XGBoost).",
            "Stacking: meta-modelo aprende a combinar previsões out-of-fold de modelos heterogêneos.",
            "L1 (Lasso) pode zerar pesos; L2 (Ridge) só encolhe.",
            "SHAP: previsão = base + contribuições; local × global; explica o modelo, não a causa.",
          ],
        },
      ],
    },
  ],
});
