import { buildProductDetails, parseDescriptionContent } from './product-details.util';

describe('buildProductDetails', () => {
  it('builds SPC details from dimensions and adds pose chip when missing', () => {
    const details = buildProductDetails({
      type: 'spc',
      descriptionShort: 'Accroche',
      descriptionLong: 'Description longue',
      dimensions: '2,2 m²/boîte • Épaisseur 5 mm',
    });

    expect(details.headline).toBe('SPC');
    expect(details.detailChips).toEqual(['2,2 m²/boîte', 'Épaisseur 5 mm', 'Pose click']);
    expect(details.installationManualUrl).toBe('/guide-installation-spc');
  });

  it('uses panel defaults and fallback description when fields are empty', () => {
    const details = buildProductDetails({
      type: 'acoustic',
      descriptionShort: ' ',
      descriptionLong: '',
      dimensions: '',
    });

    expect(details.longDescription).toBe('Description à venir.');
    expect(details.detailChips).toEqual(['600×600', 'Épaisseur 21 mm', 'Installation rapide', 'Feutre acoustique']);
    expect(details.installationManualLabel).toBe('Guide d’installation panneaux');
  });
});

describe('parseDescriptionContent', () => {
  it('detects bullet lists', () => {
    const content = parseDescriptionContent('- Élément 1\n- Élément 2');

    expect(content.listItems).toEqual(['Élément 1', 'Élément 2']);
    expect(content.paragraphs).toEqual([]);
  });
});
