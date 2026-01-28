import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Acessibilidade',
  description: 'Compromisso do Puncto com a acessibilidade digital.',
};

export default function AccessibilityPage() {
  return (
    <div className="section bg-white">
      <div className="container-marketing">
        <div className="max-w-3xl mx-auto prose prose-slate">
          <h1>Acessibilidade Digital</h1>
          <p className="lead">
            Última atualização: 28 de Janeiro de 2026
          </p>

          <div className="bg-primary-50 rounded-xl p-6 not-prose mb-8">
            <h3 className="font-semibold text-primary-900 mb-2">
              Nosso compromisso
            </h3>
            <p className="text-primary-700">
              O Puncto está comprometido em tornar nosso site e plataforma
              acessíveis para todas as pessoas, independentemente de suas
              habilidades ou tecnologias assistivas utilizadas.
            </p>
          </div>

          <h2>1. O que é Acessibilidade Digital?</h2>
          <p>
            Acessibilidade digital significa que pessoas com deficiência podem
            perceber, entender, navegar e interagir com websites e aplicativos
            web de forma efetiva. Isso inclui pessoas com deficiências visuais,
            auditivas, motoras, cognitivas e outras condições.
          </p>

          <h2>2. Padrões de Acessibilidade</h2>
          <p>
            Nosso site e plataforma seguem as diretrizes do{' '}
            <a
              href="https://www.w3.org/WAI/WCAG21/quickref/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700"
            >
              WCAG 2.1 (Web Content Accessibility Guidelines)
            </a>{' '}
            no nível AA, que é o padrão internacional recomendado para
            acessibilidade web.
          </p>

          <h2>3. Recursos de Acessibilidade Implementados</h2>

          <h3>3.1 Navegação por Teclado</h3>
          <p>
            Todo o conteúdo e funcionalidades podem ser acessados usando apenas
            o teclado, sem necessidade de mouse. Use:
          </p>
          <ul>
            <li>
              <strong>Tab:</strong> navegar entre elementos interativos
            </li>
            <li>
              <strong>Enter/Space:</strong> ativar botões e links
            </li>
            <li>
              <strong>Setas:</strong> navegar em menus e listas
            </li>
            <li>
              <strong>Esc:</strong> fechar modais e menus
            </li>
          </ul>

          <h3>3.2 Leitores de Tela</h3>
          <p>
            Nossas páginas são compatíveis com leitores de tela populares como:
          </p>
          <ul>
            <li>NVDA (Windows)</li>
            <li>JAWS (Windows)</li>
            <li>VoiceOver (macOS e iOS)</li>
            <li>TalkBack (Android)</li>
          </ul>
          <p>
            Utilizamos HTML semântico, atributos ARIA apropriados e textos
            alternativos para imagens.
          </p>

          <h3>3.3 Contraste de Cores</h3>
          <p>
            Mantemos um contraste mínimo de 4.5:1 para texto normal e 3:1 para
            texto grande, conforme as diretrizes WCAG. Nossas cores foram
            testadas para garantir legibilidade.
          </p>

          <h3>3.4 Textos Alternativos</h3>
          <p>
            Todas as imagens informativas possuem textos alternativos
            descritivos. Imagens decorativas são marcadas adequadamente para
            serem ignoradas por leitores de tela.
          </p>

          <h3>3.5 Formulários Acessíveis</h3>
          <p>
            Todos os formulários incluem:
          </p>
          <ul>
            <li>Labels associados aos campos</li>
            <li>Mensagens de erro claras e específicas</li>
            <li>Indicação de campos obrigatórios</li>
            <li>Validação em tempo real quando apropriado</li>
          </ul>

          <h3>3.6 Responsividade</h3>
          <p>
            Nosso site é totalmente responsivo e funciona bem em diferentes
            tamanhos de tela, desde smartphones até monitores grandes. O
            conteúdo se adapta automaticamente ao tamanho da tela.
          </p>

          <h2>4. Tecnologias Assistivas Suportadas</h2>
          <p>
            Testamos nossa plataforma com as seguintes tecnologias assistivas:
          </p>
          <ul>
            <li>Leitores de tela (NVDA, JAWS, VoiceOver)</li>
            <li>Ampliadores de tela</li>
            <li>Software de reconhecimento de voz</li>
            <li>Navegação por teclado</li>
            <li>Controles alternativos (switches, joysticks)</li>
          </ul>

          <h2>5. Melhorias Contínuas</h2>
          <p>
            Estamos constantemente trabalhando para melhorar a acessibilidade de
            nosso site e plataforma. Realizamos:
          </p>
          <ul>
            <li>Testes regulares com usuários reais</li>
            <li>Auditorias de acessibilidade periódicas</li>
            <li>Revisão de feedback de usuários</li>
            <li>Atualizações conforme novas diretrizes</li>
          </ul>

          <h2>6. Feedback e Suporte</h2>
          <p>
            Se você encontrar alguma barreira de acessibilidade em nosso site
            ou plataforma, ou se precisar de ajuda para acessar algum conteúdo,
            entre em contato conosco:
          </p>
          <div className="bg-slate-50 rounded-xl p-6 not-prose">
            <p className="font-medium text-slate-900 mb-2">
              Equipe de Acessibilidade
            </p>
            <p className="text-slate-600">
              Email: acessibilidade@puncto.com.br<br />
              Horário: Segunda a Sexta, 9h às 18h
            </p>
          </div>
          <p>
            Responderemos ao seu contato em até 48 horas úteis e trabalharemos
            para resolver qualquer problema identificado.
          </p>

          <h2>7. Conformidade Legal</h2>
          <p>
            Estamos comprometidos em cumprir:
          </p>
          <ul>
            <li>
              <strong>Lei Brasileira de Inclusão (LBI - Lei nº 13.146/2015):</strong>{' '}
              que estabelece a acessibilidade como direito fundamental
            </li>
            <li>
              <strong>Decreto nº 9.296/2018:</strong> que regulamenta a
              acessibilidade em sítios eletrônicos da administração pública
            </li>
            <li>
              <strong>WCAG 2.1 Nível AA:</strong> padrão internacional de
              acessibilidade web
            </li>
          </ul>

          <h2>8. Recursos Adicionais</h2>
          <p>
            Para mais informações sobre acessibilidade digital:
          </p>
          <ul>
            <li>
              <a
                href="https://www.w3.org/WAI/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700"
              >
                Web Accessibility Initiative (WAI)
              </a>
            </li>
            <li>
              <a
                href="https://www.gov.br/governodigital/pt-br/acessibilidade-digital"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700"
              >
                Governo Digital - Acessibilidade
              </a>
            </li>
            <li>
              <a
                href="https://www.mpsp.mp.br/portal/page/portal/assessoria_imprensa/noticias/acessibilidade-digital"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700"
              >
                Recursos sobre Acessibilidade Digital
              </a>
            </li>
          </ul>

          <h2>9. Atualizações</h2>
          <p>
            Esta página será atualizada periodicamente para refletir melhorias
            em acessibilidade e mudanças em nossas práticas. Recomendamos
            revisá-la regularmente.
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
                  href="/legal/lgpd"
                  className="text-primary-600 hover:text-primary-700"
                >
                  Conformidade LGPD
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
