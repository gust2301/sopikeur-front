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

  it('maps product detail galleryImages from the public API', () => {
    const result = normalizeApiProductsResponse(
      [
        {
          id: 'spc-3',
          sku: 'SPC003',
          type: 'SPC',
          name: 'SPC 003',
          mainImage: 'spc/cover.png',
          galleryImages: ['spc/detail-1.png', 'spc/detail-2.png'],
        },
      ],
      'spc',
    );

    expect(result.items[0].image).toBe('/assets/spc/cover.png');
    expect(result.items[0].images).toEqual(['/assets/spc/detail-1.png', '/assets/spc/detail-2.png']);
  });

  it('maps media asset objects when galleryImages is not present', () => {
    const result = normalizeApiProductsResponse(
      [
        {
          id: 'panel-2',
          sku: 'P-2',
          type: 'PANEL',
          name: 'Panel 2',
          mainImage: 'panels/cover.png',
          images: [
            { path: 'panels/cover.png', cover: true },
            { path: 'panels/detail-1.png', cover: false },
            { path: 'panels/detail-2.png', cover: false },
          ],
        },
      ],
      'acoustic',
    );

    expect(result.items[0].image).toBe('/assets/panels/cover.png');
    expect(result.items[0].images).toEqual([
      '/assets/panels/cover.png',
      '/assets/panels/detail-1.png',
      '/assets/panels/detail-2.png',
    ]);
  });

  it('maps promotion pricing fields without overwriting the original price reference', () => {
    const result = normalizeApiProductsResponse(
      [
        {
          id: 'promo-1',
          sku: 'SPC-PROMO',
          type: 'SPC',
          name: 'SPC Promo',
          price: 34900,
          effectivePrice: 29900,
          promotionActive: true,
          promoLabel: 'Promo',
          discountPercent: 14,
        },
      ],
      'spc',
    );

    expect(result.items[0].price).toBe('29900');
    expect(result.items[0].effectivePrice).toBe('29900');
    expect(result.items[0].originalPrice).toBe('34900');
    expect(result.items[0].promotionActive).toBeTrue();
    expect(result.items[0].discountPercent).toBe(14);
  });
});
