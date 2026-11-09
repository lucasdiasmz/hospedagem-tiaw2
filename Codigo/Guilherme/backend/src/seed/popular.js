import Idoso from "../models/Idoso.js";
import Relato from "../models/Relato.js";
import { idososIniciais } from "./dados.js";
import { relatosHoje, relatosAnteriores, USUARIO_LOGADO } from "./relatos.js";
import { hojeNoFuso, somarDias, dataHoraNoFuso } from "../utils/datas.js";

function montarRelatos(idsIdosos) {
  const agora = Date.now();
  const hoje = hojeNoFuso();

  const deHoje = relatosHoje.map(function (modelo) {
    return {
      idoso: idsIdosos[modelo.idoso],
      tipo: modelo.tipo,
      nivel: modelo.nivel,
      descricao: modelo.descricao,
      registradoPor: modelo.registradoPor,
      dataHora: new Date(agora - modelo.minutosAtras * 60000),
      visto: modelo.registradoPor.nome === USUARIO_LOGADO,
      vistoEm: null
    };
  });

  const anteriores = relatosAnteriores.map(function (modelo) {
    const dataHora = dataHoraNoFuso(somarDias(hoje, -modelo.diasAtras), modelo.horario);
    return {
      idoso: idsIdosos[modelo.idoso],
      tipo: modelo.tipo,
      nivel: modelo.nivel,
      descricao: modelo.descricao,
      registradoPor: modelo.registradoPor,
      dataHora: dataHora,
      visto: true,
      vistoEm: new Date(dataHora.getTime() + 30 * 60000)
    };
  });

  return deHoje.concat(anteriores).map(function (relato) {
    if (relato.visto && !relato.vistoEm) {
      return { ...relato, vistoEm: relato.dataHora };
    } else {
      return relato;
    }
  });
}

export async function popularBanco() {
  await Relato.deleteMany({});
  await Idoso.deleteMany({});

  const idosos = await Idoso.insertMany(idososIniciais);
  const ids = idosos.map(function (idoso) {
    return idoso._id;
  });

  const relatos = await Relato.insertMany(montarRelatos(ids));

  console.log(idosos.length + " idosos e " + relatos.length + " relatos inseridos no banco");
}
