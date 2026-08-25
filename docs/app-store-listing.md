# Ficha da App Store (rascunho)

Textos para colar no App Store Connect. Tudo em pt-BR, com o idioma principal do app definido como Português (Brasil).

## Nome (30 caracteres)

```
NatareApp
```

## Subtítulo (30 caracteres)

```
Gestão de treinos em equipe
```

Alternativas (o subtítulo também entra na busca, então cada palavra dele conta como palavra-chave):

- `Treinos em equipe sem planilha` (30) — mais promocional, ataca a dor do público.
- `Sua equipe de natação unida` (27) — mais emocional, mas gasta o termo "natação".
- `Treinador e atletas em sintonia` (31) — só cabe se cortar para `Treinador e atleta em sintonia` (30).

## Palavras-chave (100 caracteres, separadas por vírgula, sem espaços)

```
natacao,nadador,treinador,piscina,swim,masters,triatlo,prova,pace,atleta,coach,raia,clube,aulas
```

Critérios usados:

- A Apple já indexa o **nome** e o **subtítulo**, então "treino", "treinos", "equipe" e "gestão" não são repetidos aqui (repetir desperdiça caracteres).
- Sem acentos e no singular: a busca da App Store normaliza acentuação e a combinação de termos é feita automaticamente (`natacao` + `treinador` cobre "treinador de natação").
- Termos de nicho com pouca concorrência e alta intenção: `masters`, `triatlo`, `raia`, `pace`, `clube`.
- `swim` e `coach` capturam quem busca em inglês, comum entre nadadores.
- Se o subtítulo mudar para uma opção que não contenha "equipe", incluir `equipe` na lista (trocar por `aulas`).

## Texto promocional (170 caracteres, editável sem nova versão)

```
Os treinos da sua equipe de natação no bolso: o treinador prescreve, você acompanha cada série e vê sua evolução ao longo da temporada.
```

## Descrição

```
O NatareApp conecta treinadores e atletas de natação em um só lugar. O treinador monta os treinos e acompanha a equipe; o atleta recebe tudo pronto no celular, sem planilha nem grupo de mensagens.

O que você encontra no app:

• Treino do dia na tela inicial, com blocos, séries, distâncias, intervalos e o volume total em metros.
• Sua semana em uma tela: navegue entre as semanas, filtre por pendentes ou concluídos e marque cada treino como feito.
• Sequência de dias treinados e mapa de atividade mês a mês, para enxergar a constância no gráfico.
• Histórico completo de tudo o que você nadou, com volume, tempo total e tempo de descanso de cada sessão.
• Notificações no celular quando o treinador publica um treino novo ou envia um convite.
• Resumo do treino pronto para postar nos stories, com os números do dia.
• Perfil do atleta com os dados que o treinador usa para prescrever o treino certo para você.

O acesso ao NatareApp é feito por convite do treinador ou da equipe. Se a sua equipe ainda não usa o NatareApp, fale com o seu treinador.
```

## Novidades desta versão (primeira submissão)

```
Primeira versão do NatareApp.
```

## URLs

- Política de privacidade: `https://natare.app/privacy`
- Termos de uso: `https://natare.app/terms`
- Suporte: `https://natare.app/contact`

## Categoria

- Principal: Saúde e Fitness
- Secundária: Esportes

## Classificação etária

Sem conteúdo sensível. Responder "nenhum" em todas as categorias. O app permite cadastro de menores de idade feito pelo treinador ou responsável, o que não altera a classificação, mas deve ser mencionado nas notas de revisão.

## Notas para a revisão (App Review Information)

```
O NatareApp é um aplicativo fechado: o atleta só acessa por convite do treinador, portanto não é possível criar uma conta pela tela de login.

Use a conta de demonstração abaixo, que já possui treinos cadastrados:

E-mail: ios-testing@natare.app
Senha: 0.MX4$W>zD9\l_uslI

A exclusão de conta está disponível em Perfil > Excluir conta.
O app não utiliza login social de terceiros.
```

## App Privacy (questionário)

| Categoria | Tipo | Vinculado ao usuário | Rastreamento | Finalidade |
| --- | --- | --- | --- | --- |
| Informações de contato | Nome | Sim | Não | Funcionalidade do app |
| Informações de contato | E-mail | Sim | Não | Funcionalidade do app |
| Saúde e condicionamento | Saúde (altura, peso) | Sim | Não | Funcionalidade do app |
| Saúde e condicionamento | Condicionamento físico (treinos) | Sim | Não | Funcionalidade do app |
| Conteúdo de usuário | Fotos (avatar) | Sim | Não | Funcionalidade do app |
| Identificadores | ID de usuário | Sim | Não | Funcionalidade do app |
| Identificadores | ID do dispositivo (push token) | Sim | Não | Funcionalidade do app |
| Outros dados | Data de nascimento e sexo | Sim | Não | Funcionalidade do app |

Telefone não é declarado: o app não coleta esse campo (só o web, preenchido pelo treinador).
Sem analytics, crash reporting, localização, contatos ou histórico.

Nenhum dado é usado para rastreamento entre apps ou publicidade.

## Screenshots

Obrigatórios apenas dois tamanhos, o restante a Apple redimensiona:

- iPhone 6.9" (1320x2868 ou 2868x1320)
- iPhone 6.5" (1242x2688 ou 2688x1242)

Sugestão de sequência (5 telas): Home com o treino do dia, detalhe do treino, lista de treinos, perfil do atleta, card de compartilhamento.
