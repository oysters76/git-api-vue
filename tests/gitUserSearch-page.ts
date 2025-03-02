import { Locator, Page } from "@playwright/test";

export class GitUserSearchPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly searchButton: Locator;
  readonly loadingIndicator: Locator;
  readonly errorMessage: Locator;
  readonly gitUserBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('#txtSearchGit');
    this.searchButton = page.locator('#btnSearchGitUser');
    this.loadingIndicator = page.locator('#loadingIndicator');
    this.errorMessage = page.locator('.error');
    this.gitUserBadge = page.locator('.badge');
  }

  async navigate() {
    await this.page.goto('/'); // Adjust the path as needed
  }

  async doGitUserSearch(gitUserName: string){
    await this.usernameInput.fill(gitUserName);
    await this.searchButton.click();
  }
  
  async isGitUserBadgeVisible() {
    return this.gitUserBadge.isVisible();
  }

}