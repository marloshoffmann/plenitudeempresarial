
import { AdjectiveGroup, ValueGroup } from './types';

export const DNA_ADJECTIVE_GROUPS: AdjectiveGroup[] = [
  {
    adjectives: [
      { text: 'Determinado', factor: 'D', description: 'Firme em suas decisões e focado em metas.' },
      { text: 'Preciso', factor: 'C', description: 'Busca exatidão e qualidade em tudo o que faz.' },
      { text: 'Consistente', factor: 'S', description: 'Mantém o ritmo e a estabilidade emocional.' },
      { text: 'Confiante', factor: 'I', description: 'Acredita em si mesmo e em sua capacidade de influenciar.' }
    ]
  },
  {
    adjectives: [
      { text: 'Compreensivo', factor: 'S', description: 'Capaz de entender o lado dos outros.' },
      { text: 'Persuasivo', factor: 'I', description: 'Habilidade de convencer e atrair pessoas.' },
      { text: 'Cuidadoso', factor: 'C', description: 'Atento aos detalhes e riscos envolvidos.' },
      { text: 'Direto', factor: 'D', description: 'Vai direto ao ponto, sem rodeios.' }
    ]
  },
  {
    adjectives: [
      { text: 'Lógico', factor: 'C', description: 'Baseia-se em fatos e raciocínio analítico.' },
      { text: 'Paciente', factor: 'S', description: 'Sabe esperar o momento certo e manter a calma.' },
      { text: 'Otimista', factor: 'I', description: 'Vê o lado positivo das situações.' },
      { text: 'Assertivo', factor: 'D', description: 'Posiciona-se com firmeza e clareza.' }
    ]
  },
  {
    adjectives: [
      { text: 'Organizado', factor: 'C', description: 'Mantém ordem e estrutura em seu ambiente.' },
      { text: 'Inspirador', factor: 'I', description: 'Motiva as pessoas ao seu redor.' },
      { text: 'Persistente', factor: 'S', description: 'Não desiste facilmente de seus objetivos.' },
      { text: 'Executor', factor: 'D', description: 'Foco total em realizar e entregar resultados.' }
    ]
  },
  {
    adjectives: [
      { text: 'Exato', factor: 'C', description: 'Rigoroso com a verdade e dados técnicos.' },
      { text: 'Decidido', factor: 'D', description: 'Resolve questões de forma rápida e segura.' },
      { text: 'Estável', factor: 'S', description: 'Transmite segurança e previsibilidade.' },
      { text: 'Flexível', factor: 'I', description: 'Adapta-se bem a novos cenários e conversas.' }
    ]
  },
  {
    adjectives: [
      { text: 'Entusiasmado', factor: 'I', description: 'Demonstra alegria e vivacidade constante.' },
      { text: 'Disciplinado', factor: 'C', description: 'Segue regras e métodos com rigor.' },
      { text: 'Energético', factor: 'D', description: 'Possui alta carga de ação e dinamismo.' },
      { text: 'Calmo', factor: 'S', description: 'Mantém a tranquilidade mesmo sob pressão.' }
    ]
  },
  {
    adjectives: [
      { text: 'Expressivo', factor: 'I', description: 'Comunica-se bem através de gestos e fala.' },
      { text: 'Firme', factor: 'D', description: 'Mantém sua posição com autoridade.' },
      { text: 'Amável', factor: 'S', description: 'Trata as pessoas com gentileza e carinho.' },
      { text: 'Formal', factor: 'C', description: 'Respeita hierarquias e etiquetas sociais.' }
    ]
  },
  {
    adjectives: [
      { text: 'Detalhista', factor: 'C', description: 'Preocupa-se com as nuances mínimas de um projeto.' },
      { text: 'Ponderado', factor: 'S', description: 'Avalia todos os lados antes de agir.' },
      { text: 'Visionário', factor: 'D', description: 'Enxerga além do óbvio e do presente.' },
      { text: 'Criativo', factor: 'I', description: 'Gera ideias inovadoras e fora da caixa.' }
    ]
  },
  {
    adjectives: [
      { text: 'Convincente', factor: 'I', description: 'Possui argumentos que ganham a adesão alheia.' },
      { text: 'Planejador', factor: 'S', description: 'Gosta de estruturar os passos antes da ação.' },
      { text: 'Audacioso', factor: 'D', description: 'Arrisca-se em busca de grandes conquistas.' },
      { text: 'Cauteloso', factor: 'C', description: 'Age com prudência para evitar erros.' }
    ]
  },
  {
    adjectives: [
      { text: 'Exigente', factor: 'D', description: 'Busca o máximo desempenho de si e dos outros.' },
      { text: 'Conservador', factor: 'S', description: 'Valoriza o que é seguro e tradicional.' },
      { text: 'Sociável', factor: 'I', description: 'Gosta de estar entre pessoas e fazer amigos.' },
      { text: 'Leal', factor: 'C', description: 'Fiel a princípios, processos e parceiros.' }
    ]
  }
];

