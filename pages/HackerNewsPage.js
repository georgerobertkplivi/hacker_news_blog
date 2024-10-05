const { expect } = require('@playwright/test');

class HackerNewsPage {
  constructor(page) {
    this.page = page;
    this.articleSelector = '.athing';
    this.timeSelector = '.age';
    this.scoreSelector = '.score';
    this.titleSelector = '.titlelink';
    this.userSelector = '.hnuser';
  }

  async goto() {
    await this.page.goto('https://news.ycombinator.com/newest');
  }

  async getArticles(count = 100) {
    await this.page.waitForSelector(this.articleSelector);
    return this.page.$$eval(this.articleSelector, (elements, { count, timeSelector, titleSelector, scoreSelector, userSelector }) => {
      return elements.slice(0, count).map(el => {
        const subtext = el.nextElementSibling;
        const timeElement = subtext?.querySelector(timeSelector);
        const titleElement = el.querySelector(titleSelector);
        const scoreElement = subtext?.querySelector(scoreSelector);
        const userElement = subtext?.querySelector(userSelector);
        return {
          id: el.id ? parseInt(el.id) : null,
          time: timeElement ? timeElement.getAttribute('title') : null,
          title: titleElement ? titleElement.innerText.trim() : null,
          score: scoreElement ? parseInt(scoreElement.innerText) : null,
          user: userElement ? userElement.innerText.trim() : null
        };
      });
    }, { count, timeSelector: this.timeSelector, titleSelector: this.titleSelector, scoreSelector: this.scoreSelector, userSelector: this.userSelector });
  }

  async validateSorting(articles) {
    let isSorted = true;
    for (let i = 1; i < articles.length; i++) {
      const prevTime = new Date(articles[i - 1].time);
      const currTime = new Date(articles[i].time);
      if (prevTime < currTime) {
        isSorted = false;
        console.log(`Sorting error at article ${i}: ${articles[i-1].id} is older than ${articles[i].id}`);
        break;
      }
    }
    return isSorted;
  }

  async getArticleCount() {
    return this.page.$$eval(this.articleSelector, elements => elements.length);
  }

  async searchForTerm(term) {
    await this.page.waitForSelector('input[name="q"]');
    await this.page.fill('input[name="q"]', term);
    await this.page.press('input[name="q"]', 'Enter');
    await this.page.waitForNavigation({ waitUntil: 'networkidle' });
  }

  async clickMoreLink() {
    await this.page.click('a.morelink');
  }
}

module.exports = HackerNewsPage;
