import { test, expect } from '@playwright/test';
import { join } from 'path';

test.describe('File Handler', () => {
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

  test('verifica il caricamento dei file CSV', async () => {
    const testFile = {
      name: 'test.csv',
      content: 'frame,tag_id,x,y\n1,1,100,100'
    };

    // Invoca l'API IPC per il caricamento del file
    const result = await window.evaluate(async (fileData) => {
      return await window.electronAPI.invoke('LoadCSV', fileData);
    }, testFile);

    expect(result).toBeTruthy();
  });

  test('verifica la gestione degli errori per file non validi', async () => {
    const invalidFile = {
      name: 'invalid.txt',
      content: 'invalid content'
    };

    // Verifica che venga generato un errore appropriato
    const errorPromise = window.evaluate(async (fileData) => {
      return await window.electronAPI.invoke('LoadCSV', fileData);
    }, invalidFile);

    await expect(errorPromise).rejects.toThrow();
  });
}); 