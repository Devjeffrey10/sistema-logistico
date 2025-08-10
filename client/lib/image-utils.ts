// Utility functions for image handling

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export function resizeImage(
  file: File,
  maxWidth: number = 800,
  maxHeight: number = 600,
  quality: number = 0.8,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Could not get canvas context"));
      return;
    }

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress image
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to base64 with compression
      const base64 = canvas.toDataURL("image/jpeg", quality);
      resolve(base64);
    };

    img.onerror = () => reject(new Error("Failed to load image"));

    // Create object URL for the image
    img.src = URL.createObjectURL(file);
  });
}

export function validateImageFile(
  file: File,
  maxSizeMB: number = 5,
): string | null {
  // Check file type
  if (!file.type.startsWith("image/")) {
    return "Por favor, selecione apenas arquivos de imagem";
  }

  // Check file size
  if (file.size > maxSizeMB * 1024 * 1024) {
    return `A imagem deve ter no máximo ${maxSizeMB}MB`;
  }

  // Check for valid image extensions
  const validExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
  const fileExtension = file.name.split(".").pop()?.toLowerCase();

  if (!fileExtension || !validExtensions.includes(fileExtension)) {
    return "Formato de imagem não suportado. Use JPG, PNG, GIF ou WebP";
  }

  return null;
}

export function getImageDimensions(
  file: File,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };

    img.onerror = () => reject(new Error("Failed to load image"));

    img.src = URL.createObjectURL(file);
  });
}

// Generate initials for avatar fallback
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Generate a placeholder avatar URL based on name
export function generateAvatarUrl(name: string, size: number = 100): string {
  const initials = getInitials(name);
  const colors = [
    "FF6B6B",
    "4ECDC4",
    "45B7D1",
    "96CEB4",
    "FFEAA7",
    "DDA0DD",
    "98D8C8",
    "F7DC6F",
    "BB8FCE",
    "85C1E9",
  ];

  const colorIndex = name.length % colors.length;
  const backgroundColor = colors[colorIndex];

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=${size}&background=${backgroundColor}&color=ffffff&bold=true`;
}
