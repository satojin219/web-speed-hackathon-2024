import path from 'node:path';

import { expect, test } from '@playwright/test';

test.describe('サービストップ', () => {
  test.beforeEach(async ({ context, page }) => {
    await context.addInitScript({
      path: path.join(__dirname, '..', '..', 'node_modules', 'mockdate', 'lib', 'mockdate.js'),
    });
    await context.addInitScript(() => {
      // @ts-expect-error MockDate is defined by the above script.
      MockDate.set(1711195200); // 2024-03-23T12:00:00.000Z
    });

    // Given
    await page.goto('/');
  });

  test('ヘッダーにヒーロー画像が表示されていること', async ({ page }) => {
    // Then
    const header = page.getByRole('banner');
    const heroImg = header.getByRole('img', { name: 'Cyber TOON' });
    await expect(heroImg).toBeVisible();
    await expect(heroImg).toHaveScreenshot('vrt-hero-img.png');
  });

  test('ヘッダーの検索アイコンをクリックすると、検索ページに遷移すること', async ({ page }) => {
    // When
    const header = page.getByRole('banner');
    await header.getByRole('link', { name: '検索' }).click();

    // Then
    await expect(page).toHaveURL('/search');
  });

  test('ピックアップセクションが表示されていること', async ({ page }) => {
    // Then
    const section = page.getByRole('region', { name: 'ピックアップ' });
    await expect(section).toBeVisible();
    const firstCard = section.getByRole('link').first();
    const firstCardImg = firstCard.getByRole('img').first();
    await firstCardImg.waitFor();
    await expect(firstCard).toHaveScreenshot('vrt-pickup-card.png');
  });

  test('ピックアップセクションで横スクロールバーが表示されていること', async ({ page }) => {
    // Then
    const section = page.getByRole('region', { name: 'ピックアップ' });
    const firstCard = section.getByRole('link').first();
    const firstCardImg = firstCard.getByRole('img').first();
    await section.scrollIntoViewIfNeeded();
    await expect(firstCard).toBeVisible();
    await section.scrollIntoViewIfNeeded();
    await expect(firstCardImg).toBeVisible();
    await firstCard.evaluate((card) => {
      const wrapper = card.parentNode as HTMLDivElement;
      return wrapper.scrollWidth > wrapper.clientWidth;
    });
  });

  test('ピックアップセクションでタブキーを10回押すと、11番目のカードが表示されること', async ({ page }) => {
    // Given
    const section = page.getByRole('region', { name: 'ピックアップ' });
    const firstCard = section.getByRole('link').first();
    await expect(firstCard).toBeVisible();
    await firstCard.focus();

    // When
    for (let i = 0; i < 10; i++) {
      const card = section.getByRole('link').nth(i);
      const image = card.getByRole('img').first();

      await expect(image).toBeVisible();
      await page.keyboard.press('Tab');
    }

    // Then
    const eleventhCard = section.getByRole('link').nth(10);
    await expect(eleventhCard).toBeInViewport();
    await expect(firstCard).not.toBeInViewport();
  });

  test('ピックアップセクションの先頭のカードをクリックすると、作品詳細ページに遷移すること', async ({ page }) => {
    // When
    const section = page.getByRole('region', { name: 'ピックアップ' });
    const firstCard = section.getByRole('link').first();
    await firstCard.click();

    // Then
    await expect(page).toHaveURL(/\/books\/[a-z0-9-]+$/);
  });

  test('ランキングセクションが表示されていること', async ({ page }) => {
    // Then
    const section = page.getByRole('region', { name: 'ランキング' });
    await expect(section).toBeVisible();
    const firstCard = section.getByRole('listitem').first();
    const firstCardImg = firstCard.getByRole('img').first();
    await firstCardImg.waitFor();
    await expect(firstCard).toContainText('この漫画を読む');
    await expect(firstCard).toHaveScreenshot('vrt-ranking-card.png');
  });

  test('ランキングセクションの先頭のアイテムをクリックすると、作品詳細ページに遷移すること', async ({ page }) => {
    // When
    const section = page.getByRole('region', { name: 'ランキング' });
    const firstCard = section.getByRole('listitem').first();
    await firstCard.getByRole('link').click();

    // Then
    await expect(page).toHaveURL(/\/books\/[a-z0-9-]+$/);
  });

  test('本日更新セクションが表示されていること', async ({ page }) => {
    // Then
    const section = page.getByRole('region', { name: '本日更新' });
    await expect(section).toBeVisible();
    const firstCard = section.getByRole('link').first();
    const firstCardImg = firstCard.getByRole('img').first();
    await firstCardImg.waitFor();
    await expect(firstCard).toHaveScreenshot('vrt-today-updates-card.png');
  });

  test('本日更新セクションで横スクロールバーが表示されていること', async ({ page }) => {
    // Then
    const section = page.getByRole('region', { name: '本日更新' });
    const firstCard = section.getByRole('link').first();
    const firstCardImg = firstCard.getByRole('img').first();
    await section.scrollIntoViewIfNeeded();
    await expect(firstCard).toBeVisible();
    await section.scrollIntoViewIfNeeded();
    await expect(firstCardImg).toBeVisible();
    await firstCard.evaluate((card) => {
      const wrapper = card.parentNode as HTMLDivElement;
      return wrapper.scrollWidth > wrapper.clientWidth;
    });
  });

  test('本日更新セクションの先頭のカードをクリックすると、作品詳細ページに遷移すること', async ({ page }) => {
    // When
    const section = page.getByRole('region', { name: '本日更新' });
    const firstCard = section.getByRole('link').first();
    await firstCard.click();

    // Then
    await expect(page).toHaveURL(/\/books\/[a-z0-9-]+$/);
  });
});
