
function normalizeKey(value: string) {
	return value
		.trim()
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "");
}

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
	const key = normalizeKey(tagName);
	return infoTagToIconName[key] ?? "unknown";
}

