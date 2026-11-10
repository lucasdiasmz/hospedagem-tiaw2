export default function Estrutura({ children }) {
    const dataHoje = new Date().toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <>
            <aside className="menu-lateral">
                <a className="marca" href="../homepage/index.html">
                    <svg className="marca-simbolo" viewBox="0 0 64 64" aria-hidden="true">
                        <circle cx="24" cy="13" r="8" fill="#cad6ef"/>
                        <circle cx="45" cy="20" r="7" fill="#dde5e9"/>
                        <path d="M17 24C5 35 16 58 36 57c11 0 20-7 24-17-12 13-32 12-36-4 8 7 17 8 23 3 3-3 0-7-4-6-10 3-16-14-26-9Z" fill="#cad6ef"/>
                        <path d="M35 28c8 5 13 1 18-2 6 14-3 27-18 24-5-1-8-4-9-7 10 3 17 0 18-5-5-1-8-4-9-10Z" fill="#dde5e9"/>
                    </svg>
                    <span>
                        <strong>
                            AcessaMob
                        </strong>
                        <small>
                            cuidado e acessibilidade
                        </small>
                    </span>
                </a>
                <nav aria-label="Menu principal">
                    <a href="../homepage/index.html">
                        <span aria-hidden="true">
                            ⌂
                        </span>
                        Início
                    </a>
                    <a href="../agenda/index.html">
                        <span aria-hidden="true">
                            ▦
                        </span>
                        Agenda
                    </a>
                    <a href="./medicamentos.html" aria-current="page">
                        <span aria-hidden="true">
                            ♧
                        </span>
                        Medicamentos
                    </a>
                    <a href="../cuidadores/index.html">
                        <span aria-hidden="true">
                            ♡
                        </span>
                        Cuidadores
                    </a>
                    <a href="../perfil/index.html">
                        <span aria-hidden="true">
                            ♙
                        </span>
                        Perfil
                    </a>
                </nav>
                <div className="atalhos">
                    <p>
                        ATALHOS
                    </p>
                    <a href="../cadastro-idoso/index.html">
                        ＋ Adicionar cuidado
                    </a>
                    <a href="../perfil/index.html">
                        ↗ Ver minhas informações
                    </a>
                    <a href="../contato/index.html">
                        ✉ Contato e ajuda
                    </a>
                </div>
                <div className="perfil-lateral">
                    <span className="avatar">
                        M
                    </span>
                    <span>
                        <strong>
                            Maria Silva
                        </strong>
                        <small>
                            Cuidadora familiar
                        </small>
                    </span>
                </div>
                <small className="rodape-menu">
                    AcessaMob © 2026
                </small>
            </aside>
            <div className="conteudo">
                <header className="barra-superior">
                    <span>
                        Área de cuidado
                    </span>
                    <div>
                        <span className="data-hoje">{dataHoje}</span>
                        <span className="avatar">
                            M
                        </span>
                        <span>
                            Maria⌄
                        </span>
                    </div>
                </header>
                {children}
            </div>
        </>
    );
}
