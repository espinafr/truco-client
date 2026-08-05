# Obrigado!

Contribuições são o que fazem a comunidade open-source um lugar tão maravilhoso para aprender, inspirar e criar. Quaisquer contribuições que você fizer serão **muitíssimo apreciadas**

Este repositório foi pensado para ser um ponto de entrada para pessoas que estão começando no open-source. Então, se você nunca contribuiu em um projeto no GitHub antes, tudo bem. A ideia aqui é justamente aprendermos juntos.

Se você tem uma sugestão sobre o que tornaria esse projeto melhor, encontrou um bug ou quer implementar algo novo, você pode:
Se você tiver uma sugestão de melhoria, encontrou um bug ou quer implementar algo novo, você pode:

- abrir uma [issue](https://github.com/espinafr/OpenTruco-client/issues/new/choose);
- criar um fork do projeto e mandar uma pull request;
- ajudar com documentação, organização ou correções pequenas.

Se puder, **deixe uma estrela no repositório!** Isso ajuda bastante o projeto a ganhar visibilidade.


<details>
  <summary><strong>Sumário</strong></summary>
  <ol>
    <li>
      <a href="#obrigado">Agradecimentos</a>
    </li>
    <li>
      <a href="#antes-de-começar">Antes de começar</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li>
      <a href="#antes-de-começar">Como contribuir</a>
      <ul>
        <li><a href="#1">Veja se já existe algo parecido</a></li>
        <li><a href="#2">Faça um fork do projeto</a></li>
        <li><a href="#3">Clone seu fork</a></li>
        <li><a href="#4">Instale as dependências</a></li>
        <li><a href="#5">Crie uma branch para a sua mudança</a></li>
        <li><a href="#6">Faça a alteração</a></li>
        <li><a href="#7">Teste antes de enviar</a></li>
        <li><a href="#8">Faça o commit</a></li>
        <li><a href="#9">Envie para o GitHub</a></li>
        <li><a href="#10">Abra a pull request</a></li>
      </ul>
    <li><a href="#boas-práticas">Boas práticas</a></li>
    <li><a href="#issues">Issues</a></li>
    <li><a href="#comunicação">Comunicação</a></li>
    <li><a href="#estrutura-do-projeto">Estrutura do projeto</a></li>
  </ol>
</details>

## Antes de começar

Se você nunca usou GitHub antes, estes três termos aparecem bastante:

- **Fork**: uma cópia do repositório para a sua conta.
- **Branch**: uma linha separada de trabalho, usada para fazer alterações sem mexer direto na versão principal.
- **Pull request**: o pedido para que suas alterações sejam revisadas e, se estiver tudo certo, incluídas no projeto.

Se isso ainda parecer confuso, não tem problema. Você pode abrir uma issue explicando o que quer fazer que a gente orienta o restante.

## Como contribuir

### [1.](#1) Veja se já existe algo parecido

Antes de começar, confira se já existe uma issue sobre o assunto. Se existir, você pode comentar nela. Se não existir, abra uma nova issue explicando:

- o problema ou a ideia;
- o que você esperava que acontecesse;
- se possível, uma captura de tela ou passo a passo para reproduzir.

### [2.](#2) Faça um fork do projeto

Crie uma cópia do repositório na sua conta do GitHub.

### [3.](#3) Clone o seu fork

Abra o terminal e rode:

```sh
git clone https://github.com/espinafr/OpenTruco-client.git
cd OpenTruco-client
```

### [4.](#4) Instale as dependências
```sh
npm install
```

### [5.](#5) Crie uma branch para a sua mudança
Escolha um nome simples e descritivo:
```sh
git checkout -b feature/minha-melhoria
```

### [6.](#6) Faça a alteração
Tente manter a mudança pequena e focada em uma única coisa.

Se a sua alteração mexer em comportamento, procure também atualizar a documentação ou deixar claro como testar.

### [7.](#7) Teste antes de enviar
Antes de abrir a pull request, rode o build para verificar se tudo está de acordo com os padrões de produção:
```sh
npm run build
```
Se você estiver mexendo bastante na interface ou na lógica principal, teste o fluxo no navegador com:
```sh
npm run dev
```

### [8.](#8) Faça o commit
Escreva mensagens curtas e objetivas:
```sh
git add .
git commit -m "Adiciona tela de exemplo"
```

### [9.](#9) Envie para o GitHub
```sh
git push origin feature/minha-melhoria
```
### [10.](#10) Abra a pull request
No GitHub, abra a pull request explicando:
- o que foi alterado;
- por que a mudança foi feita;
- como testar;
- se depende de alguma mudança no servidor.

## Boas práticas
Você pode contribuir de várias formas! Seja caçando bugs no código, fazendo `issues` ou documentando o código. Mas de maneira geral, a fim de manter todas as etapas de desenvolvimento bem organizadas, siga os seguintes princípios:

- Prefira mudanças pequenas e bem explicadas.
- Não misture refatoração com feature nova no mesmo PR, se possível.
- Se a mudança afetar comportamento, descreva como testar.
- Faça commits no imperativo, como "adiciona X", "cria X" ou "reformula X".
- Funções devem ter comentários de documentação seguindo o padrão JSDoc quando isso ajudar na leitura.
- Apesar dos comentários e da documentação serem em português, nomes de variáveis, funções e classes devem estar em inglês.

Exemplo de comentário de documentação [(JSDoc)](https://jsdoc.app):
```ts
/**
    * Cria uma carta no DOM com base nas informações fornecidas.
    * @param {Card} card As informações da carta a ser criada.
    * @returns {HTMLDivElement} O elemento HTML da carta criada.
    * 
    * @example 
    * const novaCarta: Carta = { value: "A", suit: "copas" };
    * createCard(novaCarta);
*/
function createCard(card: Card): HTMLDivElement {
    ...
```

## Issues

- Use uma issue por assunto.
- Marque bugs, melhorias e boas primeiras tarefas com labels claras.
- Se possível, inclua contexto, captura de tela e passos para reproduzir.

## Comunicação

- Seja objetivo no PR.
- Se a mudança depende do servidor, deixe isso explícito.

## Estrutura do projeto

- `src/config`: configuração e ambiente
- `src/lib`: utilitários de rede
- `src/ui`: componentes e interações de interface
- `src/pages`: lógica de cada tela
- `src/styles`: estilos globais e específicos
