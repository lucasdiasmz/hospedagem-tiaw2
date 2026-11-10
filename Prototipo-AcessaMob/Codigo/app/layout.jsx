import "../styles/globals.css";

export const metadata = {
  title: "Agenda de Informações | AcessaMob",
  description:
    "Organize medicamentos e consultas em uma interface acessível do AcessaMob.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
