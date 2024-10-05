const { test, expect } = require('@playwright/test');
const HackerNewsPage = require('../pages/HackerNewsPage');

test.describe('Hacker News Tests', () => {
  let page;
  let hackerNewsPage;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    hackerNewsPage = new HackerNewsPage(page);
    await hackerNewsPage.goto();
  });

  test('Validate first 100 articles are sorted newest to oldest', async () => {
    const articles = await hackerNewsPage.getArticles(100);
    const isSorted = await hackerNewsPage.validateSorting(articles);
    expect(isSorted).toBeTruthy();
  });

  test('Verify article count is at least 30', async () => {
    const count = await hackerNewsPage.getArticleCount();
    expect(count).toBeGreaterThanOrEqual(30);
  });

  test('Search for a specific term', async () => {
    const searchTerm = 'JavaScript';
    await hackerNewsPage.searchForTerm(searchTerm);
    await page.waitForNavigation({ waitUntil: 'networkidle' });
    const articles = await hackerNewsPage.getArticles(10);
    expect(articles.some(article => article.title && article.title.toLowerCase().includes(searchTerm.toLowerCase()))).toBeTruthy();
  }, 60000); // Increase timeout to 60 seconds

  test('Verify "More" link loads additional articles', async () => {
    const initialCount = await hackerNewsPage.getArticleCount();
    await hackerNewsPage.clickMoreLink();

    // Wait for new articles to load with retry logic
    let newCount;
    for (let i = 0; i < 5; i++) {
      await page.waitForTimeout(2000);
      newCount = await hackerNewsPage.getArticleCount();
      if (newCount > initialCount) break;
    }

    expect(newCount).toBeGreaterThan(initialCount);
  }, 60000); // Increase timeout to 60 seconds

  test('Verify article has non-empty title', async () => {
    const articles = await hackerNewsPage.getArticles(1);
    expect(articles[0]?.title).toBeTruthy();
  });

  test('Verify article has valid score', async () => {
    const articles = await hackerNewsPage.getArticles(1);
    expect(typeof articles[0]?.score).toBe('number');
  });

  test('Verify article has valid user', async () => {
    const articles = await hackerNewsPage.getArticles(1);
    expect(articles[0]?.user).toBeTruthy();
  });

  test('Verify article IDs are unique', async () => {
    const articles = await hackerNewsPage.getArticles(50);
    const ids = articles.map(article => article.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  test('Verify time difference between articles', async () => {
    const articles = await hackerNewsPage.getArticles(2);
    const timeDiff = new Date(articles[0].time) - new Date(articles[1].time);
    expect(timeDiff).toBeGreaterThanOrEqual(0);
  });

  test('Verify page title', async () => {
    const title = await page.title();
    expect(title).toBe('New Links | Hacker News');
  });

  // ... Add more tests here to reach about 20 tests in total
});
