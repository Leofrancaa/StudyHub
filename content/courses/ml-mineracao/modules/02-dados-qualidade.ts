import { defineModule } from "@/lib/content/define";

/**
 * Fontes: Aula02 (importância dos dados, ciclo de vida, LGPD, anotação), Aula04 (qualidade, Olist,
 * ydata-profiling, pandera), MD 01 (Big Data). Fora do material: definições da LGPD (Lei 13.709/2018)
 * e o detalhamento das seis dimensões de qualidade.
 */
export const module02 = defineModule({
  slug: "dados-qualidade",
  title: "Dados: qualidade, ciclo de vida e LGPD",
  description: "De onde vêm os dados, como medir se prestam e o que a lei exige antes de usá-los.",
  objectives: [
    "Classificar fontes de dados e características de Big Data",
    "Diagnosticar problemas usando as seis dimensões de qualidade",
    "Reconhecer riscos de representatividade e obrigações da LGPD",
  ],
  estimatedMinutes: 30,
  questionsPerAttempt: 10,
  slides: [
    {
      id: "abertura",
      tags: [],
      blocks: [
        { type: "heading", eyebrow: "Módulo 2", text: "A IA não começa no modelo" },
        { type: "text", md: "\"Data is food for AI\" (Andrew Ng). Um modelo nunca é melhor do que os dados que comeu. Aqui você aprende a **avaliar a comida antes de servir**." },
        {
          type: "card-grid",
          columns: 3,
          cards: [
            { icon: "Database", title: "Origem", description: "Dados gerados por pessoas e por máquinas; o que é Big Data." },
            { icon: "ShieldCheck", title: "Qualidade", description: "Seis dimensões para dizer se um dado presta." },
            { icon: "Scale", title: "Responsabilidade", description: "Representatividade, viés e LGPD." },
          ],
        },
      ],
    },
    {
      id: "fontes-dados",
      tags: ["fontes"],
      blocks: [
        { type: "heading", eyebrow: "Aula 02", text: "Quem gera os dados?" },
        {
          type: "comparison",
          left: { title: "Gerados por humanos", icon: "Users", points: ["Redes sociais e e-mails", "Documentos e formulários", "Avaliações de produtos", "Crowdsourcing"] },
          right: { title: "Gerados por máquinas", icon: "Cpu", points: ["Sensores e CLPs", "Arquivos de log", "Sistemas transacionais", "Cartões e registros automáticos"] },
          verdict: "Dados de máquina crescem mais rápido e costumam ser mais estruturados; dados humanos trazem contexto, mas também ruído e ambiguidade.",
        },
      ],
    },
    {
      id: "big-data",
      tags: ["big-data"],
      blocks: [
        { type: "heading", eyebrow: "MD 01", text: "Big Data em cinco Vs" },
        {
          type: "card-grid",
          columns: 3,
          cards: [
            { icon: "Database", title: "Volume", description: "Quantidade que não cabe em ferramentas comuns." },
            { icon: "Zap", title: "Velocidade", description: "Ritmo em que os dados chegam e precisam ser processados." },
            { icon: "Layers", title: "Variedade", description: "Tabelas, textos, imagens, áudio, logs." },
            { icon: "ShieldCheck", title: "Veracidade", description: "Confiabilidade: o dado reflete a realidade?" },
            { icon: "Target", title: "Valor", description: "Só vale guardar o que gera decisão ou produto." },
          ],
        },
        { type: "callout", variant: "fun", md: "O slide do MD 01 lista **10 Vs** (inclui variabilidade, validade, vulnerabilidade, volatilidade e visualização). Os cinco acima são o núcleo mais citado." },
      ],
    },
    {
      id: "ciclo-vida",
      tags: ["ciclo-vida"],
      blocks: [
        { type: "heading", eyebrow: "Aula 02", text: "Ciclo de vida dos dados" },
        {
          type: "steps",
          steps: [
            { title: "Coleta", description: "Definir o que coletar, de onde e com qual autorização." },
            { title: "Armazenamento", description: "Guardar com segurança, controle de acesso e backup." },
            { title: "Preparação", description: "Limpar, integrar e validar antes de usar." },
            { title: "Uso", description: "Análise, dashboards, treino de modelos." },
            { title: "Compartilhamento", description: "Entregar a quem precisa, só o necessário." },
            { title: "Arquivamento ou descarte", description: "Manter pelo prazo devido e eliminar quando a finalidade acaba." },
          ],
        },
      ],
    },
    {
      id: "dimensoes-qualidade",
      tags: ["dimensoes"],
      blocks: [
        { type: "heading", eyebrow: "Aula 04", text: "As seis dimensões de qualidade" },
        {
          type: "card-grid",
          columns: 3,
          cards: [
            { icon: "Puzzle", title: "Completude", description: "Os campos obrigatórios estão preenchidos?" },
            { icon: "Search", title: "Unicidade", description: "Cada entidade aparece uma vez só (sem duplicatas)?" },
            { icon: "Ruler", title: "Validade", description: "O valor respeita formato, tipo e faixa permitidos?" },
            { icon: "Workflow", title: "Consistência", description: "O dado concorda com ele mesmo e com outras tabelas?" },
            { icon: "Target", title: "Acurácia", description: "O valor corresponde à realidade?" },
            { icon: "Gauge", title: "Atualidade", description: "O dado está disponível e atualizado quando precisa?" },
          ],
        },
      ],
    },
    {
      id: "analogia-ingredientes",
      tags: ["dimensoes"],
      blocks: [
        {
          type: "analogy",
          icon: "Lightbulb",
          concept: { title: "Dados de baixa qualidade", description: "Faltantes, duplicados, fora do formato ou desatualizados levam o modelo a aprender errado." },
          analogy: { title: "Ingredientes estragados", description: "A melhor receita do mundo com farinha vencida dá um bolo ruim. Garbage in, garbage out." },
        },
      ],
    },
    {
      id: "exemplo-olist",
      tags: ["dimensoes", "olist"],
      blocks: [
        { type: "heading", eyebrow: "Caso Olist", text: "Diagnóstico na prática" },
        {
          type: "text",
          md: "Desafio do curso: logo após a aprovação do pagamento, prever quais pedidos vão **atrasar**. Antes do modelo, inspecione a tabela de pedidos:\n\n- `order_delivered_customer_date` vazio → **completude** (ou pedido ainda não entregue!)\n- mesmo `order_id` duas vezes → **unicidade**\n- entrega registrada **antes** da compra → **consistência**\n- `customer_state` = \"XX\" → **validade**",
        },
        {
          type: "mini-check",
          question: "12% dos clientes estão sem CEP cadastrado. Qual dimensão está ferida?",
          options: ["Unicidade", "Completude", "Atualidade", "Acurácia"],
          answerIndex: 1,
          explanation: "Campo obrigatório vazio é problema de completude. Acurácia seria um CEP preenchido mas errado.",
        },
      ],
    },
    {
      id: "representatividade",
      tags: ["representatividade"],
      blocks: [
        { type: "heading", eyebrow: "Qualidade não é só limpeza", text: "Representatividade e generalização" },
        {
          type: "text",
          md: "Um dado pode estar limpo e ainda assim **não representar** a realidade em que o modelo vai operar. O objetivo do treino é **generalizar**: acertar em dados que o modelo nunca viu.",
        },
        {
          type: "comparison",
          left: { title: "Amostra enviesada", points: ["Só fotos do turno da manhã", "Só clientes de SP", "Só peças de um fornecedor"] },
          right: { title: "Amostra representativa", points: ["Todos os turnos e iluminações", "Todas as regiões atendidas", "Variação real do processo"] },
          verdict: "Se a amostra não cobre um cenário, o modelo não tem como aprender esse cenário.",
        },
      ],
    },
    {
      id: "ferramentas",
      tags: ["ferramentas"],
      blocks: [
        { type: "heading", eyebrow: "Aula 04 · momento interativo", text: "Perfilar e validar com código" },
        {
          type: "code",
          language: "python",
          code: 'from ydata_profiling import ProfileReport\nimport pandera.pandas as pa\n\n# 1. Perfil automático: faltantes, duplicatas, distribuições\nProfileReport(pedidos, title="Olist").to_file("perfil.html")\n\n# 2. Regras explícitas de qualidade\nschema = pa.DataFrameSchema({\n    "order_id": pa.Column(str, unique=True),\n    "price": pa.Column(float, pa.Check.ge(0)),\n})\nschema.validate(pedidos, lazy=True)  # lista todos os erros',
          caption: "ydata-profiling descreve o que existe; pandera verifica regras que você define.",
        },
      ],
    },
    {
      id: "lgpd",
      tags: ["lgpd"],
      blocks: [
        { type: "heading", eyebrow: "Governança", text: "LGPD em cinco ideias" },
        {
          type: "card-grid",
          columns: 2,
          cards: [
            { icon: "Users", title: "Dado pessoal", description: "Informação que identifica ou pode identificar uma pessoa (nome, CPF, placa, IP)." },
            { icon: "ShieldCheck", title: "Dado sensível", description: "Saúde, biometria, origem racial, religião, opinião política: proteção reforçada." },
            { icon: "Scale", title: "Base legal", description: "Todo tratamento precisa de uma (consentimento é uma delas, não a única)." },
            { icon: "Target", title: "Finalidade e minimização", description: "Coletar só o necessário para um propósito declarado." },
            { icon: "Eye", title: "Anonimização", description: "Dado anonimizado de forma irreversível deixa de ser pessoal; pseudonimizado continua sendo." },
          ],
        },
        { type: "callout", variant: "warning", md: "Lei 13.709/2018, fiscalizada pela ANPD. Em projetos de ML, documente de onde veio cada dado pessoal e por que ele é necessário." },
      ],
    },
    {
      id: "anotacao",
      tags: ["anotacao"],
      blocks: [
        { type: "heading", eyebrow: "Aula 02 · desafio Roboflow", text: "Anotação: criar o rótulo" },
        {
          type: "steps",
          steps: [
            { title: "Definir as classes", description: "Ex.: papila, tecido fibroglandular, músculo peitoral, contorno." },
            { title: "Escrever um guia", description: "Regras claras para casos ambíguos." },
            { title: "Anotar", description: "Caixas, polígonos ou rótulos por imagem." },
            { title: "Revisar", description: "Dois anotadores no mesmo exemplo medem a concordância." },
            { title: "Versionar", description: "Saber qual versão dos rótulos treinou qual modelo." },
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
            "Dados vêm de pessoas e de máquinas; Big Data = volume, velocidade, variedade, veracidade e valor.",
            "Ciclo de vida: coleta, armazenamento, preparação, uso, compartilhamento, descarte.",
            "Seis dimensões: completude, unicidade, validade, consistência, acurácia, atualidade.",
            "Dado limpo também precisa ser representativo para o modelo generalizar.",
            "LGPD: base legal, finalidade, minimização; dado sensível tem proteção reforçada.",
          ],
        },
      ],
    },
  ],
});
