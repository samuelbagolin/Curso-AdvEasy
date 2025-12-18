
import { Course, User, VisualConfig } from './types';

export const DEFAULT_VISUAL: VisualConfig = {
  logoUrl: "https://adveasy.com.br/wp-content/uploads/2023/01/result-3.svg",
  primaryColor: "#0f172a", // Slate-900 (Azul Marinho Profissional)
  backgroundColor: "#f8fafc", // Off-white/Slate-50
};

export const INITIAL_USERS: User[] = [
  { id: 'admin', username: 'admin', password: '123', name: 'Administrador Master', role: 'admin' },
  { id: 'adv1', username: 'advogado', password: '123', name: 'Dr. João Silva', role: 'student' }
];

export const COURSE_DATA: Course = {
  title: "Guia Completo: Como Alavancar Suas Vendas na Advocacia",
  modules: [
    {
      id: "m1",
      order: 1,
      title: "Estratégias de Vendas para Advogados",
      summary: "Aprenda a estruturar estratégias de vendas eficazes para advogados.",
      lessons: [
        { id: "m1l1", order: 1, title: "Identificação do público-alvo", content: "A base de qualquer venda de sucesso na advocacia é saber com quem você está falando. Definir o ICP (Ideal Customer Profile) economiza tempo e recursos preciosos do escritório." },
        { id: "m1l2", order: 2, title: "Construção de relacionamento com leads", content: "Advocacia é confiança. Nesta aula, exploramos como nutrir contatos antes de tentar converter, criando autoridade técnica." },
        { id: "m1l3", order: 3, title: "Técnicas de persuasão e argumentação", content: "Persuadir não é manipular. Usamos gatilhos de prova social e autoridade para mostrar ao cliente que o risco de não contratar é maior que o investimento." },
        { id: "m1l4", order: 4, title: "Fechamento de vendas", content: "O momento da verdade. Como apresentar a proposta de honorários de forma que o valor percebido supere o custo numérico." },
        { id: "m1l5", order: 5, title: "Estratégias de follow-up", content: "A venda raramente acontece no primeiro contato. Um follow-up estruturado pode aumentar em 50% sua taxa de conversão." }
      ],
      quiz: {
        id: "q1",
        moduleId: "m1",
        passingScore: 70,
        questions: [
          { id: "q1_1", text: "O que significa ICP?", options: ["Interesse de Cliente Privado", "Ideal Customer Profile", "Índice de Custo por Processo", "Informação de Cliente Potencial"], correctAnswer: 1 },
          { id: "q1_2", text: "A base da venda jurídica é:", options: ["Preço baixo", "Pressão psicológica", "Confiança e Autoridade", "Velocidade extrema"], correctAnswer: 2 },
          { id: "q1_3", text: "O follow-up deve ser:", options: ["Evitado", "Sempre por telefone", "Estruturado e agregador de valor", "Feito apenas uma vez"], correctAnswer: 2 },
          { id: "q1_4", text: "Persuasão na advocacia foca em:", options: ["Enganar o juiz", "Mostrar autoridade técnica", "Ocultar honorários", "Prometer vitória"], correctAnswer: 1 },
          { id: "q1_5", text: "Qual o maior erro na identificação do público?", options: ["Segmentar demais", "Querer atender todo mundo", "Usar e-mail", "Ter um site"], correctAnswer: 1 }
        ]
      }
    },
    {
      id: "m2",
      order: 2,
      title: "Marketing Digital para Advogados",
      summary: "Descubra como utilizar o marketing digital para atrair novos clientes.",
      lessons: [
        { id: "m2l1", order: 1, title: "Criação de conteúdo relevante", content: "Marketing jurídico é marketing de conteúdo. Você atrai pelo conhecimento e retém pela confiança." },
        { id: "m2l2", order: 2, title: "Otimização de site e SEO", content: "Ser encontrado no Google é o 'Santo Graal' do marketing jurídico passivo. Entenda as palavras-chave de intenção de busca." },
        { id: "m2l3", order: 3, title: "E-mail marketing para advogados", content: "O canal mais direto e pessoal. Saiba como usar newsletters informativas para manter seu escritório na mente do cliente." },
        { id: "m2l4", order: 4, title: "Uso de redes sociais na advocacia", content: "LinkedIn para B2B e Instagram para B2C. Cada rede exige uma linguagem e um posicionamento diferente." },
        { id: "m2l5", order: 5, title: "Publicidade online e PPC", content: "Google Ads e Meta Ads. Como investir R$ 1,00 para retornar R$ 5,00 respeitando os limites éticos da OAB." }
      ],
      quiz: {
        id: "q2",
        moduleId: "m2",
        passingScore: 70,
        questions: [
          { id: "q2_1", text: "O que é SEO?", options: ["Sistema de Erros Online", "Search Engine Optimization", "Selo de Escritório Otimizado", "Social Engine Order"], correctAnswer: 1 },
          { id: "q2_2", text: "Qual rede é melhor para Networking Corporativo?", options: ["TikTok", "Instagram", "LinkedIn", "Facebook"], correctAnswer: 2 },
          { id: "q2_3", text: "O marketing jurídico deve ser:", options: ["Agressivo", "Informativo", "Enganoso", "Apenas por rádio"], correctAnswer: 1 },
          { id: "q2_4", text: "Google Ads foca em pessoas que:", options: ["Já estão buscando uma solução", "Estão apenas navegando", "Querem ver memes", "Não usam internet"], correctAnswer: 0 },
          { id: "q2_5", text: "E-mail marketing serve para:", options: ["Enviar vírus", "Nutrir relacionamento", "Spam em massa", "Não serve para nada"], correctAnswer: 1 }
        ]
      }
    },
    {
      id: "m3",
      order: 3,
      title: "Gestão de Relacionamento com Clientes",
      summary: "Aprenda a manter um relacionamento sólido e duradouro com seus clientes.",
      lessons: [
        { id: "m3l1", order: 1, title: "Atendimento ao cliente e suporte pós-venda", content: "A jornada do cliente não acaba no trânsito em julgado. O pós-venda é onde nascem as indicações." },
        { id: "m3l2", order: 2, title: "Feedback e avaliação do cliente", content: "Entenda o NPS (Net Promoter Score) e como ele pode prever o crescimento do seu escritório." },
        { id: "m3l3", order: 3, title: "Construção de uma rede de indicações", content: "Indicação não é sorte, é processo. Saiba como pedir indicações sem parecer desesperado." },
        { id: "m3l4", order: 4, title: "Fidelização e programas de recompensa", content: "Como manter o cliente 'comprando' do seu escritório em diferentes áreas (LTV - Lifetime Value)." },
        { id: "m3l5", order: 5, title: "Resolução de conflitos e retenção de clientes", content: "Clientes insatisfeitos são ouro se você souber ouvir e corrigir o processo interno." }
      ],
      quiz: {
        id: "q3",
        moduleId: "m3",
        passingScore: 70,
        questions: [
          { id: "q3_1", text: "O que mede o NPS?", options: ["Lucro líquido", "Satisfação e indicação", "Velocidade do processo", "Número de advogados"], correctAnswer: 1 },
          { id: "q3_2", text: "Um cliente promotor é aquele que:", options: ["Não paga honorários", "Fica em silêncio", "Indica o escritório ativamente", "Troca de advogado"], correctAnswer: 2 },
          { id: "q3_3", text: "Manter um cliente é:", options: ["Impossível", "Mais caro que captar", "Mais barato que captar um novo", "Irrelevante"], correctAnswer: 2 },
          { id: "q3_4", text: "LTV significa:", options: ["Low Time Value", "Long Term Vision", "Lifetime Value", "Legal Title View"], correctAnswer: 2 },
          { id: "q3_5", text: "A rede de indicações deve ser:", options: ["Baseada na sorte", "Um processo estruturado", "Ilegal", "Apenas para familiares"], correctAnswer: 1 }
        ]
      }
    }
  ]
};
