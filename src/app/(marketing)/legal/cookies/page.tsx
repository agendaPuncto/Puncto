import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Cookies',
  description: 'Como o Puncto utiliza cookies e tecnologias similares.',
};

export default function CookiesPage() {
  return (
    <div className="section bg-white">
      <div className="container-marketing">
        <div className="max-w-3xl mx-auto prose prose-slate">
          <h1>Política de Cookies</h1>
          <p className="lead">
            Última atualização: 18 de Janeiro de 2026
          </p>

          <h2>1. O que são Cookies?</h2>
          <p>
            Cookies são pequenos arquivos de texto armazenados no seu dispositivo
            quando você visita um site. Eles são amplamente utilizados para fazer
            sites funcionarem de forma mais eficiente, bem como fornecer
            informações aos proprietários do site.
          </p>

          <h2>2. Como Usamos Cookies</h2>
          <p>O Puncto utiliza cookies para:</p>
          <ul>
            <li>Manter você conectado à sua conta durante a sessão</li>
            <li>Lembrar suas preferências (idioma, tema, configurações)</li>
            <li>Analisar como você usa nosso serviço</li>
            <li>Melhorar a segurança da plataforma</li>
            <li>Personalizar sua experiência</li>
          </ul>

          <h2>3. Tipos de Cookies que Usamos</h2>

          <h3>3.1 Cookies Essenciais</h3>
          <p>
            Necessários para o funcionamento básico do site. Sem eles, você não
            conseguiria navegar pelo site ou usar recursos essenciais.
          </p>
          <table>
            <thead>
              <tr>
                <th>Cookie</th>
                <th>Finalidade</th>
                <th>Duração</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>__session</td>
                <td>Autenticação do usuário</td>
                <td>Sessão</td>
              </tr>
              <tr>
                <td>csrf_token</td>
                <td>Segurança contra ataques CSRF</td>
                <td>Sessão</td>
              </tr>
              <tr>
                <td>cookie_consent</td>
                <td>Registro de preferências de cookies</td>
                <td>1 ano</td>
              </tr>
            </tbody>
          </table>

          <h3>3.2 Cookies de Desempenho</h3>
          <p>
            Coletam informações sobre como você usa o site, como páginas visitadas
            e erros encontrados. Esses dados são usados para melhorar o serviço.
          </p>
          <table>
            <thead>
              <tr>
                <th>Cookie</th>
                <th>Finalidade</th>
                <th>Duração</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>_ga</td>
                <td>Google Analytics - identificação</td>
                <td>2 anos</td>
              </tr>
              <tr>
                <td>_gid</td>
                <td>Google Analytics - sessão</td>
                <td>24 horas</td>
              </tr>
            </tbody>
          </table>

          <h3>3.3 Cookies de Funcionalidade</h3>
          <p>
            Permitem que o site lembre suas escolhas (como idioma ou região) e
            forneça recursos personalizados.
          </p>
          <table>
            <thead>
              <tr>
                <th>Cookie</th>
                <th>Finalidade</th>
                <th>Duração</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>locale</td>
                <td>Preferência de idioma</td>
                <td>1 ano</td>
              </tr>
              <tr>
                <td>theme</td>
                <td>Preferência de tema (claro/escuro)</td>
                <td>1 ano</td>
              </tr>
            </tbody>
          </table>

          <h3>3.4 Cookies de Marketing</h3>
          <p>
            Usados para rastrear visitantes em sites e exibir anúncios relevantes.
            Só são ativados com seu consentimento.
          </p>
          <table>
            <thead>
              <tr>
                <th>Cookie</th>
                <th>Finalidade</th>
                <th>Duração</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>_fbp</td>
                <td>Facebook Pixel</td>
                <td>3 meses</td>
              </tr>
              <tr>
                <td>_gcl_au</td>
                <td>Google Ads</td>
                <td>3 meses</td>
              </tr>
            </tbody>
          </table>

          <h2>4. Como Gerenciar Cookies</h2>
          
          <h3>4.1 Nosso Banner de Consentimento</h3>
          <p>
            Ao visitar nosso site pela primeira vez, você verá um banner de
            cookies onde pode aceitar ou configurar suas preferências. Você pode
            alterar essas preferências a qualquer momento clicando em
            &quot;Configurações de Cookies&quot; no rodapé do site.
          </p>

          <h3>4.2 Configurações do Navegador</h3>
          <p>
            A maioria dos navegadores permite controlar cookies através de suas
            configurações. Veja como gerenciar cookies nos principais navegadores:
          </p>
          <ul>
            <li>
              <a
                href="https://support.google.com/chrome/answer/95647"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Chrome
              </a>
            </li>
            <li>
              <a
                href="https://support.mozilla.org/pt-BR/kb/gerencie-configuracoes-de-armazenamento-local-de-s"
                target="_blank"
                rel="noopener noreferrer"
              >
                Mozilla Firefox
              </a>
            </li>
            <li>
              <a
                href="https://support.apple.com/pt-br/guide/safari/sfri11471/mac"
                target="_blank"
                rel="noopener noreferrer"
              >
                Safari
              </a>
            </li>
            <li>
              <a
                href="https://support.microsoft.com/pt-br/microsoft-edge/excluir-cookies-no-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                target="_blank"
                rel="noopener noreferrer"
              >
                Microsoft Edge
              </a>
            </li>
          </ul>

          <h2>5. Cookies de Terceiros</h2>
          <p>
            Alguns cookies são definidos por serviços de terceiros que aparecem
            em nossas páginas. Não controlamos esses cookies. Consulte as
            políticas de privacidade dos respectivos serviços:
          </p>
          <ul>
            <li>Google Analytics</li>
            <li>Facebook / Meta</li>
            <li>Stripe (pagamentos)</li>
            <li>Intercom (chat de suporte)</li>
          </ul>

          <h2>6. Alterações nesta Política</h2>
          <p>
            Podemos atualizar esta Política de Cookies periodicamente. Alterações
            significativas serão comunicadas através do banner de cookies ou por
            email.
          </p>

          <h2>7. Contato</h2>
          <p>
            Para dúvidas sobre nossa política de cookies, entre em contato:
          </p>
          <ul>
            <li>Email: privacidade@puncto.com.br</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
