import { assetUrl } from './asset-url';

describe('assetUrl', () => {
  it("returns '/assets/...' in dev for relative paths", () => {
    expect(assetUrl('spc/SPC001.png', '/assets')).toBe('/assets/spc/SPC001.png');
  });

  it('removes leading slash from relative path in dev', () => {
    expect(assetUrl('/spc/SPC001.png', '/assets')).toBe('/assets/spc/SPC001.png');
  });

  it('builds R2 URL in prod', () => {
    expect(assetUrl('spc/SPC001.png', 'https://assets.sopikeur.sn')).toBe('https://assets.sopikeur.sn/spc/SPC001.png');
  });

  it('keeps absolute URL untouched', () => {
    expect(assetUrl('https://assets.sopikeur.sn/spc/SPC001.png', '/assets')).toBe('https://assets.sopikeur.sn/spc/SPC001.png');
  });

  it('does not duplicate /assets for already-prefixed relative paths', () => {
    expect(assetUrl('assets/spc/SPC001.png', '/assets')).toBe('/assets/spc/SPC001.png');
  });

  it('does not duplicate /assets for already-prefixed absolute-local paths', () => {
    expect(assetUrl('/assets/spc/SPC001.png', '/assets')).toBe('/assets/spc/SPC001.png');
  });
});
