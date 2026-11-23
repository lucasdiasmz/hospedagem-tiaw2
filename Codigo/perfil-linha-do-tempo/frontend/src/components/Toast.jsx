import ToastDS from "@ds/Toast.jsx";

/* adaptador: as páginas usam { texto, id }; o aviso do design system usa { msg, id } */
function Toast({ toast }) {
  return <ToastDS aviso={toast ? { msg: toast.texto, id: toast.id, tipo: toast.tipo } : null} />;
}

export default Toast;
