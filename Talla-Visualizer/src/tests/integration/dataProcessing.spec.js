import { test, expect } from '@playwright/test';

test.describe('Data Processing Integration', () => {
  let electronApp;
  let window;

  test.beforeAll(async () => {
    electronApp = await _electron.launch({
      args: ['.']
    });
    window = await electronApp.firstWindow();
  });

  test.afterAll(async () => {
    await electronApp.close();
  });

  test('verifica il processo completo di caricamento e visualizzazione', async () => {
    // Carica un file CSV
    await window.getByTestId('dropzone').setInputFiles({
      name: 'test.csv',
      mimeType: 'text/csv',
      buffer: Buffer.from('frame,tag_id,x,y\n1,1,100,100')
    });

    // Imposta FPS
    await window.getByTestId('fps-selector').selectOption('30');

    // Verifica che il grafico sia stato generato
    const chart = await window.getByTestId('main-chart');
    await expect(chart).toBeVisible();

    // Verifica i dati nel grafico
    const plotData = await window.evaluate(() => {
      return document.querySelector('[data-testid="main-chart"]').__data__;
    });
    expect(plotData).toBeTruthy();
  });
}); 