import test, { expect } from "@playwright/test";
import { BfIntepreterPage } from "./BfIntepreter-page";
import { INVALID_BF_PROGRAMS, VALID_BF_PROGRAMS } from "./BFIntepreter-data";

test.describe("Bf Intepreter Component", ()=>{
    let bfIntepreterPage: BfIntepreterPage; 

    VALID_BF_PROGRAMS.forEach(({title, code,expected, programTimeout})=>{
        test(`BF Valid program: ${title} should ouput: ${expected}`, async ({page})=>{
            
            test.setTimeout(programTimeout*2);

            bfIntepreterPage = new BfIntepreterPage(page);
            await bfIntepreterPage.navigate(); 

            await bfIntepreterPage.enterBfProgram(code);
            await bfIntepreterPage.btnLoad.click(); 
            await bfIntepreterPage.changeProgramExecutionSpeed(1);

            await bfIntepreterPage.btnAutoPlay.click(); 
            
            const parameters = {
                selector:bfIntepreterPage.getBfOutputSelector(), 
                expected: expected
            }; 
            
            await page.waitForFunction(({selector, expected})=>{
                return document.querySelector(selector)?.textContent === expected;
            }, parameters, {timeout: programTimeout})

            await expect(bfIntepreterPage.bfOutputLabel).toHaveText(expected);

        });
    });

    INVALID_BF_PROGRAMS.forEach(({title, code, errorMessages, programTimeout})=>{
        errorMessages.forEach(({locale, message})=>{
            test(`BF Invalid Program: ${title} in locale: ${locale} should have error message:${message}`
                    , async({page})=>{
                        
                        test.setTimeout(programTimeout*2);

                        bfIntepreterPage = new BfIntepreterPage(page);
                        await bfIntepreterPage.navigate(); 

                        await page.evaluate((locale)=>{
                            localStorage.setItem('lang', locale);
                        }, locale);

                        await page.reload();
            
                        await bfIntepreterPage.enterBfProgram(code);
                        await bfIntepreterPage.btnLoad.click(); 

                        const parameters = {
                            selector: bfIntepreterPage.getBFErrorSelector(),
                            expected: message
                        }

                        await page.waitForFunction(({selector, expected})=>{
                            return document.querySelector(selector)?.textContent === expected;
                        }, parameters, {timeout: programTimeout})
            
                        await expect(bfIntepreterPage.lblError).toHaveText(message);      
                })
        })
    });

});