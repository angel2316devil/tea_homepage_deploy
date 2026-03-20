"use strict";
// フッターの年表示を現在年に更新するためのクラス
class FooterYearUpdater {
    // target: 年を表示する対象要素
    setCurrentYear(target) {
        target.textContent = new Date().getFullYear().toString();
    }
}
// 「ネットショッピングへ」ボタン群にクリック処理を設定するクラス
class ShopButtonController {
    constructor(
    // イベントを付与する購入導線ボタンの一覧
    buttons) {
        this.buttons = buttons;
    }
    // 各ボタンにクリックイベントを登録する関数
    bind() {
        // button: 個々の購入ボタン要素
        this.buttons.forEach((button) => {
            button.addEventListener("click", () => {
                window.location.href = "https://teacraft.theshop.jp";
            });
        });
    }
}
// ページ初期化処理をまとめるアプリケーションクラス
class HomepageApplication {
    // 初期表示時に必要なDOM取得と機能初期化を行う関数
    start() {
        // yearElement: フッター年表示の要素
        const yearElement = document.getElementById("current-year");
        if (yearElement instanceof HTMLElement) {
            new FooterYearUpdater().setCurrentYear(yearElement);
        }
        // shopButtons: ネットショッピング導線ボタン群
        const shopButtons = document.querySelectorAll('[data-action="open-shop"]');
        new ShopButtonController(shopButtons).bind();
    }
}
// アプリケーション起動
new HomepageApplication().start();
