import { Locator, Page } from "@playwright/test";

export class BfIntepreterPage{

    readonly page;
    
    readonly txtBfCode: Locator;
    readonly bfOutputLabel: Locator;
    readonly lblError: Locator;

    readonly rangeSpeedSelect: Locator; 
    readonly btnLoad: Locator;
    readonly btnStep: Locator;
    readonly btnAutoPlay: Locator;
    readonly btnDownload: Locator;

    constructor (page:Page){
        this.page = page;

        this.txtBfCode = page.locator('#txtBfCode');
        this.bfOutputLabel = page.locator('#bfOutputLabel');
        this.lblError = page.locator('#lblError');

        this.rangeSpeedSelect = page.locator('#rangeSpeedSelect');
        this.btnLoad = page.locator('#btnLoad');
        this.btnStep = page.locator('#btnStep');
        this.btnAutoPlay = page.locator('#btnAutoPlay');
        this.btnDownload = page.locator('#btnDownload');
    }

    async navigate() {
      await this.page.goto('/bf'); 
    }

    getBFErrorSelector():string{
       return "#lblError";
    }

    getBfOutputSelector():string{
      return "#bfOutputLabel";
    }

    async changeProgramExecutionSpeed(speed:number){
        await this.page.$eval('#rangeSpeedSelect', (e, value) => {
            e.value = value;
            e.dispatchEvent(new Event('input', { 'bubbles': true }));
            e.dispatchEvent(new Event('change', { 'bubbles': true }));
        }, 10);
    }

    async enterBfProgram(bfCode:string){
        this.txtBfCode.fill(bfCode);
    }

}