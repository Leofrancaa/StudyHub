import { defineModule } from "@/lib/content/define";

/**
 * Fontes: MD 06 Mineração (KDD, CRISP-DM), MD 07 (supervisionado, classificação, regressão,
 * features/target), Aula03 (pipeline de IA, estrutura de projeto, Git), Mineração 1ª aula (unidades).
 * Fora do material: aprendizado por reforço e o padrão Conventional Commits detalhado.
 */
export const module04 = defineModule({
  slug: "processo",
  title: "Processo: KDD, CRISP-DM e pipeline",
  description: "O caminho de um projeto de dados, do problema de negócio ao modelo em produção.",
  objectives: [
    "Descrever as fases do KDD e do CRISP-DM e por que são iterativas",
    "Diferenciar tipos de aprendizado e tarefas (classificação × regressão)",
    "Estruturar um projeto de ML com pastas, pipeline e Git",
  ],
  estimatedMinutes: 30,
  questionsPerAttempt: 10,
  slides: [
    {
      id: "abertura",
      tags: [],
      blocks: [
        { type: "heading", eyebrow: "Módulo 4", text: "Projeto de dados tem método" },
        { type: "text", md: "A maioria dos projetos de ML falha **antes** do modelo: problema mal definido, dado errado, nenhuma forma de medir sucesso. Processo evita isso." },
        {
          type: "card-grid",
          columns: 3,
          cards: [
            { icon: "Workflow", title: "KDD e CRISP-DM", description: "Os dois roteiros clássicos de mineração de dados." },
            { icon: "Target", title: "Tipo de problema", description: "Supervisionado ou não; classificação ou regressão." },
            { icon: "Code", title: "Projeto organizado", description: "Pipeline, pastas e Git desde o primeiro dia." },
          ],
        },
      ],
    },
    {
      id: "kdd",
      tags: ["kdd"],
      blocks: [
        { type: "heading", eyebrow: "MD 06", text: "KDD: descoberta de conhecimento" },
        { type: "text", md: "Knowledge Discovery in Databases: processo **iterativo e interativo** de extrair informações **úteis, válidas e inéditas** de grandes volumes de dados. A mineração é só uma das etapas." },
        {
          type: "steps",
          steps: [
            { title: "Seleção", description: "Escolher os dados relevantes para o objetivo." },
            { title: "Pré-processamento", description: "Limpar ruído, faltantes e inconsistências." },
            { title: "Transformação", description: "Criar, codificar e reduzir atributos." },
            { title: "Mineração", description: "Aplicar algoritmos para achar padrões." },
            { title: "Interpretação e avaliação", description: "Validar se o padrão é útil e virou conhecimento." },
          ],
        },
      ],
    },
    {
      id: "crisp",
      tags: ["crisp"],
      blocks: [
        { type: "heading", eyebrow: "MD 06", text: "CRISP-DM: o processo mais usado" },
        { type: "text", md: "Cross-Industry Standard Process for Data Mining. Seis fases, com idas e voltas: é comum voltar da modelagem para a preparação, ou da avaliação para o negócio." },
        {
          type: "steps",
          steps: [
            { title: "Compreensão do negócio", description: "Qual problema, como medir sucesso, que restrições existem." },
            { title: "Compreensão dos dados", description: "Coleta inicial e exploração." },
            { title: "Preparação dos dados", description: "Limpeza, EDA, features, seleção." },
            { title: "Modelagem", description: "Escolher técnicas, amostragem, divisão e hiperparâmetros." },
            { title: "Avaliação", description: "O modelo atende ao objetivo de negócio?" },
            { title: "Implantação", description: "Colocar em uso real e acompanhar." },
          ],
        },
      ],
    },
    {
      id: "negocio",
      tags: ["crisp", "negocio"],
      blocks: [
        { type: "heading", eyebrow: "Fase 1", text: "Começa pelo negócio, não pelo algoritmo" },
        {
          type: "text",
          md: "Perguntas da compreensão do negócio (MD 06):\n\n- O que a empresa deseja alcançar?\n- Como medir o sucesso?\n- Qual o impacto financeiro ou operacional?\n- Há restrições de prazo ou tecnologia?",
        },
        {
          type: "callout",
          variant: "tip",
          title: "No caso Olist",
          md: "Objetivo: priorizar pedidos com risco de atraso **logo após a aprovação do pagamento**. Sucesso não é \"acurácia alta\": é pegar os atrasos a tempo de agir, dentro da capacidade da operação.",
        },
      ],
    },
    {
      id: "analogia-obra",
      tags: ["crisp"],
      blocks: [
        {
          type: "analogy",
          icon: "Lightbulb",
          concept: { title: "CRISP-DM", description: "Entender o problema e os dados antes de modelar, e voltar etapas quando algo não fecha." },
          analogy: { title: "Construir uma casa", description: "Ninguém começa assentando tijolo: primeiro o que o morador precisa, depois o terreno, o projeto. Se a sondagem do solo surpreende, o projeto é revisto." },
        },
      ],
    },
    {
      id: "fases-detalhe",
      tags: ["crisp"],
      blocks: [
        { type: "heading", eyebrow: "MD 06", text: "O que cada fase entrega" },
        {
          type: "card-grid",
          columns: 2,
          cards: [
            { icon: "Search", title: "Compreensão dos dados", description: "Conhecer os dados disponíveis: coleta inicial e exploração." },
            { icon: "Wrench", title: "Preparação", description: "Transformar dados brutos em um conjunto adequado para modelar." },
            { icon: "BrainCircuit", title: "Modelagem", description: "Escolher e aplicar técnicas; dividir a base; ajustar hiperparâmetros." },
            { icon: "Target", title: "Avaliação", description: "Verificar se o modelo atende ao objetivo definido na fase 1." },
            { icon: "Rocket", title: "Implantação", description: "Colocar o modelo em uso real (deployment)." },
          ],
        },
        {
          type: "mini-check",
          question: "O modelo tem ótima métrica técnica, mas não ajuda a decisão que o negócio pediu. Em que fase isso deve ser detectado?",
          options: ["Preparação", "Avaliação", "Implantação", "Compreensão dos dados"],
          answerIndex: 1,
          explanation: "A avaliação do CRISP-DM confere o modelo contra o objetivo de negócio, não só contra a métrica técnica.",
        },
      ],
    },
    {
      id: "tipos",
      tags: ["tipos"],
      blocks: [
        { type: "heading", eyebrow: "Mineração · Unidade 2", text: "Tipos de aprendizado" },
        {
          type: "card-grid",
          columns: 2,
          cards: [
            { icon: "Target", title: "Supervisionado", description: "Dados de entrada com a saída conhecida (rótulo). Ex.: pedidos com atrasou sim/não." },
            { icon: "Network", title: "Não supervisionado", description: "Sem rótulo: achar estrutura. Ex.: agrupar clientes parecidos." },
            { icon: "Layers", title: "Semi-supervisionado", description: "Poucos rótulos e muitos dados sem rótulo." },
            { icon: "Gauge", title: "Por reforço", description: "Um agente aprende por tentativa, recebendo recompensas." },
          ],
        },
      ],
    },
    {
      id: "tarefas",
      tags: ["tarefas"],
      blocks: [
        { type: "heading", eyebrow: "MD 07", text: "Classificação × regressão" },
        {
          type: "comparison",
          left: { title: "Classificação", icon: "Puzzle", points: ["Alvo categórico", "Spam ou não spam", "Peça aprovada ou reprovada", "Pedido atrasa: sim/não"] },
          right: { title: "Regressão", icon: "ChartLine", points: ["Alvo numérico contínuo", "Valor de um imóvel", "Índice de chuva", "Dias de atraso"] },
          verdict: "A pergunta é sobre o TIPO DO ALVO: categoria → classificação; número contínuo → regressão.",
        },
        {
          type: "mini-check",
          question: "Prever quantos minutos uma máquina vai ficar parada é:",
          options: ["Classificação", "Regressão", "Agrupamento", "Associação"],
          answerIndex: 1,
          explanation: "Minutos é um número contínuo, então é regressão.",
        },
      ],
    },
    {
      id: "features-target",
      tags: ["features-target"],
      blocks: [
        { type: "heading", eyebrow: "MD 07", text: "Features e target: os sinônimos" },
        {
          type: "comparison",
          left: { title: "Features (x)", points: ["Variáveis preditoras", "Variáveis independentes", "Atributos", "Ex.: prazo prometido, frete, estado"] },
          right: { title: "Target (y)", points: ["Variável resposta", "Variável dependente", "Variável alvo, rótulo", "Ex.: is_late"] },
        },
        { type: "callout", variant: "tip", md: "Divisão típica do MD 07: **70–80% treino** e **20–30% teste**. No módulo de avaliação você vai refinar isso com validação." },
      ],
    },
    {
      id: "pipeline",
      tags: ["pipeline"],
      blocks: [
        { type: "heading", eyebrow: "Aula 03", text: "Pipeline de IA" },
        {
          type: "steps",
          steps: [
            { title: "Coleta", description: "Reunir os dados das fontes." },
            { title: "Qualidade e EDA", description: "Entender e validar os dados." },
            { title: "Features", description: "Criar e selecionar atributos sem vazamento." },
            { title: "Treino e validação", description: "Ajustar modelos e comparar com validação cruzada." },
            { title: "Avaliação final", description: "Teste separado, métricas de negócio." },
            { title: "Deploy e monitoramento", description: "Servir o modelo e vigiar se os dados mudaram." },
          ],
        },
      ],
    },
    {
      id: "estrutura",
      tags: ["estrutura"],
      blocks: [
        { type: "heading", eyebrow: "Aula 03 · momento interativo", text: "Estrutura de pastas" },
        {
          type: "code",
          language: "text",
          code: "olist/\n├── data/\n│   ├── raw/          # como veio da fonte, nunca editar\n│   └── processed/    # gerado pelo código\n├── notebooks/        # 01_qualidade, 02_EDA, 03_features...\n├── src/              # funções reutilizáveis\n├── models/           # modelos treinados\n├── reports/          # figuras e resultados\n├── pyproject.toml    # dependências (uv)\n└── README.md",
          caption: "Dado bruto separado do processado: tudo que é derivado pode ser refeito rodando o código.",
        },
      ],
    },
    {
      id: "git",
      tags: ["git"],
      blocks: [
        { type: "heading", eyebrow: "Fim de toda aula", text: "Versionar com Git" },
        {
          type: "code",
          language: "bash",
          code: 'git add notebooks/02_EDA.ipynb\ngit commit -m "feat(olist): adiciona notebook com análise exploratória"\ngit push',
          caption: "Padrão Conventional Commits: tipo(escopo): descrição. feat = funcionalidade, fix = correção, refactor = reorganização sem mudar comportamento.",
        },
        { type: "callout", variant: "warning", md: "Não versione dados grandes nem dados pessoais. Coloque `data/` no `.gitignore` e documente de onde baixar." },
      ],
    },
    {
      id: "resumo",
      tags: [],
      blocks: [
        {
          type: "summary",
          points: [
            "KDD: seleção, pré-processamento, transformação, mineração, interpretação; processo iterativo.",
            "CRISP-DM: negócio, dados, preparação, modelagem, avaliação, implantação, com idas e voltas.",
            "Supervisionado tem rótulo; não supervisionado busca estrutura; semi mistura; reforço aprende com recompensa.",
            "Alvo categórico → classificação; alvo numérico contínuo → regressão.",
            "Projeto organizado: raw separado de processed, notebooks numerados, Git com commits claros.",
          ],
        },
      ],
    },
  ],
});
