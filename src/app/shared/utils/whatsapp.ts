export const buildWhatsappLink = (productName: string, sku: string): string => {
  const message = `Bonjour, je souhaite un devis pour: ${sku} - ${productName}. Quantité: ...`;
  return `https://wa.me/221773380463?text=${encodeURIComponent(message)}`;
};

export const buildWhatsappLinkFromMessage = (message: string): string =>
  `https://wa.me/221773380463?text=${encodeURIComponent(message)}`;
