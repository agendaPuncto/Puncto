import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description: 'Termos e condições de uso da plataforma Puncto.',
};

export default function TermsPage() {
  return (
    <div className="section bg-white">
      <div className="container-marketing">
        <div className="max-w-3xl mx-auto prose prose-slate">
          <h1>Termos de Uso</h1>
          <p className="lead">
            Última atualização: 18 de Janeiro de 2026
          </p>

          <h2>1. Aceitação dos Termos</h2>
          <p>
            Ao acessar e usar a plataforma Puncto (&quot;Serviço&quot;), você concorda em
            cumprir estes Termos de Uso. Se você não concordar com qualquer parte
            destes termos, não poderá acessar o Serviço.
          </p>

          <h2>2. Descrição do Serviço</h2>
          <p>
            O Puncto é uma plataforma de gestão para negócios de serviços que
            oferece funcionalidades de agendamento, pagamentos, gestão de equipe,
            controle de estoque e outras ferramentas de gestão empresarial.
          </p>

          <h2>3. Conta de Usuário</h2>
          <p>
            Para usar o Serviço, você deve criar uma conta fornecendo informações
            precisas e completas. Você é responsável por manter a confidencialidade
            da sua conta e senha, e por todas as atividades que ocorrerem sob sua
            conta.
          </p>
          <ul>
            <li>Você deve ter pelo menos 18 anos para criar uma conta</li>
            <li>Você não pode compartilhar suas credenciais de acesso</li>
            <li>Você deve notificar-nos imediatamente sobre qualquer uso não autorizado</li>
          </ul>

          <h2>4. Uso Aceitável</h2>
          <p>Você concorda em não:</p>
          <ul>
            <li>Usar o Serviço para qualquer finalidade ilegal</li>
            <li>Violar quaisquer leis ou regulamentos aplicáveis</li>
            <li>Tentar acessar sistemas ou dados não autorizados</li>
            <li>Transmitir vírus ou código malicioso</li>
            <li>Interferir ou interromper o Serviço</li>
            <li>Revender ou redistribuir o Serviço sem autorização</li>
          </ul>

          <h2>5. Pagamento e Assinatura</h2>
          <p>
            Alguns recursos do Serviço requerem pagamento. Ao assinar um plano
            pago, você concorda com os seguintes termos:
          </p>
          <ul>
            <li>Os pagamentos são recorrentes e cobrados conforme o plano escolhido</li>
            <li>Você pode cancelar sua assinatura a qualquer momento</li>
            <li>Não há reembolso para períodos parciais de uso</li>
            <li>Os preços podem ser ajustados com aviso prévio de 30 dias</li>
          </ul>

          <h2>6. Propriedade Intelectual</h2>
          <p>
            O Serviço e seu conteúdo original, recursos e funcionalidades são e
            permanecerão propriedade exclusiva do Puncto e seus licenciadores.
            O Serviço é protegido por direitos autorais, marcas registradas e
            outras leis.
          </p>

          <h2>7. Dados do Usuário</h2>
          <p>
            Você mantém todos os direitos sobre os dados que insere no Serviço.
            Você nos concede licença para usar, armazenar e processar esses dados
            conforme necessário para fornecer o Serviço. Consulte nossa Política
            de Privacidade para mais detalhes.
          </p>

          <h2>8. Limitação de Responsabilidade</h2>
          <p>
            O Puncto não será responsável por quaisquer danos indiretos,
            incidentais, especiais, consequenciais ou punitivos, incluindo perda
            de lucros, dados, uso ou outra perda intangível resultante de:
          </p>
          <ul>
            <li>Seu acesso ou uso (ou incapacidade de usar) o Serviço</li>
            <li>Qualquer conduta ou conteúdo de terceiros no Serviço</li>
            <li>Acesso, uso ou alteração não autorizados de seus dados</li>
          </ul>

          <h2>9. Modificações do Serviço</h2>
          <p>
            Reservamo-nos o direito de modificar ou descontinuar o Serviço (ou
            qualquer parte dele) a qualquer momento, com ou sem aviso. Não
            seremos responsáveis perante você ou terceiros por qualquer
            modificação, suspensão ou descontinuação do Serviço.
          </p>

          <h2>10. Alterações nos Termos</h2>
          <p>
            Podemos atualizar estes Termos periodicamente. Notificaremos você
            sobre alterações significativas por email ou através de aviso no
            Serviço. O uso continuado após as alterações constitui aceitação
            dos novos termos.
          </p>

          <h2>11. Lei Aplicável</h2>
          <p>
            Estes Termos serão regidos e interpretados de acordo com as leis
            do Brasil, sem considerar suas disposições sobre conflitos de leis.
            Qualquer disputa será resolvida no foro da comarca de São Paulo, SP.
          </p>

          <h2>12. Contato</h2>
          <p>
            Se você tiver dúvidas sobre estes Termos, entre em contato conosco:
          </p>
          <ul>
            <li>Email: legal@puncto.com.br</li>
            <li>Endereço: Av. Paulista, 1000 - São Paulo, SP</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
