import { describe, it, vi, expect, beforeEach } from 'vitest';

describe('main.ts', () => {
  let appMountSpy: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    vi.resetModules();
    appMountSpy = vi.fn();
    vi.doMock('vue', async () => {
      const vue = (await vi.importActual<unknown>('vue')) as Record<string, unknown>;
      return {
        ...vue,
        createApp: () => ({
          use: vi.fn().mockReturnThis(),
          mount: appMountSpy,
        }),
      };
    });
  });

  it('should create and mount the app', async () => {
    await import('../main');
    expect(appMountSpy).toHaveBeenCalledWith('#app');
  });
});
