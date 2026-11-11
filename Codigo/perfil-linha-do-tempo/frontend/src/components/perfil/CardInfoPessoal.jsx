import CardHead from "./CardHead.jsx";
import Icon from "../Icon.jsx";
import { formatarData } from "../../utils/formatadores.js";

function InfoRow({ icone, rotulo, valor }) {
  let texto = valor;
  if (!valor) {
    texto = "Não informado";
  }

  return (
    <div className="info-row">
      <Icon name={icone} />
      <div>
        <small>{rotulo}</small>
        <span>{texto}</span>
      </div>
    </div>
  );
}

function CardInfoPessoal({ idoso }) {
  return (
    <article className="card">
      <CardHead icone="user" titulo="Informações pessoais" />
      <div className="info-list">
        <InfoRow icone="calendar" rotulo="Data de nascimento" valor={formatarData(idoso.dataNascimento)} />
        <InfoRow icone="user" rotulo="Sexo" valor={idoso.sexo} />
        <InfoRow icone="phone" rotulo="Telefone" valor={idoso.telefone} />
        <InfoRow icone="map-pin" rotulo="Endereço" valor={idoso.endereco} />
        <InfoRow icone="shield" rotulo="Plano de saúde" valor={idoso.planoSaude} />
      </div>
    </article>
  );
}

export default CardInfoPessoal;
