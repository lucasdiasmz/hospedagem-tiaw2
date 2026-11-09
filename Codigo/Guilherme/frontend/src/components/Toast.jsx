import { useEffect } from "react";

function Toast({ toast, onFechar }) {
  useEffect(function () {
    if (toast) {
      const timer = setTimeout(onFechar, 2600);
      return function () {
        clearTimeout(timer);
      };
    }
  }, [toast, onFechar]);

  let classe = "toast";
  let texto = "";

  if (toast) {
    classe = "toast show";
    texto = toast.texto;
  }

  return (
    <div className={classe} role="status" aria-live="polite">
      {texto}
    </div>
  );
}

export default Toast;
