import { normalizeString } from "./string";

const infoTagToIconName: Record<string, string> = {
	matricula: "book",
	avaliacoes: "abacus",
	progressao: "clock",
	conclusao: "graduation-cap",
	alimentacao: "apple",
	transporte: "bus",
	biblioteca: "books",
	saude: "health-kit",
	estagios: "briefcase",
	bolsas: "info",
};

export function getInfoIconName(tagName: string): string {
	const key = normalizeString(tagName);
	return infoTagToIconName[key] ?? "unknown";
}

