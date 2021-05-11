import { useContext, useEffect, useState } from "react";
import { UserContext } from "../Context/UserProvider";

export default function usePermissao(moduloName) {

  const { user } = useContext(UserContext)
  const [permissao, setPermissao] = useState({});

  useEffect(() => {
    if (user && user.permissoes) {
      let permissao = user.permissoes.find(permissao => permissao.modulo === moduloName)
      setPermissao(permissao)
    }
  }, [user, moduloName]);

  return { permissao };
}