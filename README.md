<div align="center">
    <h1 align="center">OpenTruco (client)</h1>
    <p align="center">
    Um projeto open-source brasileiro sobre truco! (client)
    <br>
    <a href="https://espinafr.github.io/OpenTruco-client/">Ver Demo</a>
    &middot;
    <a href="https://github.com/espinafr/OpenTruco-client/issues/new?template=denúncia-de-bug.yml">Reporte um Bug</a>
    &middot;
    <a href="https://github.com/espinafr/OpenTruco-client/issues/new?template=solicitação-de-funcionalidade.yml">Solicite uma Feature</a>
    </p>
</div>

## Sobre o projeto

OpenTruco é um projeto que visa introduzir brasileiros para o mundo Open-Source. Atualmente dividido em dois repositórios, o [cliente (onde você está)](https://github.com/espinafr/OpenTruco-client/), e o [servidor](https://github.com/espinafr/OpenTruco-server/). Este repositório contém a interface do jogo, feita com TypeScript e Tailwind.

## Contribuindo

Contribuições são o que fazem a comunidade open-source um lugar tão maravilhoso para aprender, inspirar e criar. Quaisquer contribuições que você fizer serão **muitíssimo apreciadas**

Se isso te interessa, leia o arquivo [CONTRIBUTING.md](https://github.com/espinafr/OpenTruco-client?tab=contributing-ov-file#obrigado)!

## Começando

Essas são as instruções para rodar o programa localmente na sua máquina, fazer alterações e contribuir com o projeto.

### Pré-requisitos
Antes de começar oficialmente, você precisa instalar as seguintes ferramentas:
- [Node.js](https://nodejs.org/pt-br/download/current.)
- [git](https://git-scm.com/install/)
- npm (vem junto com o Node)

### Instalação
1. Clone o repositório para sua máquina
   ```sh
   git clone https://github.com/espinafr/OpenTruco-client.git
   ```
2. Entre no diretório `OpenTruco-client`
3. Instale os pacotes do projeto
   ```sh
   npm install
   ```
4. Modifique as variáveis de ambiente `.env` conforme sua necessidade (normalmente os valores que já estão lá servem para a maioria dos casos)
   ```
   VITE_PROD_SERVER_URL='XYZ'
   VITE_LOCAL_SERVER_URL='XYZ'
   ```
5. Rode o projeto em modo de desenvolvimento
   ```sh
   npm run dev
   ```

## Licença

Veja o arquivo LICENSE.