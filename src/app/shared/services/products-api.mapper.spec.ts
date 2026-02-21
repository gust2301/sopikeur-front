import { normalizeApiProductsResponse } from './products-api.mapper';

describe('normalizeApiProductsResponse', () => {
  it('supports list response format', () => {
    const result = normalizeApiProductsResponse(
      [
        {
          id: 'abc',
          sku: 'SPC001',
          type: 'SPC',
          name: 'SPC 001',
          descriptionShort: 'Desc courte',
          mainImage: 'https://cdn.example.com/image.png',
          dimensions: '2,2 m²/boîte • Épaisseur 5 mm',
          longDescription: 'Description longue',
          price: 20000,
        },
      ],
      'spc',
    );

    expect(result.total).toBe(1);
    expect(result.items.length).toBe(1);
    expect(result.items[0].shortDescription).toBe('Desc courte');
    expect(result.items[0].image).toBe('https://cdn.example.com/image.png');
    expect(result.items[0].descriptionLong).toBe('Description longue');
    expect(result.items[0].dimensions).toBe('2,2 m²/boîte • Épaisseur 5 mm');
    expect(result.items[0].type).toBe('spc');
  });


  it('prioritizes backend descriptionLong when available', () => {
    const result = normalizeApiProductsResponse(
      [
        {
          id: 'spc-2',
          sku: 'SPC002',
          type: 'SPC',
          name: 'SPC 002',
          descriptionShort: 'Version courte',
          descriptionLong: 'Description longue backend',
          longDescription: 'LongDescription legacy',
        },
      ],
      'spc',
    );

    expect(result.items[0].descriptionLong).toBe('Description longue backend');
    expect(result.items[0].description).toBe('Description longue backend');
  });

  it('supports paginated response format', () => {
    const result = normalizeApiProductsResponse(
      {
        items: [
          {
            id: 'panel-1',
            sku: 'P-1',
            productType: 'PANEL',
            name: 'Panel 1',
            coverUrl: 'https://cdn.example.com/panel.png',
            stockStatus: 'IN_STOCK',
          },
        ],
        total: 42,
      },
      'acoustic',
    );

    expect(result.total).toBe(42);
    expect(result.items.length).toBe(1);
    expect(result.items[0].type).toBe('acoustic');
    expect(result.items[0].image).toBe('https://cdn.example.com/panel.png');
    expect(result.items[0].inStock).toBeTrue();
  });
});
