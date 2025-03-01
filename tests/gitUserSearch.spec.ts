import test, { expect } from "@playwright/test";
import { GitUserSearchPage } from "./gitUserSearch-page";

const VALID_USER = "oysters76"; 
const NON_EXISTENT_USER = "oysterblahblab";

test.describe('Git User Search Component', ()=>{
    let gitUserSearchPage: GitUserSearchPage; 

    test.beforeEach(async ({page})=>{
        gitUserSearchPage = new GitUserSearchPage(page);
        await gitUserSearchPage.navigate();
    });

    test("Should display loading indicator when an user is searched", 
        async()=>{
           await gitUserSearchPage.doGitUserSearch(VALID_USER); 
           await expect(gitUserSearchPage.loadingIndicator).toBeVisible();     
        }
    )

    test("Should display error message when search query search for non-existent user", async()=>{
        await gitUserSearchPage.doGitUserSearch(NON_EXISTENT_USER); 
        const errMessage = await gitUserSearchPage.getErrorMessage(); 
        await expect(errMessage).toContain("User doesn't exist!"); 
    }); 

    test('should display GitUserBadge when search is successful', async () => {
        await gitUserSearchPage.doGitUserSearch(VALID_USER);
        await expect(gitUserSearchPage.gitUserBadge).toBeVisible();
    });

    test('should disable search button while loading', async () => {
        await gitUserSearchPage.doGitUserSearch(VALID_USER);
        await expect(gitUserSearchPage.searchButton).toBeDisabled();
    });
});