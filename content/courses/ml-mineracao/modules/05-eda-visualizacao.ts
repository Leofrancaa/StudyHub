import { defineModule } from "@/lib/content/define";

/**
 * Fontes: Aula05 (EDA, estatística descritiva, hipóteses Olist), MD 06 Visualização (intenção analítica,
 * pizza, storytelling, cores), MD 06 Mineração (análise univariada, bivariada, multivariada), MD 07 (Pearson, heatmap).
 * Fora do material: regra de 1,5·IQR para outliers e "correlação não é causalidade" detalhada.
 */
export const module05 = defineModule({
  slug: "eda-visualizacao",
  title: "Análise exploratória e visualização",
  description: "Resumir dados com estatística, levantar hipóteses e escolher o gráfico certo para cada pergunta.",
  objectives: [
    "Calcular e interpretar média, mediana, moda, quartis e desvio padrão",
    "Detectar outliers e relações entre variáveis sem confundir correlação com causa",
    "Escolher o gráfico adequado à intenção analítica e contar uma história com dados",
  ],
  estimatedMinutes: 30,
  questionsPerAttempt: 10,
  slides: [
    {
      id: "abertura",
      tags: [],
      blocks: [
        { type: "heading", eyebrow: "Módulo 5", text: "Olhe os dados antes de modelar" },
        { type: "text", md: "A Análise Exploratória de Dados (EDA) serve para **descobrir padrões, estabelecer relações e gerar insights**. Ela decide quais hipóteses valem a pena e evita surpresas no modelo." },
        {
          type: "card-grid",
          columns: 3,
          cards: [
            { icon: "Calculator", title: "Estatística descritiva", description: "Resumir milhares de linhas em poucos números." },
            { icon: "Search", title: "Hipóteses", description: "Perguntas testáveis sobre o problema." },
            { icon: "ChartLine", title: "Visualização", description: "O gráfico certo para cada intenção." },
          ],
        },
      ],
    },
    {
      id: "tendencia",
      tags: ["tendencia"],
      blocks: [
        { type: "heading", eyebrow: "Aula 05", text: "Medidas de tendência central" },
        {
          type: "card-grid",
          columns: 3,
          cards: [
            { icon: "Calculator", title: "Média", description: "Soma dividida pela quantidade. Sensível a valores extremos." },
            { icon: "Ruler", title: "Mediana", description: "Valor do meio com os dados ordenados. Robusta a outliers." },
            { icon: "Target", title: "Moda", description: "Valor mais frequente. Útil também para categorias." },
          ],
        },
        {
          type: "mini-check",
          question: "Fretes (R$): 10, 12, 12, 15, 151. Qual a mediana?",
          options: ["40", "12", "15", "151"],
          answerIndex: 1,
          explanation: "Ordenados, o valor do meio é 12. A média seria 200/5 = 40, puxada pelo frete de 151.",
        },
      ],
    },
    {
      id: "analogia-bilionario",
      tags: ["tendencia"],
      blocks: [
        {
          type: "analogy",
          icon: "Lightbulb",
          concept: { title: "Média × mediana", description: "Com valores extremos, a média se desloca e a mediana continua representando o \"típico\"." },
          analogy: { title: "Um bilionário entra no bar", description: "A renda MÉDIA de quem está no bar dispara; a renda MEDIANA quase não muda. Ninguém ficou mais rico." },
        },
      ],
    },
    {
      id: "dispersao",
      tags: ["dispersao"],
      blocks: [
        { type: "heading", eyebrow: "Aula 05", text: "Medidas de dispersão e posição" },
        {
          type: "text",
          md: "- **Mínimo e máximo**: os extremos.\n- **Quartis**: Q1 (25%), Q2 = mediana (50%), Q3 (75%). **Percentis** generalizam a ideia.\n- **Amplitude interquartil (IQR)** = Q3 − Q1: onde estão os 50% centrais.\n- **Desvio padrão**: quanto os valores se afastam da média, na mesma unidade dos dados.",
        },
        {
          type: "code",
          language: "python",
          code: 'pedidos["freight_value"].describe()\n# count, mean, std, min, 25%, 50%, 75%, max',
          caption: "Um describe() já entrega quase toda a estatística descritiva de uma coluna numérica.",
        },
      ],
    },
    {
      id: "outliers",
      tags: ["outliers"],
      blocks: [
        { type: "heading", eyebrow: "Boxplot", text: "Encontrando outliers" },
        {
          type: "text",
          md: "Regra clássica do boxplot: é outlier o valor abaixo de **Q1 − 1,5·IQR** ou acima de **Q3 + 1,5·IQR**.\n\nExemplo: Q1 = 10, Q3 = 20 → IQR = 10 → limites **−5** e **35**. Um valor 40 é outlier.",
        },
        {
          type: "callout",
          variant: "warning",
          md: "Outlier não é sinônimo de erro. Um pedido de frete altíssimo pode ser real (geladeira para o Acre). Investigue antes de apagar.",
        },
      ],
    },
    {
      id: "hipoteses",
      tags: ["hipoteses"],
      blocks: [
        { type: "heading", eyebrow: "Aula 05 · caso Olist", text: "Perguntas que guiam a EDA" },
        {
          type: "steps",
          steps: [
            { title: "Frequência de atrasos", description: "Hipótese: atrasos são minoria → classes desbalanceadas." },
            { title: "Prazo prometido", description: "Prazos curtos deixam menos margem → mais atraso." },
            { title: "Complexidade do pedido", description: "Mais itens ou vendedores → mais risco." },
            { title: "Geografia", description: "Alguns estados atrasam mais (distância, infraestrutura)." },
            { title: "Sazonalidade", description: "Meses de pico pressionam a logística." },
          ],
        },
      ],
    },
    {
      id: "uni-bi-multi",
      tags: ["analise-variaveis"],
      blocks: [
        { type: "heading", eyebrow: "MD 06", text: "Univariada, bivariada, multivariada" },
        {
          type: "card-grid",
          columns: 3,
          cards: [
            { icon: "Ruler", title: "Univariada", description: "Uma variável por vez: distribuição do frete, % de atrasos." },
            { icon: "Scale", title: "Bivariada", description: "Duas variáveis: atraso × prazo prometido." },
            { icon: "Layers", title: "Multivariada", description: "Várias ao mesmo tempo: atraso × prazo × estado." },
          ],
        },
      ],
    },
    {
      id: "correlacao",
      tags: ["correlacao"],
      blocks: [
        { type: "heading", eyebrow: "MD 07", text: "Correlação de Pearson" },
        {
          type: "text",
          md: "Vai de **−1** (relação linear negativa perfeita) a **+1** (positiva perfeita). Perto de 0: sem relação **linear**, o que não exclui uma relação curva.\n\nUm **mapa de calor** mostra a correlação de todas as variáveis de uma vez e ajuda a achar features redundantes.",
        },
        {
          type: "callout",
          variant: "warning",
          title: "Correlação não é causalidade",
          md: "Vendas de sorvete e afogamentos sobem juntos. Um não causa o outro: o calor causa os dois (variável de confusão).",
        },
      ],
    },
    {
      id: "graficos",
      tags: ["graficos"],
      blocks: [
        { type: "heading", eyebrow: "MD 06 Visualização", text: "Gráfico pela intenção analítica" },
        {
          type: "card-grid",
          columns: 2,
          cards: [
            { icon: "ChartLine", title: "Comparação", description: "Linha para tendência no tempo; colunas para poucas categorias; barras horizontais para rótulos longos e rankings." },
            { icon: "Layers", title: "Composição", description: "Treemap para hierarquias; cascata para saldos que sobem e descem; pizza só com poucas fatias." },
            { icon: "Ruler", title: "Distribuição", description: "Histograma para frequência; boxplot para quartis e outliers." },
            { icon: "Network", title: "Relação", description: "Dispersão para duas variáveis; mapa de calor para várias; bolhas adicionam uma terceira dimensão." },
          ],
        },
      ],
    },
    {
      id: "pizza",
      tags: ["graficos"],
      blocks: [
        { type: "heading", eyebrow: "MD 06 Visualização", text: "O problema da pizza" },
        {
          type: "comparison",
          left: { title: "Pizza", points: ["Comparamos ângulos e áreas, e o olho erra nisso", "Fatias parecidas ficam indistinguíveis", "Use só com menos de 6 fatias somando 100%, sem 3D"] },
          right: { title: "Barras/colunas", points: ["Comparamos comprimentos, e o olho acerta nisso", "Diferenças pequenas ficam visíveis", "Funcionam até em tamanho pequeno"] },
        },
        {
          type: "mini-check",
          question: "Você quer mostrar a evolução mensal de atrasos ao longo de 2 anos. Qual gráfico?",
          options: ["Pizza", "Linha", "Treemap", "Radar"],
          answerIndex: 1,
          explanation: "Tendência contínua no tempo pede gráfico de linha.",
        },
      ],
    },
    {
      id: "storytelling",
      tags: ["storytelling"],
      blocks: [
        { type: "heading", eyebrow: "MD 06 Visualização", text: "Storytelling com dados" },
        { type: "text", md: "Combinar **dados, visualização e narrativa** para comunicar um insight e levar a uma decisão. Antes do gráfico: **para quem é? qual a mensagem? que ação se espera?**" },
        {
          type: "callout",
          variant: "tip",
          title: "Cores com estratégia",
          md: "Tons neutros no fundo e uma cor forte só no que importa (alerta, anomalia). Se tudo está destacado, nada está. Garanta alto contraste.",
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
            "Média é sensível a extremos; mediana é robusta; moda é o mais frequente.",
            "Quartis e IQR descrevem a dispersão; outlier pela regra de 1,5·IQR merece investigação, não exclusão automática.",
            "Hipóteses guiam a EDA; análise pode ser uni, bi ou multivariada.",
            "Pearson mede relação linear (−1 a +1). Correlação não é causalidade.",
            "Gráfico segue a intenção: comparação, composição, distribuição ou relação. Evite pizza com muitas fatias.",
          ],
        },
      ],
    },
  ],
});