export const VALUES_GROUPS: ValueGroup[] = [
  {
    phrases: [
      { text: 'Seguir tradições e conservadoras', factor: 'R' },
      { text: 'Colaborar com os menos favorecidos', factor: 'S' },
      { text: 'Liderar um time vencedor', factor: 'P' },
      { text: 'Contribuir para um ambiente harmônico', factor: 'B' },
      { text: 'Construir um negócio lucrativo', factor: 'E' },
      { text: 'Desenvolver pesquisas relevantes', factor: 'T' }
    ]
  },
  {
    phrases: [
      { text: 'Crescer na carreira e na sociedade', factor: 'P' },
      { text: 'Ajudar o próximo', factor: 'S' },
      { text: 'Vivenciar a arte em minha vida', factor: 'B' },
      { text: 'Ampliar conhecimentos', factor: 'T' },
      { text: 'Alcançar independência financeira', factor: 'E' },
      { text: 'Expressar minhas crenças e convicções', factor: 'R' }
    ]
  },
  {
    phrases: [
      { text: 'Praticar minha fé ativamente', factor: 'R' },
      { text: 'Contribuir com a sociedade', factor: 'S' },
      { text: 'Descobrir novos conhecimentos', factor: 'T' },
      { text: 'Apreciar a beleza da vida', factor: 'B' },
      { text: 'Receber retorno justo pelo que invisto', factor: 'E' },
      { text: 'Liderar equipes e tomar decisões', factor: 'P' }
    ]
  },
  {
    phrases: [
      { text: 'Ser um líder guiado por princípios', factor: 'R' },
      { text: 'Ser um líder prático e produtivo', factor: 'E' },
      { text: 'Ser um líder que serve', factor: 'S' },
      { text: 'Ser um líder com status e poder', factor: 'P' },
      { text: 'Ser um líder que busca bem-estar', factor: 'B' },
      { text: 'Ser um líder que valoriza o aprendizado', factor: 'T' }
    ]
  },
  {
    phrases: [
      { text: 'Aprender algo novo sempre', factor: 'T' },
      { text: 'Ter uma estratégia de sucesso', factor: 'P' },
      { text: 'Ajudar os necessitados', factor: 'S' },
      { text: 'Viver de acordo com meus valores', factor: 'R' },
      { text: 'Expandir produtividade e resultados', factor: 'E' },
      { text: 'Buscar equilíbrio e serenidade', factor: 'B' }
    ]
  },
  {
    phrases: [
      { text: 'Gerar prosperidade financeira', factor: 'E' },
      { text: 'Ser reconhecido(a) e respeitado(a)', factor: 'P' },
      { text: 'Fazer parte de uma comunidade de fé', factor: 'R' },
      { text: 'Criar ambientes agradáveis', factor: 'B' },
      { text: 'Aprender continuamente', factor: 'T' },
      { text: 'Apoiar instituições de caridade', factor: 'S' }
    ]
  },
  {
    phrases: [
      { text: 'Exercer influência e liderança', factor: 'P' },
      { text: 'Garantir segurança futura', factor: 'E' },
      { text: 'Desfrutar do momento presente', factor: 'B' },
      { text: 'Servir pessoas', factor: 'S' },
      { text: 'Preservar tradições', factor: 'R' },
      { text: 'Expandir conhecimento', factor: 'T' }
    ]
  },
  {
    phrases: [
      { text: 'Viver com arte e criatividade', factor: 'B' },
      { text: 'Liderar metas e equipes', factor: 'P' },
      { text: 'Fazer trabalho voluntário', factor: 'S' },
      { text: 'Expressar fé no cotidiano', factor: 'R' },
      { text: 'Multiplicar recursos financeiros', factor: 'E' },
      { text: 'Buscar novos aprendizados', factor: 'T' }
    ]
  },
  {
    phrases: [
      { text: 'Servir ao próximo', factor: 'S' },
      { text: 'Gerir tempo e recursos com sabedoria', factor: 'E' },
      { text: 'Valorizar o belo e a natureza', factor: 'B' },
      { text: 'Manter fé e espiritualidade', factor: 'R' },
      { text: 'Desenvolver novos conhecimentos', factor: 'T' },
      { text: 'Alcançar destaque e influência', factor: 'P' }
    ]
  },
  {
    phrases: [
      { text: 'Buscar harmonia e paz', factor: 'B' },
      { text: 'Buscar conhecimento', factor: 'T' },
      { text: 'Buscar poder e influência', factor: 'P' },
      { text: 'Buscar recompensa financeira', factor: 'E' },
      { text: 'Buscar bem-estar coletivo', factor: 'S' },
      { text: 'Buscar princípios próximos aos meus', factor: 'R' }
    ]
  }
];
