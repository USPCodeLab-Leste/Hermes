# Ícones SVG (guia rápido)

Este projeto usa SVGR com Vite para importar SVGs como componentes React (`.svg?react`).
Veja como preparar o SVG e controlar o contorno (stroke) por classe ou por props.

## Fonte dos ícones (Figma)

Os ícones são extraídos da aba "🎨 Style Guide" do Figma do projeto. Acesse ele por [aqui](https://www.figma.com/design/YEx5okwe7xDmRbtMsB9zC4/Plataforma-Hermes?node-id=37-7811)

## Como importar

```tsx
import HomeIcon from "./assets/icons/home.svg?react";

export function Exemplo() {
  return <HomeIcon className="w-6 h-6 stroke-amber-500" />;
}
```

## Como controlar a cor do contorno

Existem duas formas. Ambas exigem que o SVG não tenha `stroke` fixo nos nós internos.

1) Usando classes (Tailwind)

- Pré‑requisito: no nó `<svg>` usar `stroke="currentColor"` e remover `stroke` dos filhos.
- Exemplo de uso: `className="stroke-amber-500 hover:stroke-amber-600"`.

2) Usando props do componente

- Exemplo: `<HomeIcon stroke="#f59e0b" strokeWidth={1.5} />`.
- Útil quando precisa definir a cor dinamicamente sem classes.

## Preparando o SVG (passo a passo)

1. Abra o arquivo `.svg` no editor.
2. No nó raiz `<svg>`, deixe assim:

```svg
<svg width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- sem atributos de stroke/fill fixos nos filhos -->
  <path d="M4.5 21.5H19.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M4.5 21.5V8M19.5 21.5V8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M2 10L12 2L22 10" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M9.5 21.5V12.5H14.5V21.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- repare que os paths não têm stroke/fill com cor fixa -->
</svg>
```

3. Caso o ícone seja preenchido (fill), use `fill="currentColor"` no `<svg>` e remova `fill` fixo dos filhos.

## Exemplos rápidos

- Cor via classe: `<HomeIcon className="stroke-amber-200" />`
- Espessura via prop: `<HomeIcon strokeWidth={2} />`
- Tamanho via classe: `<HomeIcon className="size-5" />`
- Hover: `<HomeIcon className="stroke-slate-500 hover:stroke-slate-700" />`

## Dicas e problemas comuns

- A cor não muda? Verifique se algum `<path>` ainda possui `stroke="#..."` ou `fill="#..."`. Remova esses atributos.
- O ícone sumiu após `fill="none"`? Seu desenho pode depender de `fill`. Nesse caso, use `fill="currentColor"` e controle a cor por classe/prop.
- Import falhando? Garanta o sufixo `?react` no import e que o plugin `vite-plugin-svgr` está configurado no `vite.config.ts`.

Pronto! Assim você controla facilmente a aparência dos ícones por classe (Tailwind) ou por props, sem precisar editar o componente toda vez.