import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Conformidade LGPD',
  description: 'Como o Puncto cumpre a Lei Geral de Proteção de Dados.',
};

export default function LGPDPage() {
  return (
    <div className="section bg-white">
      <div className="container-marketing">
        <div className="max-w-3xl mx-auto prose prose-slate">
          <h1>Conformidade com a LGPD</h1>
          <p className="lead">
            Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018)
          </p>

          <div className="bg-primary-50 rounded-xl p-6 not-prose mb-8">
            <h3 className="font-semibold text-primary-900 mb-2">
              Nosso compromisso com a LGPD
            </h3>
            <p className="text-primary-700">
              O Puncto está totalmente comprometido com a conformidade à LGPD.
              Implementamos medidas técnicas e organizacionais para garantir a
              proteção dos dados pessoais de nossos usuários e dos clientes
              de nossos usuários.
            </p>
          </div>

          <h2>1. O que é a LGPD?</h2>
          <p>
            A Lei Geral de Proteção de Dados Pessoais (LGPD) é a legislação
            brasileira que regula o tratamento de dados pessoais por empresas
            públicas e privadas. A lei visa proteger os direitos fundamentais
            de liberdade e privacidade dos titulares de dados.
          </p>

          <h2>2. Papéis na LGPD</h2>
          
          <h3>2.1 Puncto como Controlador</h3>
          <p>
            Quando você cria uma conta no Puncto, somos o Controlador dos seus
            dados pessoais (dados do seu perfil, informações de pagamento, etc.).
          </p>

          <h3>2.2 Puncto como Operador</h3>
          <p>
            Quando você usa o Puncto para gerenciar dados de seus clientes
            (agendamentos, histórico de serviços, etc.), atuamos como Operador.
            Você é o Controlador desses dados e é responsável por garantir que
            tem base legal para o tratamento.
          </p>

          <h2>3. Bases Legais Utilizadas</h2>
          <p>Tratamos dados pessoais com base nas seguintes hipóteses legais:</p>
          <ul>
            <li>
              <strong>Execução de contrato:</strong> para fornecer o serviço
              contratado
            </li>
            <li>
              <strong>Consentimento:</strong> para marketing e comunicações
              opcionais
            </li>
            <li>
              <strong>Legítimo interesse:</strong> para melhorias no serviço e
              segurança
            </li>
            <li>
              <strong>Obrigação legal:</strong> para cumprimento de exigências
              fiscais e regulatórias
            </li>
          </ul>

          <h2>4. Direitos dos Titulares</h2>
          <p>
            Garantimos aos titulares de dados o exercício de todos os direitos
            previstos na LGPD:
          </p>
          <ul>
            <li>
              <strong>Confirmação e acesso:</strong> saber se tratamos seus dados
              e acessá-los
            </li>
            <li>
              <strong>Correção:</strong> corrigir dados incompletos, inexatos ou
              desatualizados
            </li>
            <li>
              <strong>Anonimização, bloqueio ou eliminação:</strong> de dados
              desnecessários ou excessivos
            </li>
            <li>
              <strong>Portabilidade:</strong> receber seus dados em formato
              estruturado
            </li>
            <li>
              <strong>Eliminação:</strong> excluir dados tratados com base no
              consentimento
            </li>
            <li>
              <strong>Informação:</strong> sobre compartilhamento de dados
            </li>
            <li>
              <strong>Revogação:</strong> do consentimento a qualquer momento
            </li>
          </ul>

          <h2>5. Como Exercer Seus Direitos</h2>
          <p>
            Para exercer qualquer dos direitos acima, você pode:
          </p>
          <ul>
            <li>Acessar as configurações de privacidade na sua conta</li>
            <li>Enviar solicitação para privacidade@puncto.com.br</li>
            <li>Contatar nosso DPO diretamente</li>
          </ul>
          <p>
            Responderemos às solicitações em até 15 dias, conforme determina
            a legislação.
          </p>

          <h2>6. Encarregado de Proteção de Dados (DPO)</h2>
          <div className="bg-slate-50 rounded-xl p-6 not-prose">
            <p className="text-slate-600 mb-4">
              Nomeamos um Encarregado de Proteção de Dados para atender às
              solicitações dos titulares e atuar como canal de comunicação
              com a ANPD.
            </p>
            <p className="text-slate-600">
              Email: privacidade@puncto.com.br
            </p>
          </div>

          <h2>7. Medidas de Segurança</h2>
          <p>
            Implementamos medidas técnicas e administrativas para proteger os
            dados pessoais:
          </p>
          <ul>
            <li>Criptografia de dados em trânsito e em repouso</li>
            <li>Controle de acesso baseado em funções</li>
            <li>Autenticação multifator</li>
            <li>Monitoramento e detecção de incidentes</li>
            <li>Backups regulares e plano de recuperação</li>
            <li>Treinamento de funcionários em proteção de dados</li>
            <li>Avaliações de impacto à proteção de dados (DPIA)</li>
          </ul>

          <h2>8. Transferência Internacional</h2>
          <p>
            Quando necessário transferir dados para fora do Brasil, utilizamos:
          </p>
          <ul>
            <li>Cláusulas contratuais padrão aprovadas</li>
            <li>Transferência para países com nível adequado de proteção</li>
            <li>Consentimento específico do titular quando aplicável</li>
          </ul>

          <h2>9. Incidentes de Segurança</h2>
          <p>
            Em caso de incidente de segurança que possa acarretar risco ou
            dano relevante aos titulares:
          </p>
          <ul>
            <li>Comunicaremos a ANPD em prazo razoável</li>
            <li>Notificaremos os titulares afetados</li>
            <li>Tomaremos medidas para mitigar os efeitos do incidente</li>
          </ul>

          <h2>10. Para Usuários do Puncto (Controladores)</h2>
          <p>
            Se você usa o Puncto para gerenciar dados de seus clientes, você
            é o Controlador desses dados. Recomendamos:
          </p>
          <ul>
            <li>Informar seus clientes sobre o uso do Puncto</li>
            <li>Obter consentimento quando necessário</li>
            <li>Incluir informações sobre o Puncto em sua política de privacidade</li>
            <li>Responder às solicitações de seus clientes</li>
          </ul>
          <p>
            Oferecemos ferramentas para ajudá-lo a cumprir suas obrigações,
            incluindo exportação de dados e exclusão mediante solicitação.
          </p>

          <h2>11. Atualizações</h2>
          <p>
            Esta página pode ser atualizada para refletir mudanças em nossas
            práticas ou na legislação. Recomendamos revisá-la periodicamente.
          </p>

          <div className="mt-8 pt-8 border-t border-slate-200 not-prose">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Documentos Relacionados
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/legal/privacy"
                  className="text-primary-600 hover:text-primary-700"
                >
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/terms"
                  className="text-primary-600 hover:text-primary-700"
                >
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/cookies"
                  className="text-primary-600 hover:text-primary-700"
                >
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
