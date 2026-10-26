import { defineQuiz } from "@/lib/content/define";

/** Banco do módulo 1. Todas as questões são respondíveis com os slides do módulo. */
export const quiz01 = defineQuiz([
  /* ------------------------------ EASY ------------------------------ */
  {
    id: "m1-pilares-mc",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["ia-pilares"],
    prompt: "Quais são os dois pilares de qualquer sistema de IA, segundo o módulo?",
    options: [
      { id: "a", text: "Modelo matemático e dados" },
      { id: "b", text: "Internet e nuvem" },
      { id: "c", text: "GPU e linguagem Python" },
      { id: "d", text: "Intuição e criatividade" },
    ],
    answer: "a",
    explanation:
      "IA é um modelo matemático computacional ajustado com dados. GPU, Python e nuvem são ferramentas que ajudam, mas não definem o que é IA; \"intuição\" é justamente a ideia de oráculo que o módulo desmonta.",
  },
  {
    id: "m1-oraculo-tf",
    type: "true-false",
    difficulty: "easy",
    tags: ["ia-pilares"],
    prompt: "Um modelo de IA bem construído toma decisões independentes dos dados com que foi treinado.",
    answer: false,
    explanation:
      "Falso. O modelo reproduz padrões dos dados de treino, inclusive os vieses. Se os dados forem ruins ou não representativos, ele aprende errado, por mais sofisticado que seja.",
  },
  {
    id: "m1-theta-mc",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["modelo-parametros"],
    prompt: "Em ŷ = f(x; θ), o que θ representa?",
    options: [
      { id: "a", text: "A entrada do modelo" },
      { id: "b", text: "Os parâmetros ajustados no treino" },
      { id: "c", text: "A previsão do modelo" },
      { id: "d", text: "O valor real observado" },
    ],
    answer: "b",
    explanation:
      "θ são os parâmetros, os \"botões\" internos que o treino ajusta. x é a entrada, ŷ é a previsão e y (sem chapéu) é o valor real usado para medir o erro.",
  },
  {
    id: "m1-yhat-fill",
    type: "fill-blank",
    difficulty: "easy",
    tags: ["modelo-parametros"],
    prompt: "Na notação ŷ = f(x; θ), o símbolo ŷ é a ___ do modelo.",
    accepted: ["previsão", "predição", "saída", "previsao", "predicao"],
    hint: "É o que o modelo devolve.",
    explanation:
      "ŷ (\"y chapéu\") é a previsão, a saída do modelo. Ela é comparada com o valor real y para medir o erro durante o treino.",
  },
  {
    id: "m1-quem-define-param-mc",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["modelo-parametros", "treino"],
    prompt: "No exemplo do fertilizante, quem definiu o valor w = 0,4?",
    options: [
      { id: "a", text: "O programador, digitando no código" },
      { id: "b", text: "O treino, a partir dos dados" },
      { id: "c", text: "O professor, por experiência" },
      { id: "d", text: "A biblioteca Python, por padrão" },
    ],
    answer: "b",
    explanation:
      "Os parâmetros saem do treino: o algoritmo ajusta w e b para reduzir o erro nos dados. Ninguém escreveu 0,4 à mão; bibliotecas não têm um w \"padrão\" para o seu problema.",
  },
  {
    id: "m1-tradicional-fill",
    type: "fill-blank",
    difficulty: "easy",
    tags: ["regras-vs-ml"],
    prompt: "Na programação tradicional, REGRAS + DADOS produzem ___.",
    accepted: ["respostas", "resposta", "as respostas"],
    explanation:
      "Tradicional: regras + dados → respostas. No ML a ordem se inverte: dados + respostas → regras (o modelo).",
  },
  {
    id: "m1-ml-entrada-mc",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["regras-vs-ml"],
    prompt: "O que um algoritmo de Machine Learning recebe para produzir um modelo?",
    options: [
      { id: "a", text: "Regras escritas pelo programador" },
      { id: "b", text: "Dados e as respostas esperadas" },
      { id: "c", text: "Apenas as respostas, sem dados" },
      { id: "d", text: "Um banco de regras de outro sistema" },
    ],
    answer: "b",
    explanation:
      "No ML entram dados + respostas (exemplos rotulados) e sai a regra (o modelo). Receber regras prontas é programação tradicional; só respostas sem entradas não permitem aprender relação nenhuma.",
  },
  {
    id: "m1-spam-regra-tf",
    type: "true-false",
    difficulty: "easy",
    tags: ["regras-vs-ml"],
    prompt: "Um filtro que marca como spam todo e-mail com a palavra \"grátis\" é um exemplo de Machine Learning.",
    answer: false,
    explanation:
      "Falso. É uma regra fixa escrita à mão. Ela quebra fácil (\"gr4tis\"). O filtro com ML aprende os padrões a partir de milhares de e-mails rotulados.",
  },
  {
    id: "m1-dl-subconjunto-tf",
    type: "true-false",
    difficulty: "easy",
    tags: ["hierarquia"],
    prompt: "Todo Deep Learning é Machine Learning.",
    answer: true,
    explanation:
      "Verdadeiro. Deep Learning é um subconjunto do ML: redes neurais profundas também aprendem com dados. O contrário não vale.",
  },
  {
    id: "m1-ml-subconjunto-tf",
    type: "true-false",
    difficulty: "easy",
    tags: ["hierarquia"],
    prompt: "Todo Machine Learning é Deep Learning.",
    answer: false,
    explanation:
      "Falso. Regressão linear e Random Forest aprendem com dados (são ML) e não usam redes neurais profundas.",
  },
  {
    id: "m1-generativa-mc",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["hierarquia"],
    prompt: "O que caracteriza a IA generativa?",
    options: [
      { id: "a", text: "Gera conteúdo novo, como texto, imagem ou código" },
      { id: "b", text: "Só classifica dados em categorias" },
      { id: "c", text: "Funciona sem nenhum dado de treino" },
      { id: "d", text: "Usa apenas regras escritas à mão" },
    ],
    answer: "a",
    explanation:
      "IA generativa produz conteúdo novo. Classificar é outra tarefa; ela precisa de muitos dados de treino; e regras à mão descrevem sistemas especialistas, não modelos generativos atuais.",
  },
  {
    id: "m1-ia-ampla-mc",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["hierarquia"],
    prompt: "Qual é o círculo mais amplo da hierarquia?",
    options: [
      { id: "a", text: "Inteligência Artificial" },
      { id: "b", text: "Machine Learning" },
      { id: "c", text: "Deep Learning" },
      { id: "d", text: "IA generativa" },
    ],
    answer: "a",
    explanation:
      "IA ⊃ ML ⊃ DL ⊃ IA generativa. IA é o mais amplo porque inclui até sistemas baseados só em regras escritas à mão.",
  },
  {
    id: "m1-treino-objetivo-mc",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["treino"],
    prompt: "Qual é o objetivo do treino de um modelo?",
    options: [
      { id: "a", text: "Ajustar os parâmetros para reduzir o erro nos dados" },
      { id: "b", text: "Escrever as regras de decisão manualmente" },
      { id: "c", text: "Aumentar o número de dados disponíveis" },
      { id: "d", text: "Deixar o modelo mais rápido de executar" },
    ],
    answer: "a",
    explanation:
      "Treinar é ajustar θ para que ŷ fique o mais perto possível de y. Escrever regras é programação tradicional; coletar dados e otimizar velocidade são etapas diferentes.",
  },
  {
    id: "m1-mitchell-letras-match",
    type: "matching",
    difficulty: "easy",
    tags: ["mitchell"],
    prompt: "Associe cada letra da definição de Mitchell ao seu significado.",
    pairs: [
      { id: "t", left: "T", right: "Tarefa" },
      { id: "p", left: "P", right: "Desempenho" },
      { id: "e", left: "E", right: "Experiência" },
    ],
    explanation:
      "T é a tarefa (ex.: classificar spam), P é a medida de desempenho (ex.: % de acertos) e E é a experiência (ex.: e-mails rotulados).",
  },
  {
    id: "m1-historia-perceptron-mc",
    type: "multiple-choice",
    difficulty: "easy",
    tags: ["historia"],
    prompt: "O que foi o Perceptron, criado por Rosenblatt em 1958?",
    options: [
      { id: "a", text: "Um neurônio artificial que aprende pesos com exemplos" },
      { id: "b", text: "O primeiro modelo de linguagem em grande escala" },
      { id: "c", text: "Uma rede convolucional que venceu o ImageNet" },
      { id: "d", text: "Um banco de dados para treinar IA" },
    ],
    answer: "a",
    explanation:
      "O Perceptron é um neurônio que aprende pesos com exemplos. O grande modelo de linguagem é o GPT-3 (2020); a rede convolucional campeã do ImageNet é a AlexNet (2012).",
  },
  {
    id: "m1-pilares-dados-ruins-tf",
    type: "true-false",
    difficulty: "easy",
    tags: ["ia-pilares"],
    prompt: "Se os dados de treino não representam a realidade, um modelo sofisticado ainda assim aprende o padrão correto.",
    answer: false,
    explanation:
      "Falso. A sofisticação do modelo não compensa dados ruins: ele aprende os padrões presentes nos dados, inclusive distorções.",
  },

  /* ----------------------------- MEDIUM ----------------------------- */
  {
    id: "m1-calc-fertilizante-mc",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["modelo-parametros", "treino"],
    prompt: "Com crescimento = 0,4 · fertilizante + 5, qual a previsão para 25 g?",
    options: [
      { id: "a", text: "10 cm" },
      { id: "b", text: "15 cm" },
      { id: "c", text: "30 cm" },
      { id: "d", text: "12,5 cm" },
    ],
    answer: "b",
    explanation: "0,4 · 25 = 10; 10 + 5 = 15 cm. Quem marcou 10 esqueceu o b; 30 é 25 + 5 sem multiplicar por w.",
  },
  {
    id: "m1-calc-zero-mc",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["modelo-parametros"],
    prompt: "No modelo do fertilizante (w = 0,4; b = 5), o que b representa?",
    options: [
      { id: "a", text: "O crescimento previsto quando não há fertilizante" },
      { id: "b", text: "Quanto a planta cresce a mais por grama" },
      { id: "c", text: "O erro do modelo" },
      { id: "d", text: "A quantidade ideal de fertilizante" },
    ],
    answer: "a",
    explanation:
      "Com 0 g, crescimento = 0,4 · 0 + 5 = 5 cm, então b é a previsão sem fertilizante. O ganho por grama é w (0,4 cm/g); o erro é a diferença entre ŷ e y.",
  },
  {
    id: "m1-output-prever",
    type: "output",
    difficulty: "medium",
    tags: ["modelo-parametros", "treino"],
    prompt: "Qual é a saída deste código?",
    language: "python",
    code: "w, b = 0.4, 5\n\ndef prever(g):\n    return w * g + b\n\nprint(prever(10))",
    options: [
      { id: "a", text: "9.0" },
      { id: "b", text: "4.0" },
      { id: "c", text: "15.0" },
      { id: "d", text: "5.4" },
    ],
    answer: "a",
    explanation: "0.4 · 10 = 4.0; 4.0 + 5 = 9.0. 4.0 ignora o b; 5.4 soma w e b sem multiplicar pela entrada.",
  },
  {
    id: "m1-output-erro",
    type: "output",
    difficulty: "medium",
    tags: ["treino"],
    prompt: "Qual é a saída deste código, que mede o erro de uma previsão?",
    language: "python",
    code: "y_real = 13\ny_prev = 0.4 * 20 + 5\nprint(y_real - y_prev)",
    options: [
      { id: "a", text: "0.0" },
      { id: "b", text: "13.0" },
      { id: "c", text: "-8.0" },
      { id: "d", text: "5.0" },
    ],
    answer: "a",
    explanation:
      "0.4 · 20 + 5 = 13.0, igual ao valor real (13), então o erro é 0.0. Para esse ponto o modelo acertou em cheio.",
  },
  {
    id: "m1-steps-ordering",
    type: "ordering",
    difficulty: "medium",
    tags: ["treino"],
    prompt: "Coloque o ciclo de treino na ordem correta.",
    items: [
      { id: "prever", text: "Prever com os parâmetros atuais" },
      { id: "medir", text: "Medir o erro comparando com o valor real" },
      { id: "ajustar", text: "Ajustar os parâmetros para reduzir o erro" },
      { id: "repetir", text: "Repetir até o erro parar de cair" },
    ],
    explanation:
      "Primeiro o modelo prevê; sem previsão não há erro para medir. Depois ajusta os parâmetros e repete o ciclo. Esse mesmo ciclo aparece na regressão logística e nas redes neurais.",
  },
  {
    id: "m1-ml-ordem-ordering",
    type: "ordering",
    difficulty: "medium",
    tags: ["regras-vs-ml", "treino"],
    prompt: "Ordene as etapas de um filtro de spam com Machine Learning.",
    items: [
      { id: "coletar", text: "Reunir e-mails já rotulados como spam ou não spam" },
      { id: "treinar", text: "Treinar o modelo com esses exemplos" },
      { id: "classificar", text: "Usar o modelo para classificar e-mails novos" },
    ],
    explanation:
      "No ML, os dados com respostas vêm primeiro (e-mails rotulados); o treino extrai a regra; só então o modelo é usado em e-mails novos.",
  },
  {
    id: "m1-pixels-mc",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["quando-usar-ml", "regras-vs-ml"],
    prompt: "Um sistema reprova a peça quando há mais de 500 pixels escuros na imagem. Como classificá-lo?",
    options: [
      { id: "a", text: "Regra fixa: o limiar foi definido por uma pessoa" },
      { id: "b", text: "Machine Learning, porque processa imagem" },
      { id: "c", text: "Deep Learning, porque é visão computacional" },
      { id: "d", text: "IA generativa, porque produz uma decisão" },
    ],
    answer: "a",
    explanation:
      "O limiar de 500 não foi aprendido de dados; alguém escolheu. Processar imagem não torna um sistema ML, e produzir uma decisão não é gerar conteúdo novo.",
  },
  {
    id: "m1-quando-regra-mc",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["quando-usar-ml"],
    prompt: "Em qual caso uma regra escrita à mão costuma ser a melhor escolha?",
    options: [
      { id: "a", text: "Reprovar cordão de solda com largura acima de 2 mm" },
      { id: "b", text: "Detectar porosidade sob iluminação variável" },
      { id: "c", text: "Reconhecer rostos em fotos" },
      { id: "d", text: "Classificar o sentimento de comentários" },
    ],
    answer: "a",
    explanation:
      "Largura acima de 2 mm é mensurável e estável: uma regra resolve e é fácil de auditar. Porosidade com luz variável, rostos e sentimento são padrões difíceis de descrever em regras.",
  },
  {
    id: "m1-quando-ml-multi",
    type: "multi-select",
    difficulty: "medium",
    tags: ["quando-usar-ml"],
    prompt: "Marque os cenários em que Machine Learning tende a compensar mais que regras fixas.",
    options: [
      { id: "a", text: "Identificar respingos de solda em fotos com iluminação variável" },
      { id: "b", text: "Bloquear a máquina se a porta de segurança estiver aberta" },
      { id: "c", text: "Detectar spam que muda de formato o tempo todo" },
      { id: "d", text: "Converter milímetros em polegadas" },
    ],
    answers: ["a", "c"],
    explanation:
      "Respingos com luz variável e spam mutante são padrões difíceis de escrever em regra. A porta de segurança é uma condição simples e crítica (regra é melhor e auditável) e a conversão de unidades é uma fórmula exata.",
  },
  {
    id: "m1-ml-precisa-dados-tf",
    type: "true-false",
    difficulty: "medium",
    tags: ["quando-usar-ml"],
    prompt: "Para usar ML na inspeção de defeitos, é preciso ter exemplos rotulados (peças boas e com defeito).",
    answer: true,
    explanation:
      "Verdadeiro. No aprendizado do módulo, o ML recebe dados + respostas. Sem exemplos rotulados, não há de onde extrair a regra de \"defeito\".",
  },
  {
    id: "m1-mitchell-spam-match",
    type: "matching",
    difficulty: "medium",
    tags: ["mitchell"],
    prompt: "No filtro de spam, associe cada elemento da definição de Mitchell ao exemplo.",
    pairs: [
      { id: "t", left: "Tarefa (T)", right: "Classificar e-mails como spam ou não spam" },
      { id: "p", left: "Desempenho (P)", right: "Percentual de e-mails classificados corretamente" },
      { id: "e", left: "Experiência (E)", right: "Milhares de e-mails já rotulados" },
    ],
    explanation:
      "A tarefa é o que o sistema faz, o desempenho é como medimos se faz bem e a experiência são os dados com que ele aprende.",
  },
  {
    id: "m1-mitchell-aprender-mc",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["mitchell"],
    prompt: "Pela definição de Mitchell, quando dizemos que um programa aprendeu?",
    options: [
      { id: "a", text: "Quando o desempenho na tarefa melhora com a experiência" },
      { id: "b", text: "Quando roda sem nenhum erro de execução" },
      { id: "c", text: "Quando tem mais regras que a versão anterior" },
      { id: "d", text: "Quando usa redes neurais" },
    ],
    answer: "a",
    explanation:
      "Aprender = P melhora em T conforme cresce E. Rodar sem bug, ter mais regras ou usar redes neurais não implica aprender com dados.",
  },
  {
    id: "m1-mitchell-p-fill",
    type: "fill-blank",
    difficulty: "medium",
    tags: ["mitchell"],
    prompt: "Na definição de Mitchell, a letra P representa o ___.",
    accepted: ["desempenho", "performance"],
    explanation:
      "P é a medida de desempenho, por exemplo o percentual de acertos. T é a tarefa e E a experiência.",
  },
  {
    id: "m1-hierarquia-ordering",
    type: "ordering",
    difficulty: "medium",
    tags: ["hierarquia"],
    prompt: "Ordene do conceito mais amplo para o mais específico.",
    items: [
      { id: "ia", text: "Inteligência Artificial" },
      { id: "ml", text: "Machine Learning" },
      { id: "dl", text: "Deep Learning" },
      { id: "gen", text: "IA generativa" },
    ],
    explanation:
      "IA ⊃ ML ⊃ DL ⊃ IA generativa. Lembre que a IA generativa aparece dentro de DL porque hoje é feita com redes profundas.",
  },
  {
    id: "m1-hierarquia-exemplos-match",
    type: "matching",
    difficulty: "medium",
    tags: ["hierarquia"],
    prompt: "Associe cada exemplo da fábrica à camada mais específica em que ele se encaixa.",
    pairs: [
      { id: "ia", left: "Sistema especialista com regras \"se X e Y, troque Z\"", right: "IA (sem aprendizado)" },
      { id: "ml", left: "Random Forest prevendo falha a partir de sensores", right: "Machine Learning" },
      { id: "dl", left: "CNN detectando defeito direto na imagem", right: "Deep Learning" },
      { id: "gen", left: "Chatbot que responde dúvidas de procedimento", right: "IA generativa" },
    ],
    explanation:
      "Regras escritas à mão são IA sem aprendizado. Random Forest aprende com dados, mas não é rede neural (ML). A CNN é rede profunda que aprende do pixel (DL). O chatbot gera texto novo (IA generativa).",
  },
  {
    id: "m1-dl-dado-bruto-mc",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["hierarquia"],
    prompt: "O que diferencia o Deep Learning de outros métodos de ML, segundo o módulo?",
    options: [
      { id: "a", text: "Aprende as features direto do dado bruto, com redes de muitas camadas" },
      { id: "b", text: "Não precisa de dados para aprender" },
      { id: "c", text: "Usa apenas regras escritas à mão" },
      { id: "d", text: "Só funciona com dados em tabela" },
    ],
    answer: "a",
    explanation:
      "Redes profundas aprendem representações direto de pixels, áudio etc. Elas precisam de muitos dados, não usam regras à mão e brilham justamente em dados não tabulares.",
  },
  {
    id: "m1-sistema-especialista-tf",
    type: "true-false",
    difficulty: "medium",
    tags: ["hierarquia"],
    prompt: "Um sistema especialista baseado só em regras escritas à mão pode ser considerado IA, mesmo sem aprender com dados.",
    answer: true,
    explanation:
      "Verdadeiro. IA é o círculo mais amplo e inclui sistemas que executam tarefas \"inteligentes\" com regras. Ele só não é Machine Learning.",
  },
  {
    id: "m1-random-forest-mc",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["hierarquia"],
    prompt: "Uma Random Forest que prevê falha de motor a partir de sensores é melhor classificada como:",
    options: [
      { id: "a", text: "Machine Learning, mas não Deep Learning" },
      { id: "b", text: "Deep Learning" },
      { id: "c", text: "IA generativa" },
      { id: "d", text: "Programação tradicional" },
    ],
    answer: "a",
    explanation:
      "Ela aprende com dados (ML), mas não é uma rede neural profunda (não é DL) e não gera conteúdo novo (não é generativa).",
  },
  {
    id: "m1-regressao-linear-ml-tf",
    type: "true-false",
    difficulty: "medium",
    tags: ["hierarquia", "modelo-parametros"],
    prompt: "O modelo do fertilizante (crescimento = w · fertilizante + b) é Machine Learning mesmo sem usar rede neural.",
    answer: true,
    explanation:
      "Verdadeiro. Os parâmetros w e b são aprendidos com dados, então é ML. Não ter rede neural só significa que não é Deep Learning.",
  },
  {
    id: "m1-vies-mc",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["ia-pilares"],
    prompt: "Um modelo de aprovação de crédito treinado com histórico enviesado tende a:",
    options: [
      { id: "a", text: "Reproduzir o viés presente nos dados" },
      { id: "b", text: "Corrigir o viés automaticamente" },
      { id: "c", text: "Ignorar o histórico e decidir de forma neutra" },
      { id: "d", text: "Recusar-se a treinar" },
    ],
    answer: "a",
    explanation:
      "O modelo reproduz padrões dos dados de treino, inclusive vieses. Ele não tem como saber sozinho que um padrão é injusto, e não descarta o histórico.",
  },
  {
    id: "m1-componentes-multi",
    type: "multi-select",
    difficulty: "medium",
    tags: ["modelo-parametros"],
    prompt: "Marque os itens que são ENTRADAS (x) possíveis de um modelo.",
    options: [
      { id: "a", text: "Vibração e temperatura de um motor" },
      { id: "b", text: "Pixels de uma imagem" },
      { id: "c", text: "Os pesos ajustados no treino" },
      { id: "d", text: "O texto de um e-mail" },
    ],
    answers: ["a", "b", "d"],
    explanation:
      "Vibração, pixels e texto são dados de entrada. Os pesos ajustados no treino são parâmetros (θ), não entradas.",
  },
  {
    id: "m1-generativa-dl-mc",
    type: "multiple-choice",
    difficulty: "medium",
    tags: ["hierarquia"],
    prompt: "Por que a IA generativa aparece dentro de Deep Learning no diagrama?",
    options: [
      { id: "a", text: "Porque a IA generativa atual é construída com redes profundas" },
      { id: "b", text: "Porque é impossível gerar conteúdo sem rede neural" },
      { id: "c", text: "Porque IA generativa não usa dados" },
      { id: "d", text: "Porque todo Deep Learning é generativo" },
    ],
    answer: "a",
    explanation:
      "O diagrama descreve a prática atual (Transformers, difusão). Não é impossível gerar sem rede neural: cadeias de Markov já geravam texto. E muito DL não é generativo, como uma CNN que classifica defeitos.",
  },
  {
    id: "m1-tradicional-vs-ml-multi",
    type: "multi-select",
    difficulty: "medium",
    tags: ["regras-vs-ml"],
    prompt: "Marque as afirmações verdadeiras sobre Machine Learning.",
    options: [
      { id: "a", text: "Recebe dados e respostas e produz a regra" },
      { id: "b", text: "Dispensa exemplos, pois descobre tudo sozinho" },
      { id: "c", text: "A lógica final é descoberta pelo algoritmo" },
      { id: "d", text: "Sempre exige redes neurais" },
    ],
    answers: ["a", "c"],
    explanation:
      "ML recebe dados + respostas e o algoritmo descobre a lógica. Ele depende de exemplos, e muitos métodos de ML (regressão, árvores) não usam redes neurais.",
  },
  {
    id: "m1-historia-ordering",
    type: "ordering",
    difficulty: "medium",
    tags: ["historia"],
    prompt: "Ordene os marcos da IA do mais antigo para o mais recente.",
    items: [
      { id: "mcp", text: "Neurônio de McCulloch-Pitts" },
      { id: "perceptron", text: "Perceptron de Rosenblatt" },
      { id: "alexnet", text: "AlexNet vence o ImageNet" },
      { id: "transformer", text: "Arquitetura Transformer" },
      { id: "gpt3", text: "GPT-3" },
    ],
    explanation: "1943 (McCulloch-Pitts) → 1958 (Perceptron) → 2012 (AlexNet) → 2017 (Transformer) → 2020 (GPT-3).",
  },
  {
    id: "m1-historia-match",
    type: "matching",
    difficulty: "medium",
    tags: ["historia"],
    prompt: "Associe cada marco ao ano.",
    pairs: [
      { id: "perceptron", left: "Perceptron", right: "1958" },
      { id: "alexnet", left: "AlexNet", right: "2012" },
      { id: "transformer", left: "Transformer", right: "2017" },
      { id: "gpt3", left: "GPT-3", right: "2020" },
    ],
    explanation:
      "Perceptron em 1958, AlexNet em 2012 (início da onda de Deep Learning), Transformer em 2017 e GPT-3 em 2020.",
  },
  {
    id: "m1-treino-erro-tf",
    type: "true-false",
    difficulty: "medium",
    tags: ["treino"],
    prompt: "No treino, os parâmetros são ajustados na direção que aumenta o erro, para o modelo explorar mais possibilidades.",
    answer: false,
    explanation: "Falso. Os parâmetros são ajustados na direção que DIMINUI o erro; o ciclo se repete até o erro parar de cair.",
  },
  {
    id: "m1-ml-fill",
    type: "fill-blank",
    difficulty: "medium",
    tags: ["regras-vs-ml"],
    prompt: "No Machine Learning, DADOS + RESPOSTAS produzem as ___.",
    accepted: ["regras", "regra", "as regras", "o modelo", "modelo"],
    explanation: "No ML a saída do algoritmo são as regras, ou seja, o modelo. Na programação tradicional, a saída são as respostas.",
  },

  /* ------------------------------ HARD ------------------------------ */
  {
    id: "m1-calc-inverso-mc",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["modelo-parametros"],
    prompt: "Com crescimento = 0,4 · fertilizante + 5, quantos gramas o modelo indica para a planta crescer 13 cm?",
    options: [
      { id: "a", text: "20 g" },
      { id: "b", text: "32,5 g" },
      { id: "c", text: "10,2 g" },
      { id: "d", text: "8 g" },
    ],
    answer: "a",
    explanation:
      "13 = 0,4 · g + 5 → 0,4 · g = 8 → g = 20 g. 32,5 vem de dividir 13 por 0,4 sem descontar o b; 8 é o valor de 0,4 · g, não de g.",
  },
  {
    id: "m1-output-dois-modelos",
    type: "output",
    difficulty: "hard",
    tags: ["treino", "modelo-parametros"],
    prompt: "Dois modelos candidatos são testados no ponto (20 g, 13 cm). Qual é a saída do código?",
    language: "python",
    code: "x, y = 20, 13\nmodelo_a = 0.5 * x + 2\nmodelo_b = 0.4 * x + 5\nprint(abs(y - modelo_a), abs(y - modelo_b))",
    options: [
      { id: "a", text: "1.0 0.0" },
      { id: "b", text: "0.0 1.0" },
      { id: "c", text: "0.0 0.0" },
      { id: "d", text: "12.0 13.0" },
    ],
    answer: "a",
    explanation:
      "Modelo A: 0.5 · 20 + 2 = 12 → erro |13 − 12| = 1.0. Modelo B: 0.4 · 20 + 5 = 13 → erro 0.0. A opção 12.0 13.0 mostra as previsões, não os erros. Para escolher entre os dois, o treino olha o erro em todos os pontos, não em um só.",
  },
  {
    id: "m1-um-ponto-tf",
    type: "true-false",
    difficulty: "hard",
    tags: ["treino"],
    prompt: "Se um modelo acerta um único ponto de dado em cheio, isso prova que seus parâmetros estão corretos.",
    answer: false,
    explanation:
      "Falso. Vários conjuntos de parâmetros podem acertar o mesmo ponto (ex.: 0,5x + 2 e 0,4x + 5 acertam (30, 17)). O treino mede o erro em todos os dados.",
  },
  {
    id: "m1-camera-ml-mc",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["quando-usar-ml", "hierarquia"],
    prompt:
      "Uma linha usa câmera e um limiar de brilho ajustado manualmente pelo técnico a cada troca de lote. A equipe quer trocar por ML. Qual pré-requisito é indispensável?",
    options: [
      { id: "a", text: "Ter imagens rotuladas de peças boas e defeituosas" },
      { id: "b", text: "Trocar a câmera por uma de resolução maior" },
      { id: "c", text: "Escrever mais regras de brilho" },
      { id: "d", text: "Usar obrigatoriamente IA generativa" },
    ],
    answer: "a",
    explanation:
      "ML precisa de dados + respostas: imagens com rótulo. Resolução maior pode ajudar, mas não é o pré-requisito; mais regras continuam sendo programação tradicional; e a tarefa é classificar, não gerar conteúdo.",
  },
  {
    id: "m1-mitchell-cenario-mc",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["mitchell"],
    prompt:
      "Um modelo de previsão de falha passa de 70% para 85% de acerto depois de receber mais 6 meses de histórico. Pela definição de Mitchell, o que é E nesse caso?",
    options: [
      { id: "a", text: "Os 6 meses adicionais de histórico" },
      { id: "b", text: "O acerto de 85%" },
      { id: "c", text: "Prever falhas de motor" },
      { id: "d", text: "O algoritmo usado" },
    ],
    answer: "a",
    explanation:
      "E é a experiência, os dados com que o modelo aprende: o histórico adicional. 85% é P (desempenho) e prever falhas é T (tarefa). O algoritmo não aparece na definição.",
  },
  {
    id: "m1-mitchell-nao-aprende-tf",
    type: "true-false",
    difficulty: "hard",
    tags: ["mitchell", "regras-vs-ml"],
    prompt:
      "Um sistema de regras fixas que acerta 99% dos casos, mas cujo desempenho não muda com mais dados, \"aprende\" segundo a definição de Mitchell.",
    answer: false,
    explanation:
      "Falso. Desempenho alto não basta: aprender exige que P melhore com E. Se mais dados não mudam nada, o sistema não aprende, por melhor que seja.",
  },
  {
    id: "m1-markov-mc",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["hierarquia"],
    prompt: "Qual exemplo mostra que gerar conteúdo não exige necessariamente Deep Learning?",
    options: [
      { id: "a", text: "Cadeias de Markov gerando texto" },
      { id: "b", text: "Uma CNN classificando defeitos" },
      { id: "c", text: "Uma Random Forest prevendo falhas" },
      { id: "d", text: "Um Transformer gerando código" },
    ],
    answer: "a",
    explanation:
      "Cadeias de Markov geram texto sem rede neural. A CNN e a Random Forest não geram conteúdo; o Transformer gera, mas é Deep Learning, então não prova o ponto.",
  },
  {
    id: "m1-afirmacoes-hierarquia-multi",
    type: "multi-select",
    difficulty: "hard",
    tags: ["hierarquia"],
    prompt: "Marque as afirmações corretas.",
    options: [
      { id: "a", text: "Todo sistema de Deep Learning é também IA" },
      { id: "b", text: "Todo sistema de IA aprende com dados" },
      { id: "c", text: "Uma CNN que classifica defeitos é DL, mas não é IA generativa" },
      { id: "d", text: "Um sistema especialista de regras é Machine Learning" },
    ],
    answers: ["a", "c"],
    explanation:
      "DL está dentro de IA, e a CNN classifica (não gera), então é DL sem ser generativa. Nem toda IA aprende com dados (sistemas especialistas usam regras), por isso eles não são ML.",
  },
  {
    id: "m1-vies-solucao-mc",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["ia-pilares"],
    prompt:
      "Um modelo de inspeção foi treinado só com fotos do turno da manhã e erra muito à noite. Qual a causa mais provável, pelo que o módulo ensina?",
    options: [
      { id: "a", text: "Os dados de treino não representam as condições reais de uso" },
      { id: "b", text: "O modelo é simples demais e precisa de mais camadas" },
      { id: "c", text: "Faltam regras escritas à mão para a noite" },
      { id: "d", text: "A IA decidiu ignorar o turno da noite" },
    ],
    answer: "a",
    explanation:
      "Um modelo aprende o que está nos dados; sem fotos noturnas (outra iluminação), ele não aprendeu esse cenário. Aumentar camadas não cria dados que faltam; regras à mão fogem do ML; e o modelo não \"decide\" nada sozinho.",
  },
  {
    id: "m1-parametro-vs-entrada-mc",
    type: "multiple-choice",
    difficulty: "hard",
    tags: ["modelo-parametros"],
    prompt: "Depois do treino, o que muda de uma previsão para outra no modelo do fertilizante?",
    options: [
      { id: "a", text: "Só a entrada x; w e b ficam fixos" },
      { id: "b", text: "w e b mudam a cada nova previsão" },
      { id: "c", text: "Tudo muda, inclusive a fórmula" },
      { id: "d", text: "Nada muda; a previsão é sempre a mesma" },
    ],
    answer: "a",
    explanation:
      "Os parâmetros são ajustados no treino e depois ficam fixos no uso. O que varia é a entrada (gramas de fertilizante), por isso a previsão varia.",
  },
  {
    id: "m1-ml-regra-hibrido-multi",
    type: "multi-select",
    difficulty: "hard",
    tags: ["quando-usar-ml", "regras-vs-ml"],
    prompt: "Numa célula de solda, quais decisões fazem mais sentido manter como regra fixa?",
    options: [
      { id: "a", text: "Parar o robô se a cortina de luz for interrompida" },
      { id: "b", text: "Classificar o aspecto visual do cordão com variação de luz" },
      { id: "c", text: "Reprovar peça com cordão acima de 2 mm de largura medida" },
      { id: "d", text: "Detectar respingos de formatos variados nas fotos" },
    ],
    answers: ["a", "c"],
    explanation:
      "Segurança e medidas objetivas são regras claras e auditáveis. Aspecto visual com luz variável e respingos de formatos variados são padrões difíceis de escrever, onde ML compensa.",
  },
]);
