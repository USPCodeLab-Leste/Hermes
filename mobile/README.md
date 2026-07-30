# Mobile Hermes

Aplicacao mobile em Expo (React Native) que carrega o frontend via WebView.

## Requisitos

- Node.js 20+
- npm 10+
- Expo CLI via `npx expo`
- Android Studio (para emulador) ou celular Android fisico
- EAS CLI (`npm i -g eas-cli`) para gerar builds (development e producao)

## Instalacao

```bash
cd mobile
npm install
```

## Fluxo recomendado (com frontend local)

Para este projeto, o mobile em desenvolvimento espera o frontend rodando na rede local (porta `5173`).

### 1. Suba o frontend em LAN

Em outro terminal, na pasta `frontend`:

```bash
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

### 2. Inicie o Expo em LAN

Na pasta `mobile`:

```bash
npx expo start --lan
```

## Development build (Android)

Gere um novo build apenas quando houver mudancas nativas (plugins, permissao nativa, dependencia nativa, alteracoes no Android/iOS).

```bash
eas build --profile development --platform android
```

Depois de instalar esse build no aparelho, alteracoes em `App.tsx` e restante do codigo JS/TS normalmente nao exigem novo build.

## Build de producao

O profile de producao deste projeto e `production` (definido em `eas.json`).

Android:

```bash
eas build --profile production --platform android
```

iOS:

```bash
eas build --profile production --platform ios
```

## Scripts uteis

- `npm run start`: inicia Expo
- `npm run android`: executa app Android (workflow com nativo local)
- `npm run ios`: executa app iOS (workflow com nativo local)
- `npm run web`: inicia Expo Web

## Dicas de rede

- PC e celular precisam estar na mesma rede Wi-Fi.
- Se nao conectar, confira firewall do Windows liberando as portas usadas por Expo e Vite.
- Se o app cair para URL de producao em dev, reinicie Expo com `--lan`.