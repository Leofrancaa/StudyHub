import { defineModule } from "@/lib/content/define";

/**
 * Fontes: Aula01 (slides 5, 18, 23–25) e MD 01 (slide 9).
 * Fora do material: definição de Mitchell (1997), diagrama regras × dados (F. Chollet),
 * números do exemplo do fertilizante (fictícios) e a nuance sobre IA generativa.
 */
export const module01 = defineModule({
  slug: "o-que-e-ia",
  title: "O que é IA, de verdade",
  description: "Modelo, parâmetros, treino e onde ML, Deep Learning e IA generativa se encaixam.",
  objectives: [
    "Explicar o que um modelo de IA realmente é (função + parâmetros + dados)",
    "Diferenciar programação por regras de Machine Learning",
    "Encaixar IA, ML, Deep Learning e IA generativa na hierarquia correta",
  ],
  estimatedMinutes: 25,
  questionsPerAttempt: 10,
  difficultyMix: { easy: 0.3, medium: 0.5, hard: 0.2 },
  slides: [
    {
      id: "abertura",
      tags: [],
      blocks: [
        { type: "heading", eyebrow: "Módulo 1", text: "IA não é mágica. É matemática com dados." },
        {
          type: "text",
          md: "Quase todo mal-entendido sobre IA nasce de tratá-la como um **oráculo**. Neste módulo você monta o alicerce que sustenta todo o resto do curso.",
        },
        {
          type: "card-grid",
          columns: 3,
          cards: [
            { icon: "Calculator", title: "O que é um modelo", description: "Uma função com parâmetros ajustados aos dados." },
            { icon: "Scale", title: "Regras × ML", description: "Quando escrever a regra e quando deixar o algoritmo aprender." },
            { icon: "Layers", title: "A hierarquia", description: "IA ⊃ ML ⊃ Deep Learning ⊃ IA generativa." },
          ],
        },
      ],
    },
    {
      id: "nao-e-oraculo",
      tags: ["ia-pilares"],
      blocks: [
        { type: "heading", eyebrow: "Os pilares", text: "Modelo matemático + dados" },
        {
          type: "text",
          md: "Não existe uma entidade que \"sabe tudo\". Existe um **modelo matemático computacional** e existem os **dados** com que ele foi ajustado.\n\nSe os dados são ruins ou não representam a realidade, o modelo aprende errado, por mais sofisticado que seja.",
        },
        {
          type: "callout",
          variant: "warning",
          title: "Mito comum",
          md: "\"A IA decidiu sozinha.\" Na prática, ela reproduz padrões dos dados de treino, inclusive os vieses que estavam neles.",
        },
      ],
    },
    {
      id: "modelo-funcao",
      tags: ["modelo-parametros"],
      blocks: [
        { type: "heading", eyebrow: "Definição", text: "Um modelo é uma função com parâmetros" },
        { type: "code", language: "text", code: "ŷ = f(x; θ)", caption: "Lê-se: a previsão ŷ é uma função da entrada x, controlada pelos parâmetros θ." },
        {
          type: "card-grid",
          columns: 3,
          cards: [
            { icon: "Database", title: "x — entrada", description: "O que o modelo recebe: vibração de um motor, pixels de uma imagem, texto de um e-mail." },
            { icon: "Cog", title: "θ — parâmetros", description: "Os \"botões\" internos do modelo. Ninguém digita esses valores: eles saem do treino." },
            { icon: "Target", title: "ŷ — previsão", description: "O que o modelo devolve. Comparamos com o valor real y para medir o erro." },
          ],
        },
      ],
    },
    {
      id: "analogia-receita",
      tags: ["modelo-parametros", "treino"],
      blocks: [
        {
          type: "analogy",
          icon: "Lightbulb",
          concept: {
            title: "Treinar um modelo",
            description: "Ajustar os parâmetros θ para que as previsões fiquem o mais perto possível dos valores reais nos dados.",
          },
          analogy: {
            title: "Acertar uma receita provando",
            description: "A receita é o modelo, cada prova é um dado e a quantidade de sal e o tempo de forno são os parâmetros. Você prova, compara com o sabor desejado e ajusta.",
          },
        },
      ],
    },
    {
      id: "treinar-e-ajustar",
      tags: ["treino"],
      blocks: [
        { type: "heading", eyebrow: "Como o treino funciona", text: "Prever, medir o erro, ajustar, repetir" },
        {
          type: "steps",
          steps: [
            { title: "Prever", description: "Com os parâmetros atuais, o modelo calcula ŷ para cada exemplo de treino." },
            { title: "Medir o erro", description: "Compara ŷ com o valor real y. A diferença mostra o quanto o modelo está errando." },
            { title: "Ajustar", description: "Muda os parâmetros na direção que diminui o erro." },
            { title: "Repetir", description: "Faz isso muitas vezes até o erro parar de cair." },
          ],
        },
        {
          type: "callout",
          variant: "tip",
          md: "Você vai ver esse mesmo ciclo de novo na regressão logística e nas redes neurais. A ideia é sempre a mesma; muda só a função e a forma de ajustar.",
        },
      ],
    },
    {
      id: "exemplo-fertilizante",
      tags: ["treino", "modelo-parametros"],
      blocks: [
        { type: "heading", eyebrow: "Exemplo da Aula 01", text: "Quanto a planta cresce com fertilizante?" },
        {
          type: "text",
          md: "Dados (fictícios): **0 g → 5 cm**, **10 g → 9 cm**, **20 g → 13 cm**, **30 g → 17 cm**.\n\nModelo escolhido: `crescimento = w · fertilizante + b`. O treino encontra **w = 0,4** e **b = 5**. Ninguém escreveu \"0,4\" no código: esse número saiu dos dados.",
        },
        {
          type: "code",
          language: "python",
          code: "w, b = 0.4, 5          # parâmetros aprendidos no treino\n\ndef prever(fertilizante_g):\n    return w * fertilizante_g + b\n\nprint(prever(25))      # 15.0 cm",
        },
        {
          type: "mini-check",
          question: "Com w = 0,4 e b = 5, qual a previsão para 40 g de fertilizante?",
          options: ["16 cm", "21 cm", "45 cm", "9 cm"],
          answerIndex: 1,
          explanation: "0,4 · 40 + 5 = 16 + 5 = 21 cm. Quem respondeu 16 esqueceu de somar b.",
        },
      ],
    },
    {
      id: "treino-interativo",
      tags: ["treino", "modelo-parametros"],
      blocks: [
        { type: "heading", eyebrow: "Mão na massa", text: "Seja você o algoritmo de treino" },
        {
          type: "interactive-3d",
          sceneId: "regression-fit",
          caption:
            "Mexa em w e b até as linhas laranjas (os erros) ficarem curtas. O MSE é a média dos erros ao quadrado: treinar é exatamente procurar os parâmetros que o deixam mínimo.",
        },
      ],
    },
    {
      id: "regras-vs-ml",
      tags: ["regras-vs-ml"],
      blocks: [
        { type: "heading", eyebrow: "Mudança de paradigma", text: "Quem escreve a regra?" },
        {
          type: "comparison",
          left: {
            title: "Programação tradicional",
            icon: "Code",
            points: ["Entrada: REGRAS + DADOS", "Saída: RESPOSTAS", "A pessoa programadora escreve a lógica", "Ex.: spam se contém \"grátis\""],
          },
          right: {
            title: "Machine Learning",
            icon: "BrainCircuit",
            points: ["Entrada: DADOS + RESPOSTAS", "Saída: REGRAS (o modelo)", "O algoritmo descobre a lógica nos exemplos", "Ex.: aprende com milhares de e-mails rotulados"],
          },
          verdict: "No ML você não programa a regra: você fornece exemplos já respondidos e o algoritmo encontra a regra.",
        },
      ],
    },
    {
      id: "definicao-mitchell",
      tags: ["mitchell"],
      blocks: [
        { type: "heading", eyebrow: "Definição formal (Mitchell, 1997)", text: "Aprender é melhorar com experiência" },
        {
          type: "text",
          md: "Um programa **aprende** com a experiência **E**, numa tarefa **T**, medida por um desempenho **P**, se o seu desempenho em T, medido por P, **melhora com E**.",
        },
        {
          type: "flip-cards",
          cards: [
            { front: "T — Tarefa", back: "Classificar e-mails como spam ou não spam." },
            { front: "P — Desempenho", back: "Percentual de e-mails classificados corretamente." },
            { front: "E — Experiência", back: "Milhares de e-mails já rotulados por pessoas." },
          ],
        },
      ],
    },
    {
      id: "quando-usar-ml",
      tags: ["quando-usar-ml", "regras-vs-ml"],
      blocks: [
        { type: "heading", eyebrow: "Na indústria", text: "Regra ou ML? Depende do problema" },
        {
          type: "comparison",
          left: {
            title: "Regra resolve",
            icon: "Ruler",
            points: ["Defeito mensurável e estável", "Ex.: reprovar cordão de solda com mais de 2 mm de largura", "Fácil de auditar e explicar"],
          },
          right: {
            title: "ML compensa",
            icon: "Eye",
            points: ["Padrão difícil de descrever em regras", "Ex.: porosidade, respingo, variação de iluminação", "Precisa de dados rotulados"],
          },
        },
        {
          type: "mini-check",
          question: "Um sistema reprova a peça se houver mais de 500 pixels escuros na imagem. Isso é Machine Learning?",
          options: ["Sim, porque usa imagem", "Não: é uma regra fixa escrita por alguém", "Sim, porque é visão computacional", "Só se rodar numa GPU"],
          answerIndex: 1,
          explanation: "O limiar de 500 pixels foi definido por uma pessoa e não foi aprendido de dados. Usar imagem ou visão computacional não torna um sistema ML.",
        },
      ],
    },
    {
      id: "hierarquia",
      tags: ["hierarquia"],
      blocks: [
        { type: "heading", eyebrow: "Aula 01, slide 18", text: "IA ⊃ ML ⊃ Deep Learning ⊃ IA generativa" },
        {
          type: "card-grid",
          columns: 2,
          cards: [
            { icon: "Bot", title: "IA", description: "Máquina executando tarefas \"inteligentes\", até com regras escritas à mão (sistemas especialistas)." },
            { icon: "ChartLine", title: "Machine Learning", description: "Subconjunto da IA que aprende com dados. Ex.: Random Forest prevendo falha a partir de sensores." },
            { icon: "Network", title: "Deep Learning", description: "ML com redes neurais de muitas camadas, que aprendem as features direto do dado bruto (pixels, áudio)." },
            { icon: "Sparkles", title: "IA generativa", description: "Modelos que geram conteúdo novo: texto, imagem, código. Ex.: chatbot de procedimentos." },
          ],
        },
      ],
    },
    {
      id: "nuance-generativa",
      tags: ["hierarquia"],
      blocks: [
        { type: "heading", eyebrow: "Fato × nuance", text: "O diagrama descreve a prática atual" },
        {
          type: "text",
          md: "Hoje a IA generativa relevante é construída com **Deep Learning** (Transformers, modelos de difusão), por isso aparece dentro de DL.\n\nMas nem sempre foi assim: **cadeias de Markov** já geravam texto sem nenhuma rede neural.",
        },
        {
          type: "callout",
          variant: "fun",
          title: "Pergunta clássica de plateia",
          md: "\"Todo ML é Deep Learning?\" Não. Uma regressão linear aprende com dados (é ML) e não tem rede neural nenhuma.",
        },
      ],
    },
    {
      id: "linha-do-tempo",
      tags: ["historia"],
      blocks: [
        { type: "heading", eyebrow: "Contexto", text: "Como chegamos até aqui" },
        {
          type: "timeline",
          items: [
            { date: "1943", title: "Neurônio de McCulloch-Pitts", description: "Primeiro modelo matemático de um neurônio." },
            { date: "1958", title: "Perceptron", description: "Rosenblatt cria um neurônio que aprende pesos com exemplos." },
            { date: "2012", title: "AlexNet", description: "Uma rede convolucional vence o ImageNet com folga e dispara a onda do Deep Learning." },
            { date: "2017", title: "Transformer", description: "A arquitetura de atenção vira a base dos grandes modelos de linguagem." },
            { date: "2020", title: "GPT-3", description: "Modelo de linguagem em grande escala populariza a IA generativa de texto." },
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
          title: "Resumo do módulo",
          points: [
            "IA = modelo matemático + dados; não é oráculo.",
            "Modelo é uma função ŷ = f(x; θ); treinar é ajustar θ para reduzir o erro.",
            "Tradicional: regras + dados → respostas. ML: dados + respostas → regras.",
            "Aprender (Mitchell): o desempenho P na tarefa T melhora com a experiência E.",
            "IA ⊃ ML ⊃ DL ⊃ IA generativa; todo DL é ML, mas nem todo ML é DL.",
          ],
        },
      ],
    },
  ],
});
