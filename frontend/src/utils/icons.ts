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
	auxilios: "pig-money",
	moradia: "home",
	acessibilidade: "acessible",
	apoio_psicologico: 'brain',
	pesquisa: "microscope",
	monitoria: "chalkboard-teacher",
	estagio: 'briefcase',
	curriculo: 'file-description',
	bolsas: "info",
};

export function getInfoIconName(tagName: string): string {
	const key = normalizeString(tagName);
	return infoTagToIconName[key] ?? "unknown";
}

