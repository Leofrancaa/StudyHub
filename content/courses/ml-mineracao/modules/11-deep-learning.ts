import { defineModule } from "@/lib/content/define";

/**
 * Fontes: Aula12 (regressão logística como neurônio, McCulloch-Pitts, Perceptron, ativações, arquiteturas, losses),
 * Aula13 (gradiente, descida do gradiente, learning rate, backpropagation, otimizadores), MD 13 (regra delta, frameworks;
 * o arquivo .ppt estava corrompido e só parte do texto foi recuperada).
 * Fora do material: limite do XOR (1969), retropropagação de 1986, tanh e contagem de parâmetros.
 */
export const module11 = defineModule({
  slug: "deep-learning",
  title: "Deep Learning",
  description: "Do neurônio artificial ao treino de redes: ativações, loss, gradiente, backpropagation e otimizadores.",
  objectives: [
    "Explicar o perceptron e o papel das funções de ativação",
    "Escolher a função de perda certa e interpretar o gradiente",
    "Descrever backpropagation, learning rate e otimizadores no treino de uma rede",
  ],
  estimatedMinutes: 45,
  questionsPerAttempt: 10,
  slides: [
    {
      id: "abertura",
      tags: [],
      blocks: [
        { type: "heading", eyebrow: "Módulo 11", text: "Muitas regressões logísticas em camadas" },
        { type: "text", md: "A Aula 12 começa relembrando a regressão logística: **ŷ = σ(w·x + b)**. Uma rede neural mantém essa ideia e **conecta muitas dessas unidades em camadas**." },
        {
          type: "card-grid",
          columns: 3,
          cards: [
            { icon: "BrainCircuit", title: "Neurônio", description: "Soma ponderada + ativação." },
            { icon: "Network", title: "Rede", description: "Camadas que aprendem representações." },
            { icon: "ChartLine", title: "Treino", description: "Loss, gradiente, backprop e otimizador." },
          ],
        },
      ],
    },
    {
      id: "historia",
      tags: ["historia"],
      blocks: [
        { type: "heading", eyebrow: "Aula 12", text: "Uma história de altos e baixos" },
        {
          type: "timeline",
          items: [
            { date: "1943", title: "McCulloch e Pitts", description: "Primeiro modelo matemático do neurônio, com entradas e saída binárias." },
            { date: "1958", title: "Perceptron", description: "Frank Rosenblatt cria um neurônio que aprende os pesos com exemplos." },
            { date: "1969", title: "O limite do XOR", description: "Minsky e Papert mostram que um perceptron sozinho não separa o XOR: o interesse esfria." },
            { date: "1986", title: "Backpropagation", description: "Rumelhart, Hinton e Williams popularizam o treino de redes com várias camadas." },
            { date: "2012", title: "AlexNet", description: "GPUs + muitos dados: redes profundas vencem o ImageNet." },
          ],
        },
      ],
    },
    {
      id: "perceptron",
      tags: ["perceptron"],
      blocks: [
        { type: "heading", eyebrow: "Aula 12 · MD 13", text: "O perceptron" },
        {
          type: "code",
          language: "text",
          code: "ŷ = f( Σ wᵢ·xᵢ + b )\n\nxᵢ  entradas      wᵢ  pesos (importância de cada entrada)\nb   bias          f   função de ativação\n\nRegra delta (MD 13):  w ← w + η · e · x     (e = erro, η = taxa de aprendizagem)",
        },
        {
          type: "analogy",
          icon: "Users",
          concept: { title: "Neurônio artificial", description: "Cada entrada vota com um peso; se a soma passa de um ponto, o neurônio \"dispara\"." },
          analogy: { title: "Comitê de decisão", description: "O diretor de qualidade pesa mais que o estagiário. Somam-se os votos ponderados e, acima de um limite, a peça é reprovada." },
        },
      ],
    },
    {
      id: "ativacao",
      tags: ["ativacao"],
      blocks: [
        { type: "heading", eyebrow: "Aula 12", text: "Funções de ativação" },
        {
          type: "card-grid",
          columns: 2,
          cards: [
            { icon: "ChartLine", title: "Sigmoide", description: "1/(1 + e^(−z)) → (0, 1). Saída binária como probabilidade." },
            { icon: "Zap", title: "ReLU", description: "max(0, z). Padrão nas camadas ocultas: simples e evita gradientes minúsculos." },
            { icon: "Layers", title: "Softmax", description: "e^(zᵢ)/Σe^(zⱼ). Saída multiclasse: probabilidades que somam 1." },
            { icon: "Scale", title: "Tanh", description: "→ (−1, 1). Parecida com a sigmoide, centrada em zero." },
          ],
        },
        {
          type: "mini-check",
          question: "Quanto vale ReLU(−3)?",
          options: ["−3", "0", "3", "0,05"],
          answerIndex: 1,
          explanation: "ReLU zera tudo que é negativo: max(0, −3) = 0.",
        },
      ],
    },
    {
      id: "arquitetura",
      tags: ["arquitetura"],
      blocks: [
        { type: "heading", eyebrow: "Aula 12", text: "Camadas e profundidade" },
        {
          type: "text",
          md: "- **Entrada**: uma unidade por feature.\n- **Ocultas**: aprendem representações intermediárias. **Profunda** = várias ocultas.\n- **Saída**: 1 neurônio sigmoide (binário), k neurônios softmax (multiclasse) ou linear (regressão).\n\nSem ativação não linear, empilhar camadas lineares dá só **outra função linear**: é a não linearidade que dá poder à rede.",
        },
        { type: "callout", variant: "tip", md: "Parâmetros de uma camada densa = entradas × neurônios + neurônios (bias). Rede 3 → 4 → 2: (3·4 + 4) + (4·2 + 2) = **26**." },
      ],
    },
    {
      id: "rede-interativa",
      tags: ["arquitetura", "backprop"],
      blocks: [
        { type: "heading", eyebrow: "Mão na massa", text: "Monte uma rede e veja o sinal passar" },
        {
          type: "interactive-3d",
          sceneId: "neural-net",
          caption: "Mude camadas e neurônios e veja o número de parâmetros explodir. O forward leva a entrada até a saída; o backpropagation devolve o erro da saída para as camadas anteriores.",
        },
      ],
    },
    {
      id: "loss",
      tags: ["loss"],
      blocks: [
        { type: "heading", eyebrow: "Aula 12", text: "Funções de perda (loss)" },
        {
          type: "card-grid",
          columns: 3,
          cards: [
            { icon: "Ruler", title: "MSE", description: "Regressão. y = 100, ŷ = 90 → (100 − 90)² = 100." },
            { icon: "Target", title: "Entropia cruzada binária", description: "Duas classes. y = 1, ŷ = 0,88 → −ln(0,88) ≈ 0,128." },
            { icon: "Layers", title: "Entropia cruzada categórica", description: "Multiclasse. Classe certa com ŷ = 0,80 → −ln(0,80) ≈ 0,223." },
          ],
        },
        { type: "text", md: "A loss diz **quanto** a rede errou. A pergunta seguinte da Aula 13 é: **como ela aprende com esse erro?**" },
      ],
    },
    {
      id: "gradiente",
      tags: ["gradiente"],
      blocks: [
        { type: "heading", eyebrow: "Aula 13", text: "Gradiente e descida do gradiente" },
        {
          type: "text",
          md: "O gradiente ∂L/∂w diz **como a loss muda quando o peso muda**:\n\n- ∂L/∂w > 0 → aumentar w aumenta a loss → **diminua w**\n- ∂L/∂w < 0 → aumentar w diminui a loss → **aumente w**\n- ∂L/∂w = 0 → possivelmente perto de um mínimo\n\nDescida do gradiente: **w ← w − η · ∂L/∂w**, sempre contra o gradiente.",
        },
      ],
    },
    {
      id: "learning-rate",
      tags: ["learning-rate", "gradiente"],
      blocks: [
        { type: "heading", eyebrow: "Aula 13", text: "Learning rate: o tamanho do passo" },
        {
          type: "interactive-3d",
          sceneId: "gradient-descent",
          caption: "Learning rate pequena: desce, mas devagar. Média: zigue-zague. Grande demais (> 0,67 nesta tigela): cada passo passa do mínimo e a loss explode.",
        },
      ],
    },
    {
      id: "backprop",
      tags: ["backprop"],
      blocks: [
        { type: "heading", eyebrow: "Aula 13", text: "Backpropagation" },
        {
          type: "code",
          language: "text",
          code: "z = w·x + b      a = σ(z)      L = Loss(a, y)\n\n∂L/∂w = ∂L/∂a · ∂a/∂z · ∂z/∂w        (regra da cadeia)",
        },
        {
          type: "text",
          md: "Usa a **regra da cadeia** para calcular a influência de cada parâmetro na loss, **propagando os gradientes da saída para as camadas anteriores**. O backprop **calcula** os gradientes; quem **atualiza** os pesos é o otimizador.",
        },
      ],
    },
    {
      id: "otimizadores",
      tags: ["otimizadores"],
      blocks: [
        { type: "heading", eyebrow: "Aula 13", text: "Otimizadores" },
        {
          type: "card-grid",
          columns: 2,
          cards: [
            { icon: "ChartLine", title: "SGD", description: "Passo contra o gradiente estimado num lote (batch) de exemplos." },
            { icon: "Rocket", title: "SGD + Momentum", description: "Acumula a direção dos passos anteriores: atravessa vales e oscila menos." },
            { icon: "Gauge", title: "Adam", description: "Momentum + taxa adaptativa por parâmetro. Padrão popular." },
            { icon: "ShieldCheck", title: "AdamW", description: "Adam com weight decay desacoplado: regularização mais correta." },
          ],
        },
        { type: "callout", variant: "tip", md: "**Época** = uma passada por todo o treino. **Batch** = quantos exemplos por atualização. **Iteração** = uma atualização." },
      ],
    },
    {
      id: "treino",
      tags: ["treino"],
      blocks: [
        { type: "heading", eyebrow: "Aula 12 · momento interativo", text: "Uma rede em TensorFlow/Keras" },
        {
          type: "code",
          language: "python",
          code: 'modelo = keras.Sequential([\n    keras.Input(shape=(n_features,)),\n    keras.layers.Dense(16, activation="relu"),\n    keras.layers.Dropout(0.2),\n    keras.layers.Dense(1, activation="sigmoid"),\n])\nmodelo.compile(optimizer="adam", loss="binary_crossentropy", metrics=["AUC"])\nmodelo.fit(X_tr, y_tr, validation_split=0.2, epochs=50, batch_size=32,\n           callbacks=[keras.callbacks.EarlyStopping(patience=5, restore_best_weights=True)])',
          caption: "ReLU nas ocultas, sigmoide na saída binária, entropia cruzada binária como loss, Adam como otimizador, dropout e early stopping contra overfitting.",
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
            "Neurônio: ŷ = f(Σ w·x + b). Rede = neurônios em camadas; sem não linearidade, vira uma função linear.",
            "Ativações: ReLU nas ocultas, sigmoide na saída binária, softmax na multiclasse.",
            "Loss: MSE (regressão), entropia cruzada binária ou categórica (classificação).",
            "Descida do gradiente: w ← w − η·∂L/∂w. Learning rate alta diverge; baixa demora.",
            "Backprop calcula gradientes pela regra da cadeia; o otimizador (SGD, momentum, Adam) atualiza os pesos.",
          ],
        },
      ],
    },
  ],
});
