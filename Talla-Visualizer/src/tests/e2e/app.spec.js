import { test, expect} from "@playwright/test";
import { _electron } from "playwright";
const { findLatestBuild, parseElectronApp, clickMenuItemById } = require('electron-playwright-helpers')

test.describe("Talla Visualizer App", () => {
  let electronApp;
  let window;

  test.beforeAll(async () => {
    try {
      const latestBuild = await findLatestBuild();
      const appInfo = parseElectronApp(latestBuild);
      console.log('AppInfo:', appInfo);

      // Lancia l'app Electron
      electronApp = await _electron.launch({
        args: ['.'],
        executablePath: './out/talla-visualizer-win32-x64/talla-visualizer.exe',
      });

      // Ottieni la finestra principale
      window = await electronApp.firstWindow();
      await window.waitForLoadState('domcontentloaded');
    } catch (error) {
      console.error('Errore durante l\'avvio dell\'app Electron:', error);
    }
  });

  test.afterAll(async () => {
    if (electronApp) {
      await electronApp.close();
    }
  });

  test("verifica il titolo della finestra", async () => {
    if (!window) {
      console.error('La finestra non è stata inizializzata correttamente.');
      return;
    }
    await window.waitForLoadState("domcontentloaded");

    const title = await window.title();
    expect(title).toBe("Talla Visualizer");
  });

  // test("verifica il caricamento di un file CSV", async () => {
  //   // Simula il caricamento di un file
  //   const fileChooserPromise = window.waitForEvent("filechooser");
  //   await window.getByTestId("dropzone").click();
  //   const fileChooser = await fileChooserPromise;

  //   await fileChooser.setFiles({
  //     name: "test.csv",
  //     mimeType: "text/csv",
  //     buffer: Buffer.from("frame,tag_id,x,y\n1,1,100,100"),
  //   });

  //   // Verifica che il file sia stato caricato
  //   const fileList = await window.getByTestId("file-list");
  //   await expect(fileList).toContainText("test.csv");
  // });

  // test("verifica il selettore FPS", async () => {
  //   const fpsSelector = await window.getByTestId("fps-selector");
  //   await expect(fpsSelector).toBeVisible();

  //   // Seleziona un valore FPS
  //   await fpsSelector.selectOption("30");
  //   const selectedValue = await fpsSelector.inputValue();
  //   expect(selectedValue).toBe("30");
  // });

  // test("verifica la barra di progresso", async () => {
  //   const progressBar = await window.getByTestId("progress-bar");
  //   await expect(progressBar).toBeVisible();

  //   // Verifica l'interazione con la barra
  //   await progressBar.click({ position: { x: 100, y: 5 } });
  //   const value = await progressBar.getAttribute("aria-valuenow");
  //   expect(parseInt(value)).toBeGreaterThan(0);
  // });

  // test("verifica il menu contestuale", async () => {
  //   // Verifica la presenza del menu
  //   const menu = await window.getByTestId("context-menu");
  //   await expect(menu).toBeVisible();

  //   // Verifica le opzioni del menu
  //   const menuItems = await menu.getByRole("menuitem").all();
  //   expect(menuItems.length).toBeGreaterThan(0);
  // });
});
