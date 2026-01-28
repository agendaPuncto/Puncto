import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Como o Puncto coleta, usa e protege seus dados pessoais.',
};

export default function PrivacyPage() {
  return (
    <div className="section bg-white">
      <div className="container-marketing">
        <div className="max-w-3xl mx-auto prose prose-slate">
          <h1>Política de Privacidade</h1>
          <p className="lead">
            Última atualização: 18 de Janeiro de 2026
          </p>

          <p>
            O Puncto (&quot;nós&quot;, &quot;nosso&quot;) está comprometido em proteger sua
            privacidade. Esta Política de Privacidade explica como coletamos,
            usamos, divulgamos e protegemos suas informações.
          </p>

          <h2>1. Informações que Coletamos</h2>
          
          <h3>1.1 Informações que você nos fornece</h3>
          <ul>
            <li>Dados de cadastro: nome, email, telefone, CPF/CNPJ</li>
            <li>Dados de pagamento: informações do cartão (processadas pelo Stripe)</li>
            <li>Dados do negócio: nome da empresa, endereço, serviços oferecidos</li>
            <li>Conteúdo: mensagens, feedbacks, arquivos enviados</li>
          </ul>

          <h3>1.2 Informações coletadas automaticamente</h3>
          <ul>
            <li>Dados de uso: páginas visitadas, recursos utilizados, tempo de sessão</li>
            <li>Dados técnicos: endereço IP, tipo de navegador, dispositivo</li>
            <li>Cookies e tecnologias similares</li>
            <li>Dados de localização (com seu consentimento)</li>
          </ul>

          <h2>2. Como Usamos Suas Informações</h2>
          <p>Utilizamos suas informações para:</p>
          <ul>
            <li>Fornecer, manter e melhorar nossos serviços</li>
            <li>Processar transações e enviar notificações relacionadas</li>
            <li>Enviar comunicações de marketing (com seu consentimento)</li>
            <li>Responder a solicitações de suporte</li>
            <li>Detectar e prevenir fraudes e abusos</li>
            <li>Cumprir obrigações legais</li>
          </ul>

          <h2>3. Compartilhamento de Informações</h2>
          <p>Podemos compartilhar suas informações com:</p>
          <ul>
            <li>
              <strong>Provedores de serviços:</strong> empresas que nos ajudam a
              fornecer o serviço (hospedagem, pagamentos, email)
            </li>
            <li>
              <strong>Parceiros de negócios:</strong> quando necessário para
              integrações solicitadas por você
            </li>
            <li>
              <strong>Autoridades legais:</strong> quando exigido por lei ou para
              proteger nossos direitos
            </li>
          </ul>
          <p>
            Não vendemos suas informações pessoais a terceiros.
          </p>

          <h2>4. Segurança dos Dados</h2>
          <p>
            Implementamos medidas técnicas e organizacionais para proteger suas
            informações, incluindo:
          </p>
          <ul>
            <li>Criptografia de dados em trânsito (TLS 1.3) e em repouso</li>
            <li>Controles de acesso baseados em função</li>
            <li>Monitoramento contínuo de segurança</li>
            <li>Backups regulares e recuperação de desastres</li>
            <li>Auditorias de segurança periódicas</li>
          </ul>

          <h2>5. Retenção de Dados</h2>
          <p>
            Mantemos suas informações pelo tempo necessário para fornecer o
            serviço e cumprir obrigações legais. Após o encerramento da conta:
          </p>
          <ul>
            <li>Dados de cadastro: retidos por 5 anos (obrigação fiscal)</li>
            <li>Dados de transações: retidos por 5 anos</li>
            <li>Logs de acesso: retidos por 6 meses</li>
            <li>Dados de marketing: excluídos imediatamente mediante solicitação</li>
          </ul>

          <h2>6. Seus Direitos</h2>
          <p>Você tem os seguintes direitos sobre seus dados:</p>
          <ul>
            <li><strong>Acesso:</strong> solicitar cópia de seus dados</li>
            <li><strong>Correção:</strong> corrigir dados incorretos</li>
            <li><strong>Exclusão:</strong> solicitar exclusão de seus dados</li>
            <li><strong>Portabilidade:</strong> receber seus dados em formato estruturado</li>
            <li><strong>Oposição:</strong> se opor ao processamento para marketing</li>
            <li><strong>Revogação:</strong> retirar consentimentos dados anteriormente</li>
          </ul>
          <p>
            Para exercer esses direitos, entre em contato com nosso DPO em
            privacidade@puncto.com.br.
          </p>

          <h2>7. Cookies e Tecnologias Similares</h2>
          <p>Usamos cookies para:</p>
          <ul>
            <li>Manter você conectado à sua conta</li>
            <li>Lembrar suas preferências</li>
            <li>Analisar o uso do serviço</li>
            <li>Personalizar conteúdo e anúncios</li>
          </ul>
          <p>
            Você pode gerenciar suas preferências de cookies nas configurações
            do seu navegador ou através do nosso banner de consentimento.
          </p>

          <h2>8. Transferências Internacionais</h2>
          <p>
            Seus dados podem ser transferidos e processados em servidores fora
            do Brasil. Garantimos que essas transferências cumpram a LGPD
            através de cláusulas contratuais padrão e outros mecanismos legais.
          </p>

          <h2>9. Menores de Idade</h2>
          <p>
            Nosso serviço não é destinado a menores de 18 anos. Não coletamos
            intencionalmente informações de menores. Se descobrirmos que
            coletamos dados de um menor, excluiremos essas informações.
          </p>

          <h2>10. Alterações nesta Política</h2>
          <p>
            Podemos atualizar esta Política periodicamente. Notificaremos você
            sobre alterações significativas por email ou através de aviso no
            serviço. Recomendamos revisar esta página regularmente.
          </p>

          <h2>11. Contato</h2>
          <p>
            Para questões sobre privacidade, entre em contato:
          </p>
          <ul>
            <li>Email do DPO: privacidade@puncto.com.br</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
