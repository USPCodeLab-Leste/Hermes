export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Erro ao converter arquivo para Base64"));
        return;
      }

      // Remove "data:image/...;base64,"
      const base64 = result.split(",")[1];
      resolve(base64);
    };

    reader.onerror = () => {
      reject(new Error("Erro ao ler o arquivo"));
    };

    reader.readAsDataURL(file);
  });
}

export async function uploadBase64ToImgbb(base64Image: string): Promise<string> {
  const API_KEY = import.meta.env.VITE_IMG_API_KEY as string | undefined;

  if (!API_KEY) {
    console.error("Chave de API para imgbb não encontrada. Verifique as variáveis de ambiente.");
    throw new Error("Chave de API para imgbb não configurada");
  }

  const formData = new FormData();
  formData.append("image", base64Image);

  const isDebug = import.meta.env.VITE_DEBUG === "true";

  const params = new URLSearchParams({
    key: API_KEY,
  });

  if (isDebug) {
    params.set("expiration", "600");
  }

  const response = await fetch(
    `https://api.imgbb.com/1/upload?${params.toString()}`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    throw new Error("Erro ao fazer upload da imagem");
  }

  const data = await response.json();

  return data.data.display_url as string;
}

export async function uploadBannerAndGetUrl(file: File) {
  const base64 = await fileToBase64(file);
  const imageUrl = await uploadBase64ToImgbb(base64);

  return imageUrl;
}