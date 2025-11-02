# 💰 Mesada Divertida — Jogo Educativo de Educação Financeira

**Mesada Divertida** é um jogo web interativo voltado para alunos do 5º ano do Ensino Fundamental I. O objetivo é ensinar conceitos básicos de finanças pessoais de forma lúdica, acessível e divertida.

O projeto foi desenvolvido como um Projeto Integrador com foco em tecnologias educacionais.

## 💡 Problema e Objetivo

**Problema:** A educação financeira é crucial, mas ainda é pouco abordada de forma atraente nas séries iniciais do Ensino Fundamental. A falta de recursos pedagógicos lúdicos limita o engajamento das crianças.

**Objetivo:** Desenvolver um jogo web gamificado que introduza, por meio da simulação de uma mesada virtual e desafios de consumo/economia, os conceitos básicos de finanças pessoais para crianças.

## 🚀 Funcionalidades

* **Simulação de Mesada:** Acompanhamento de uma carteira virtual (`wallet`) com ganhos e gastos em tempo real.
* **Sistema de Pontuação:** Pontos de "Consciência Financeira" (`score`) para gamificação do aprendizado.
* **Quiz Gamificado:** Desafios de múltipla escolha que simulam decisões financeiras do cotidiano infantil.
* **Feedback Imediato:** Feedback visual e sonoro sobre as consequências das escolhas (boas ou ruins).
* **Persistência de Dados:** O progresso (pontuação, saldo e fase) é salvo automaticamente no navegador do usuário via `localStorage`, permitindo continuar o jogo a qualquer momento.
* **Interface Amigável:** Design responsivo e visualmente agradável, adequado ao público infantil.

## 🛠 Tecnologias Utilizadas

Este projeto foi construído utilizando tecnologias front-end padrão, sem a necessidade de *frameworks* ou *backend*.

* **HTML5:** Estrutura e marcação do conteúdo.
* **CSS3:** Estilização e responsividade da interface.
* **JavaScript (Vanilla):** Lógica do jogo, manipulação do DOM e gestão do estado.
* **`localStorage`:** Utilizado para salvar o progresso e a pontuação no cache do navegador.
* **Editor:** Notepad++.

## 📁 Estrutura do Projeto

A organização dos arquivos é simples e direta:

```

.
├── assets/
│   ├── images/
│   │   └── logo.png  \# Imagem da logo (referenciada)
│   └── sounds/
│       ├── click.mp3   \# Som de clique (referenciado)
│       ├── fail.mp3    \# Som de erro (referenciado)
│       └── success.mp3 \# Som de acerto (referenciado)
├── index.html          \# Arquivo principal do jogo (estrutura)
├── style.css           \# Folha de estilos (aparência)
└── script.js           \# Lógica do jogo (JavaScript)
└── README.md           \# Este arquivo

````

## ▶ Como Jogar (Execução Local)

Para rodar o projeto em seu computador (ambiente de desenvolvimento):

1.  **Clone o repositório:**
    ```bash
    git clone [https://docs.github.com/pt/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github](https://docs.github.com/pt/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github)
    ```
2.  **Abra o arquivo:**
    Localize o arquivo `index.html` na pasta do projeto.
3.  **Execute no Navegador:**
    Clique duas vezes em `index.html` (ou use a opção "Abrir com" seu navegador preferido). O jogo será carregado e estará pronto para uso.

---

## 2. Avaliação e Sugestões para a Continuidade

Como desenvolvedor do projeto, a base que você construiu é **sólida e bem estruturada**. O encapsulamento da lógica do jogo na variável `state` e a forma como as escolhas aplicam `score` e `walletDelta` em `script.js` é uma excelente prática para um projeto em JavaScript Vanilla.

Aqui estão as minhas sugestões, focadas em aumentar o valor pedagógico e a retenção do jogador, transformando o "quiz" em uma "simulação de vida":

| Foco | Ação Sugerida | Detalhes Técnicos (JavaScript) |
| :--- | :--- | :--- |
| **Aprofundamento da Mecânica** | **Adicionar um Sistema de Metas (Cofrinho Virtual)** | Criar um novo campo em `state` (ex: `savingsGoal: 100`, `currentSavings: 0`). Algumas decisões não apenas aumentariam a `wallet` mas também a `currentSavings`, que só poderia ser usada ao atingir o `savingsGoal`. |
| **Imersão e Narrativa** | **Criar "Eventos Aleatórios" (Sorte ou Azar)** | Introduzir fases que não são quiz, mas eventos que influenciam a `wallet` ou o `score`. Ex: "Você ajudou um vizinho e ganhou R$5" (Good Event) ou "Sua bola furou, precisa economizar para uma nova" (Bad Event). |
| **Valor Pedagógico** | **Reforço Educacional Pós-Resposta** | Na função `handleChoice` em `script.js`, adicione um campo de texto explicativo (`explanation`) para cada `choice` na lista `challenges`. Exiba essa explicação em `feedbackEl` após a escolha, independentemente de estar certa ou errada. |
| **Manutenibilidade** | **Separar Dados e Lógica** | Mover o *array* `challenges` (atualmente em `script.js`) para um novo arquivo (`data/challenges.js`). Isso isola o conteúdo do jogo da lógica, facilitando a adição de novas fases e a colaboração futura. |
| **Interface do Usuário (UX)** | **Indicador Visual de Progresso** | Adicionar uma barra de progresso no `index.html` (e estilizar em `style.css`) para mostrar a porcentagem de desafios concluídos, oferecendo uma sensação clara de avanço além do contador de fases. |

### Próximos Passos Sugeridos

1.  **Reforço Educacional (Prioridade Pedagógica):** Implemente as explicações detalhadas para cada escolha na função `handleChoice` em `script.js` (passo mais importante para um jogo *educativo*).
2.  **Organização do Conteúdo:** Crie a pasta `data` e mova o *array* `challenges` para um arquivo externo, como `data/challenges.js`, e o importe em `index.html`.
3.  **Implementação da Meta de Economia:** Adicione a variável `savingsGoal` ao `state` e implemente a lógica de cofrinho, ensinando a importância da economia com propósito.
````