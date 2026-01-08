export const buildWhatsappLink = (productName: string, sku: string): string => {
  const message = `Bonjour, je souhaite un devis pour: ${sku} - ${productName}. Quantité: ...`;
  return `https://wa.me/221774293757?text=${encodeURIComponent(message)}`;
};
