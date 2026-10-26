import { defineModule } from "@/lib/content/define";

/**
 * Fontes: MD 02 (BI, DW, OLTP × OLAP, ETL, OLAP, MOLAP/ROLAP, lake/lakehouse), MD 03 (modelagem
 * multidimensional, estrela, floco de neve, chaves artificiais), MD 04 (ETL, limpeza, transformação).
 * Fora do material: nomenclatura SCD tipo 2 e schema-on-write × schema-on-read.
 */
export const module03 = defineModule({
  slug: "data-warehouse",
  title: "Data Warehouse, ETL e OLAP",
  description: "Como organizar dados históricos para análise: DW, modelagem dimensional, ETL e cubos.",
  objectives: [
    "Diferenciar bancos OLTP e OLAP e as características de um Data Warehouse",
    "Modelar fatos e dimensões em esquema estrela ou floco de neve",
    "Explicar o processo ETL e as operações OLAP (drill, slice, dice)",
  ],
  estimatedMinutes: 35,
  questionsPerAttempt: 10,
  slides: [
    {
      id: "abertura",
      tags: [],
      blocks: [
        { type: "heading", eyebrow: "Módulo 3", text: "Dados prontos para decidir" },
        { type: "text", md: "Sistemas do dia a dia registram transações. Para **analisar** anos de histórico sem derrubar a operação, existe o **Data Warehouse**." },
        {
          type: "card-grid",
          columns: 3,
          cards: [
            { icon: "Database", title: "DW", description: "Repositório integrado, histórico e orientado a assunto." },
            { icon: "Workflow", title: "ETL", description: "Extrair, transformar e carregar os dados das fontes." },
            { icon: "Layers", title: "OLAP", description: "Navegar no cubo: drill, slice, dice e roll-up." },
          ],
        },
      ],
    },
    {
      id: "oltp-olap",
      tags: ["oltp-olap"],
      blocks: [
        { type: "heading", eyebrow: "MD 02", text: "OLTP × OLAP" },
        {
          type: "comparison",
          left: {
            title: "OLTP (transacional)",
            icon: "Zap",
            points: ["Registra o dia a dia: vendas, reservas", "Muitas escritas pequenas e rápidas", "Normalizado (3ª forma normal)", "Dados atuais, pouco histórico"],
          },
          right: {
            title: "OLAP (analítico)",
            icon: "ChartLine",
            points: ["Responde perguntas de negócio", "Consultas grandes, poucas atualizações", "Desnormalizado nas dimensões", "Histórico de anos, dados resumidos"],
          },
          verdict: "Rodar relatórios pesados direto no OLTP atrapalha a operação; por isso os dados são copiados para um ambiente analítico.",
        },
      ],
    },
    {
      id: "dw-definicao",
      tags: ["dw"],
      blocks: [
        { type: "heading", eyebrow: "Inmon, 1996", text: "O que é um Data Warehouse" },
        { type: "text", md: "\"Conjunto de dados **orientado a assunto, integrado, não volátil e variante no tempo**, no apoio de decisões gerenciais.\"" },
        {
          type: "flip-cards",
          cards: [
            { front: "Orientado a assunto", back: "Organizado por tema do negócio (vendas, produção), não por sistema de origem." },
            { front: "Integrado", back: "Fontes padronizadas: mesmos códigos, unidades e nomes." },
            { front: "Não volátil", back: "Dados carregados não são alterados; o uso é consulta." },
            { front: "Variante no tempo", back: "Guarda histórico de anos para enxergar tendências." },
          ],
        },
      ],
    },
    {
      id: "arquitetura",
      tags: ["arquitetura"],
      blocks: [
        { type: "heading", eyebrow: "MD 02", text: "Arquitetura de ponta a ponta" },
        {
          type: "steps",
          steps: [
            { title: "Fontes", description: "OLTP, ERP, planilhas, sites, até papel. Nem tudo deve ir para o DW." },
            { title: "ETL", description: "Extrai, limpa, padroniza e carrega." },
            { title: "Data Warehouse", description: "Base única e consistente da empresa." },
            { title: "Data Marts", description: "Recortes por área (vendas, qualidade)." },
            { title: "OLAP e BI", description: "Dashboards e análises multidimensionais para a gestão." },
          ],
        },
        { type: "callout", variant: "tip", md: "**Top-down** (Inmon): constrói o DW e depois os data marts. **Bottom-up** (Kimball): começa por data marts e cresce até o DW." },
      ],
    },
    {
      id: "etl",
      tags: ["etl"],
      blocks: [
        { type: "heading", eyebrow: "MD 04", text: "ETL: extrair, transformar, carregar" },
        {
          type: "card-grid",
          columns: 3,
          cards: [
            { icon: "Search", title: "Extract", description: "Lê das fontes. Carga inicial (tudo) ou incremental (só o que mudou, via logs ou indicadores)." },
            { icon: "Wrench", title: "Transform", description: "Limpeza, padronização (\"M\", \"Masculino\" → \"M\"), integração, agregação, desnormalização." },
            { icon: "Database", title: "Load", description: "Mapeia cada campo para o modelo do DW e grava." },
          ],
        },
        {
          type: "mini-check",
          question: "Todo dia só os pedidos novos ou alterados desde a última carga são lidos. Que extração é essa?",
          options: ["Inicial", "Incremental", "Completa", "Manual"],
          answerIndex: 1,
          explanation: "Incremental lê apenas o que mudou. A inicial (completa) é usada na primeira carga.",
        },
      ],
    },
    {
      id: "analogia-cozinha",
      tags: ["etl"],
      blocks: [
        {
          type: "analogy",
          icon: "Lightbulb",
          concept: { title: "ETL", description: "Buscar dados brutos de várias fontes, padronizar e guardar prontos para análise." },
          analogy: { title: "Cozinha de restaurante", description: "Ingredientes chegam de fornecedores diferentes; são lavados, cortados e porcionados (mise en place) antes de ir para o prato." },
        },
      ],
    },
    {
      id: "fato-dimensao",
      tags: ["fato-dimensao"],
      blocks: [
        { type: "heading", eyebrow: "MD 03", text: "Fatos e dimensões" },
        {
          type: "comparison",
          left: { title: "Tabela fato", icon: "Calculator", points: ["\"O que eu quero medir?\"", "Medidas numéricas: valor, quantidade", "Centro da estrela", "Chaves estrangeiras para as dimensões"] },
          right: { title: "Tabelas dimensão", icon: "Layers", points: ["\"Por quais ângulos vou analisar?\"", "Cliente, produto, tempo, região", "Pontas da estrela", "Atributos descritivos e históricos"] },
        },
        {
          type: "code",
          language: "sql",
          code: "SELECT t.ano, c.nome AS curso, SUM(f.valor_mensalidade) AS total\nFROM fato_mensalidade f\nJOIN dim_tempo t ON t.id_tempo = f.id_tempo\nJOIN dim_curso c ON c.id_curso = f.id_curso\nGROUP BY t.ano, c.nome;",
          caption: "Exemplo do MD 03: mensalidades medidas por curso e por tempo.",
        },
      ],
    },
    {
      id: "estrela-floco",
      tags: ["estrela-floco"],
      blocks: [
        { type: "heading", eyebrow: "MD 03", text: "Estrela ou floco de neve?" },
        {
          type: "comparison",
          left: { title: "Esquema estrela", points: ["Dimensões desnormalizadas", "Categoria do curso fica dentro de dim_curso", "Menos JOINs, consultas mais rápidas", "Mais redundância"] },
          right: { title: "Floco de neve", points: ["Dimensões normalizadas em sub-tabelas", "dim_curso → dim_categoria", "Economiza espaço", "Mais JOINs, perde desempenho"] },
          verdict: "Kimball recomenda a estrela na maioria dos DWs: espaço é barato, tempo de consulta não.",
        },
      ],
    },
    {
      id: "scd",
      tags: ["scd"],
      blocks: [
        { type: "heading", eyebrow: "MD 03", text: "Chaves artificiais e histórico" },
        {
          type: "text",
          md: "Dimensões usam uma **chave artificial** (surrogate key) própria do DW, independente do ID do sistema de origem. Com ela dá para guardar várias versões do mesmo cliente:\n\n- **flag ativo/inativo**\n- **data de início e fim** de validade\n- **data da última atualização** (facilita carga incremental)",
        },
        { type: "callout", variant: "fun", title: "Nome técnico", md: "Guardar uma linha nova a cada mudança, com datas de validade, é a **SCD tipo 2** (Slowly Changing Dimension)." },
      ],
    },
    {
      id: "olap-ops",
      tags: ["olap-ops"],
      blocks: [
        { type: "heading", eyebrow: "MD 02", text: "Navegando no cubo" },
        {
          type: "card-grid",
          columns: 2,
          cards: [
            { icon: "Search", title: "Drill-down", description: "Mais detalhe: região → estado → cidade." },
            { icon: "Layers", title: "Roll-up (drill-up)", description: "Agrega: estados → região." },
            { icon: "Ruler", title: "Slice", description: "Fixa UMA dimensão (ano = 2026) e analisa o plano que sobra." },
            { icon: "Puzzle", title: "Dice", description: "Filtra VÁRIAS dimensões e obtém um sub-cubo." },
          ],
        },
      ],
    },
    {
      id: "cubo-interativo",
      tags: ["olap-ops"],
      blocks: [
        { type: "heading", eyebrow: "Mão na massa", text: "Gire o cubo e teste cada operação" },
        {
          type: "interactive-3d",
          sceneId: "olap-cube",
          caption: "Cada cubinho é uma célula (produto, região, ano). Compare o slice (um plano), o dice (sub-cubo) e o roll-up (totais por região).",
        },
      ],
    },
    {
      id: "armazenamento-olap",
      tags: ["armazenamento-olap"],
      blocks: [
        { type: "heading", eyebrow: "MD 02", text: "Onde o cubo mora" },
        {
          type: "card-grid",
          columns: 3,
          cards: [
            { icon: "Zap", title: "MOLAP", description: "Arrays multidimensionais próprios. Consultas muito rápidas, carga complexa, limite de tamanho." },
            { icon: "Database", title: "ROLAP", description: "Tabelas relacionais. Aguenta grandes volumes, consultas mais lentas." },
            { icon: "Layers", title: "HOLAP", description: "Híbrido: agregados em MOLAP, detalhe em ROLAP." },
          ],
        },
      ],
    },
    {
      id: "lake",
      tags: ["lake"],
      blocks: [
        { type: "heading", eyebrow: "MD 02", text: "Warehouse, Lake e Lakehouse" },
        {
          type: "comparison",
          left: { title: "Data Warehouse", points: ["Dados estruturados e tratados", "Esquema definido antes de gravar", "Ótimo para BI e relatórios"] },
          right: { title: "Data Lake", points: ["Dados brutos de qualquer formato", "Esquema aplicado na leitura", "Ótimo para ciência de dados e ML"] },
          verdict: "O Lakehouse combina os dois: armazenamento barato de lake com tabelas confiáveis e consultas de warehouse.",
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
            "OLTP registra transações; OLAP analisa histórico. DW = orientado a assunto, integrado, não volátil, variante no tempo.",
            "ETL: extração inicial ou incremental, transformação (limpeza e padronização), carga.",
            "Fato = medidas; dimensão = ângulos de análise. Estrela é desnormalizada; floco normaliza as dimensões.",
            "Chave artificial + datas de validade guardam histórico das dimensões (SCD 2).",
            "OLAP: drill-down, roll-up, slice (1 dimensão) e dice (várias). MOLAP, ROLAP, HOLAP.",
          ],
        },
      ],
    },
  ],
});
