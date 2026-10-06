# Contexto

## Problema

No Brasil, o cuidado de idosos e pessoas com mobilidade reduzida apoia-se predominantemente em uma rede informal, descentralizada e vulnerável. As famílias enfrentam grandes dificuldades para encontrar cuidadores qualificados e confiáveis, recorrendo quase exclusivamente a indicações de boca a boca. Esse modelo de contratação informal impede a verificação prévia de antecedentes, qualificações ou experiências específicas dos profissionais. Como consequência, desentendimentos e cancelamentos de última hora são frequentes, gerando uma sobrecarga desproporcional que recai quase inteiramente sobre um único familiar responsável. Esse familiar precisa constantemente remarcar consultas médicas, ausentar-se do trabalho, cancelar compromissos pessoais e tomar decisões de forma isolada, resultando em um desgaste emocional severo e pouco reconhecido.

Por outro lado, os cuidadores e profissionais de saúde também sofrem com os impactos da informalidade. Eles dependem de recomendações informais para captar clientes, enfrentam problemas constantes de desvio de função — como serem solicitados a realizar tarefas domésticas pesadas além do cuidado clínico — e não contam com mecanismos prévios para avaliar o ambiente familiar e o local de trabalho antes de aceitar uma proposta. Além disso, a gestão do cuidado no dia a dia é fragmentada: informações sobre medicamentos, consultas, rotinas e necessidades de saúde do assistido ficam espalhadas em anotações físicas ou grupos de mensagens instantâneas, o que aumenta o risco de esquecimentos e falhas de comunicação entre a rede de apoio.

## Objetivos

### Objetivo Geral

Desenvolver uma aplicação móvel para conectar famílias e pessoas com mobilidade reduzida a cuidadores de confiança, centralizando a rotina de cuidado (gestão de medicamentos, agenda de compromissos, divisão de tarefas e diário de acompanhamento) e otimizando a comunicação da rede de apoio.

### Objetivos Específicos

* **Mapear e validar o perfil de qualificações e disponibilidade dos cuidadores**, oferecendo um sistema transparente de busca, filtragem e exibição de avaliações e referências de atendimentos anteriores.
* **Estruturar ferramentas de gestão de rotina e tarefas**, permitindo o cadastramento de lembretes de medicamentos, o acompanhamento do histórico do assistido por meio de um diário de cuidado e a divisão equilibrada das responsabilidades entre diferentes membros da família.
* **Garantir a acessibilidade e a usabilidade inclusiva na interface móvel**, desenvolvendo fluxos adaptados tanto para familiares e cuidadores quanto para pessoas idosas ou com mobilidade reduzida, em conformidade com as diretrizes da WCAG 2.1.

## Justificativa

A motivação para o desenvolvimento do AcessoMob surge da necessidade de transformar a organização informal do cuidado domiciliar no Brasil em uma experiência segura, estruturada e colaborativa. Pesquisas de campo e entrevistas realizadas com familiares cuidadores e profissionais da área revelam que a falta de referências e a insegurança ao colocar um desconhecido dentro de casa são os principais gargalos enfrentados pelas famílias. A dependência exclusiva do boca a boca limita as opções disponíveis e frequentemente resulta na contratação de profissionais sem o perfil adequado para as necessidades específicas do paciente.

Além disso, o desgaste emocional do familiar cuidador é intensificado pela centralização solitária da rotina e pela ausência de ferramentas centralizadas para coordenar tarefas diárias e gerenciar emergências ou desfalques de última hora. Sob a ótica dos profissionais, a indefinição de escopos gera atritos frequentes no ambiente de trabalho.

Portanto, o aprofundamento neste software justifica-se pela oportunidade de aplicar soluções tecnológicas focadas em acessibilidade, integração de agenda e verificação de perfil. A solução proposta visa reduzir a carga física e mental dos familiares, valorizar a atuação dos cuidadores profissionais e promover a autonomia e o bem-estar das pessoas com mobilidade reduzida.

## Público-Alvo

O público-alvo da aplicação compreende três perfis principais de usuários, que possuem diferentes necessidades, níveis de letramento digital e papéis na rotina de cuidado:

1. **Familiares Responsáveis (Cuidadores Informais):**
   * **Perfil:** Adultos e de meia-idade (geralmente entre 30 e 60 anos) que conciliam carreiras profissionais e vida pessoal com a responsabilidade de gerenciar o cuidado de pais ou parentes idosos/com mobilidade reduzida.
   * **Relação com a tecnologia:** Boa familiaridade com smartphones, aplicativos de mensagem e utilitários do dia a dia.
   * **Necessidades:** Praticidade, busca rápida por cuidadores qualificados com referências transparentes, ferramentas de delegação de tarefas para outros familiares e alertas para controle de rotina e medicação.

2. **Cuidadores Profissionais e Prestadores de Serviço:**
   * **Perfil:** Cuidadores de idosos, enfermeiros e técnicos de enfermagem que atuam de forma autônoma ou buscando oportunidades informais e freelancers.
   * **Relação com a tecnologia:** Uso intermediário de aplicativos móveis para comunicação e busca de trabalho.
   * **Necessidades:** Divulgação clara de suas qualificações e experiências, transparência nas atribuições do serviço para evitar desvio de função, previsibilidade de horários e canal direto de alinhamento com as famílias.

3. **Pessoas com Mobilidade Reduzida e Idosos Assistidos:**
   * **Perfil:** Indivíduos idosos ou pessoas com limitações motoras (cadeirantes, usuários de andadores/muletas ou com doenças degenerativas) que necessitam de acompanhamento diário ou periódico.
   * **Relação com a tecnologia:** Variável; em muitos casos, possuem limitações visuais, motoras ou pouca afinidade com interfaces complexas.
   * **Necessidades:** Interface extremamente simplificada, de navegação direta (poucas ações em destaque), alto contraste, suporte a leitores de tela e áreas de toque ampliadas para facilitar a navegação autônoma.