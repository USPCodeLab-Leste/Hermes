// Intruções:
import { useInfosByTag } from './../hooks/infos/useInfosByTag';
import { useInfosCountByType } from './../hooks/infos/useInfosCountByType';

// - usar os HOOKS em /hooks/infos para pegar as infos
// - usar LazySvg para os ícones das INFORMAÇÕES
// - usar infoTagIcons em /mocks/infos.mock.ts para pegar os ícones das TAGS
// - vide figma para estrutura do card de informação

export default function Info() {
  return (
    <>
        <p>Aqui serão renderizados os cards trazidos pelo hook <code>useInfosByTag</code></p>
        <p>Cada card tem uma contagem (que pode ser obtido pelo hook <code>useInfosCountByType</code>)</p>
        <p>E cada card tem um icon (que pode ser obtido pelo objeto <code>infoTagIcons</code>)</p>
        <p>Clicar no card levará para a página detalhada da informação, cuja rota é <code>/tipo_atual/:tagName</code></p>
        <p>ex: <code>/estudos/matricula</code></p>
    </>
  );
}
