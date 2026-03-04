/// <reference types="vite/client" />

// Extend or explicitly declare the env types used in the project.
// Add your VITE_... variables here to get proper typing in TSX files.
interface ImportMetaEnv {
	readonly VITE_API_URL: string;
	// more env vars... e.g. readonly VITE_SOME_KEY: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}