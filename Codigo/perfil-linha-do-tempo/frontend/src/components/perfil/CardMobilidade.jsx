import CardHead from "./CardHead.jsx";
import ListaChips from "./ListaChips.jsx";
import Icon from "../Icon.jsx";
import { getClasseNivel } from "../../utils/formatadores.js";

function CardMobilidade({ mobilidade }) {
  return (
    <article className="card card-alto">
      <CardHead icone="accessibility" titulo="Mobilidade e acessibilidade" />
      <span className={"level-badge " + getClasseNivel(mobilidade.nivel)}>
        <Icon name="accessibility" />
        {mobilidade.nivel}
      </span>
      <p className="text-block">{mobilidade.descricao}</p>
      <div className="bloco-chips">
        <p className="label">Equipamentos</p>
        <ListaChips itens={mobilidade.equipamentos} variante="padrao" />
      </div>
      <div className="bloco-chips">
        <p className="label">Precisa de ajuda para</p>
        <ListaChips itens={mobilidade.precisaAjudaPara} variante="ajuda" />
      </div>
    </article>
  );
}

export default CardMobilidade;
