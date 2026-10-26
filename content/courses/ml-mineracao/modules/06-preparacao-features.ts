import { defineModule } from "@/lib/content/define";

/**
 * Fontes: Aula06 (data leakage no Olist, feature engineering, encoding, transformação, seleção filtro/wrapper/embarcada),
 * MD 06 Mineração (limpeza, binarização, normalização, seleção, extração/PCA), MD 07 (seleção por correlação, PCA).
 * Fora do material: z-score, Pipeline/ColumnTransformer do scikit-learn e a tipologia de vazamentos.
 */
export const module06 = defineModule({
  slug: "preparacao-features",
  title: "Preparação de dados e features",
  description: "Limpar, codificar, escalar e selecionar atributos sem deixar o futuro vazar para o treino.",
  objectives: [
    "Tratar faltantes, inconsistências e codificar variáveis categóricas corretamente",
    "Aplicar normalização e padronização ajustando só com o treino",
    "Identificar data leakage e escolher métodos de seleção de atributos",
  ],
  estimatedMinutes: 35,
  questionsPerAttempt: 10,
  slides: [
    {
      id: "abertura",
      tags: [],
      blocks: [
        { type: "heading", eyebrow: "Módulo 6", text: "O modelo só vê o que você entrega" },
        { type: "text", md: "Boa parte do desempenho de um modelo vem da **preparação**: dados limpos, features que fazem sentido e, acima de tudo, **nenhuma informação do futuro**." },
        {
          type: "card-grid",
          columns: 3,
          cards: [
            { icon: "Wrench", title: "Limpeza", description: "Faltantes, inconsistências e valores impossíveis." },
            { icon: "Code", title: "Transformação", description: "Criar, codificar e escalar features." },
            { icon: "ShieldCheck", title: "Sem vazamento", description: "Só o que se sabe no momento da previsão." },
          ],
        },
      ],
    },
    {
      id: "faltantes",
      tags: ["faltantes"],
      blocks: [
        { type: "heading", eyebrow: "MD 06", text: "Dados faltantes" },
        {
          type: "card-grid",
          columns: 2,
          cards: [
            { icon: "Search", title: "Entender o motivo", description: "Falta por erro, ou porque o evento não aconteceu? A ausência pode ser informação." },
            { icon: "Wrench", title: "Remover", description: "Linhas ou colunas com muitos faltantes, se a perda for pequena." },
            { icon: "Calculator", title: "Imputar", description: "Média ou mediana (numéricas), moda (categóricas), ou um modelo." },
            { icon: "Target", title: "Sinalizar", description: "Criar uma coluna \"era_faltante\" preserva o fato de que faltava." },
          ],
        },
      ],
    },
    {
      id: "inconsistencias",
      tags: ["inconsistencias"],
      blocks: [
        { type: "heading", eyebrow: "MD 06 · base de crédito", text: "Codificação distinta e valores impossíveis" },
        {
          type: "text",
          md: "Na base do MD 06 aparecem: sexo escrito como **\"F\"**, **\"Feminino\"**, **\"M\"** e **\"Masculino\"**; anos de experiência **150** e **−10**.\n\n- Padronize categorias para um único código.\n- Valores fisicamente impossíveis são erro: corrija na fonte ou trate como faltante.",
        },
        {
          type: "mini-check",
          question: "\"Anos de experiência = −10\" é um problema de:",
          options: ["Codificação distinta", "Valor inconsistente (impossível)", "Duplicata", "Desbalanceamento"],
          answerIndex: 1,
          explanation: "Experiência negativa não existe: é valor inválido/inconsistente, não uma forma diferente de escrever a mesma coisa.",
        },
      ],
    },
    {
      id: "engenharia",
      tags: ["engenharia"],
      blocks: [
        { type: "heading", eyebrow: "Aula 06", text: "Feature engineering: criar atributos" },
        {
          type: "text",
          md: "Transformar dados brutos em sinais que o modelo consegue usar:\n\n- idade → **maior_de_idade** (0/1)\n- data de compra → **mês**, **dia da semana**\n- prazo prometido − data de aprovação → **dias de prazo**\n- itens do pedido → **n_itens**, **n_vendedores**\n- salário mensal → **renda anual** (agregação)",
        },
        { type: "callout", variant: "tip", md: "Conhecimento de domínio gera as melhores features. Quem conhece a logística sabe que **dezembro** e **distância** importam." },
      ],
    },
    {
      id: "encoding",
      tags: ["encoding"],
      blocks: [
        { type: "heading", eyebrow: "Aula 06", text: "Feature encoding" },
        {
          type: "comparison",
          left: {
            title: "One-hot encoding",
            points: ["Uma coluna 0/1 por categoria", "olhos = azuis, verdes, castanhos → 3 colunas", "Sem ordem falsa", "Muitas categorias = muitas colunas"],
          },
          right: {
            title: "Label / ordinal encoding",
            points: ["Um número por categoria", "Custo baixo=1, médio=2, alto=3, muito alto=4", "Certo quando HÁ ordem", "Em categoria sem ordem, inventa uma"],
          },
          verdict: "Nominal (sem ordem) → one-hot. Ordinal (com ordem) → label/ordinal.",
        },
      ],
    },
    {
      id: "analogia-cores",
      tags: ["encoding"],
      blocks: [
        {
          type: "analogy",
          icon: "Lightbulb",
          concept: { title: "Label encoding em variável nominal", description: "Codificar azul=1, verde=2, castanho=3 faz o modelo achar que castanho é \"maior\" que azul." },
          analogy: { title: "Numerar camisas de time", description: "A camisa 10 não é duas vezes a camisa 5. O número só identifica, mas o modelo vai tratá-lo como quantidade." },
        },
      ],
    },
    {
      id: "escala",
      tags: ["escala"],
      blocks: [
        { type: "heading", eyebrow: "MD 06 · Aula 06", text: "Normalização e padronização" },
        {
          type: "code",
          language: "text",
          code: "Min-max:      x' = (x − min) / (max − min)        → [0, 1]\nPadronização: z  = (x − média) / desvio padrão   → média 0, desvio 1\n\nMD 06: score 720, min 520, max 950 → (720 − 520) / 430 = 0,4651",
        },
        {
          type: "text",
          md: "Modelos baseados em **distância** (KNN), **gradiente** (regressão logística, redes) e **regularização** sofrem quando uma feature vai de 0 a 1 e outra de 0 a 100.000. Árvores, em geral, não ligam para escala.",
        },
      ],
    },
    {
      id: "fit-no-treino",
      tags: ["escala", "leakage"],
      blocks: [
        { type: "heading", eyebrow: "Regra de ouro", text: "Ajuste no treino, aplique no teste" },
        {
          type: "code",
          language: "python",
          code: 'pre = ColumnTransformer([\n    ("num", Pipeline([("imp", SimpleImputer(strategy="median")),\n                      ("esc", StandardScaler())]), num_cols),\n    ("cat", OneHotEncoder(handle_unknown="ignore"), cat_cols),\n])\nmodelo = Pipeline([("pre", pre), ("clf", LogisticRegression(max_iter=1000))])\nmodelo.fit(X_train, y_train)   # mediana, média e categorias vêm SÓ do treino\nmodelo.score(X_test, y_test)',
          caption: "Com Pipeline, a imputação e a escala são reaprendidas em cada fold da validação, sem espiar o teste.",
        },
      ],
    },
    {
      id: "leakage",
      tags: ["leakage"],
      blocks: [
        { type: "heading", eyebrow: "Aula 06 · leitura obrigatória", text: "Data leakage no Olist" },
        { type: "text", md: "Vazamento é treinar com informação que **não estaria disponível no momento da previsão**. O modelo fica ótimo no teste e inútil na vida real." },
        {
          type: "comparison",
          left: { title: "O que já sabemos (pode usar)", points: ["Data da compra e da aprovação", "Prazo prometido", "Produtos e vendedores", "Preço, frete e estado do cliente"] },
          right: { title: "O que não conhecemos (vazamento)", points: ["Data real da entrega", "Data de envio à transportadora", "Avaliação do cliente", "Status final do pedido"] },
        },
      ],
    },
    {
      id: "tipos-leakage",
      tags: ["leakage"],
      blocks: [
        { type: "heading", eyebrow: "Onde o vazamento se esconde", text: "Três armadilhas comuns" },
        {
          type: "card-grid",
          columns: 3,
          cards: [
            { icon: "Gauge", title: "Informação do futuro", description: "Features que só existem depois do evento (avaliação, data de entrega)." },
            { icon: "Layers", title: "Pré-processar antes do split", description: "Escalar ou imputar com a base inteira deixa estatísticas do teste no treino." },
            { icon: "Users", title: "Mesmo grupo dos dois lados", description: "Pedidos do mesmo cliente ou exames do mesmo paciente no treino e no teste." },
          ],
        },
        {
          type: "mini-check",
          question: "Uma feature com 0,98 de correlação com o alvo e que \"resolve tudo\" é sinal de:",
          options: ["Modelo excelente", "Possível vazamento: investigue de onde ela vem", "Desbalanceamento", "Falta de dados"],
          answerIndex: 1,
          explanation: "Boa demais para ser verdade costuma ser vazamento. Verifique se ela existe no momento da previsão.",
        },
      ],
    },
    {
      id: "selecao",
      tags: ["selecao"],
      blocks: [
        { type: "heading", eyebrow: "Aula 06", text: "Seleção de atributos" },
        {
          type: "card-grid",
          columns: 3,
          cards: [
            { icon: "Search", title: "Filtro", description: "Estatística independente do modelo: correlação de Pearson, ANOVA, qui-quadrado. Rápido." },
            { icon: "Workflow", title: "Wrapper", description: "Treina o modelo com subconjuntos: seleção progressiva ou retroativa. Preciso e caro." },
            { icon: "Cog", title: "Embarcado", description: "A seleção acontece no treino: árvores de decisão, Lasso e Ridge." },
          ],
        },
        { type: "callout", variant: "tip", md: "Objetivos (MD 07): evitar features muito correlacionadas entre si, reduzir sobreajuste e melhorar a interpretabilidade. Atributos como **ID** e **nome** não ajudam a prever." },
      ],
    },
    {
      id: "pca",
      tags: ["pca"],
      blocks: [
        { type: "heading", eyebrow: "MD 06 · MD 07", text: "Seleção × extração (PCA)" },
        {
          type: "comparison",
          left: { title: "Seleção", points: ["Escolhe um subconjunto das features originais", "Mantém o significado de cada coluna", "Ex.: tirar ID, nome, colunas redundantes"] },
          right: { title: "Extração (PCA)", points: ["Cria componentes novos combinando as originais", "Reduz dimensionalidade mantendo a variância", "Componentes perdem a interpretação direta"] },
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
            "Faltantes: entender o motivo, remover, imputar (mediana/moda) ou sinalizar.",
            "Padronize categorias e trate valores impossíveis.",
            "Nominal → one-hot; ordinal → label/ordinal. Min-max → [0, 1]; z-score → média 0 e desvio 1.",
            "Ajuste imputação e escala só no treino (Pipeline). Leakage = usar o que não se sabe no momento da previsão.",
            "Seleção: filtro, wrapper ou embarcada. PCA extrai componentes novos.",
          ],
        },
      ],
    },
  ],
});
