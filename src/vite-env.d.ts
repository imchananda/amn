/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GAS_URL: string
  readonly VITE_USER_PASSWORD: string
  readonly VITE_ADMIN_PASSWORD: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
