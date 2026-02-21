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
  // TODO: trocar por ENV
  const API_KEY = "d6e6acae5217b5d7c4daa4b9c7f115f0";

  const formData = new FormData();
  formData.append("image", base64Image);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?expiration=600&key=${API_KEY}`,
    {
      method: "POST",
      body: formData
    }
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