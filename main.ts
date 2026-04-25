// フッターの年表示を現在年に更新するためのクラス
class FooterYearUpdater {
	// target: 年を表示する対象要素
	public setCurrentYear(target: HTMLElement): void {
		target.textContent = new Date().getFullYear().toString();
	}
}

// 「ネットショッピングへ」ボタン群にクリック処理を設定するクラス
class ShopButtonController {
	public constructor(
		// イベントを付与する購入導線ボタンの一覧
		private readonly buttons: NodeListOf<HTMLButtonElement>
	) {}

	// 各ボタンにクリックイベントを登録する関数
	public bind(): void {
		// button: 個々の購入ボタン要素
		this.buttons.forEach((button) => {
			button.addEventListener("click", () => {
				window.location.href = "https://teacraft.theshop.jp";
			});
		});
	}
}

// 画像ギャラリーを無限ループで自動横スクロールするクラス
class AutoScrollGalleryController {
	private animationFrameId: number | null = null;
	private previousTimestamp = 0;
	private originalTrackWidth = 0;
	private isAnimationStarted = false;
	private readonly boundResizeHandler: () => void;

	public constructor(
		private readonly scroller: HTMLElement,
		private readonly pixelsPerSecond: number = 55
	) {
		this.boundResizeHandler = () => {
			this.refreshTrackWidth();
		};
	}

	public bind(): void {
		const track = this.scroller.querySelector<HTMLElement>(".gallery-track");
		if (!(track instanceof HTMLElement)) {
			return;
		}

		const originalChildren = Array.from(track.children);
		if (originalChildren.length === 0) {
			return;
		}

		originalChildren.forEach((child) => {
			const clone = child.cloneNode(true);
			track.appendChild(clone);
		});

		this.refreshTrackWidth();
		window.addEventListener("resize", this.boundResizeHandler);

		this.scroller.addEventListener("scroll", () => {
			this.normalizeScrollPosition();
		});

		window.addEventListener("load", () => {
			this.refreshTrackWidth();
			this.startAnimation();
		});

		if (document.readyState === "complete") {
			this.refreshTrackWidth();
			this.startAnimation();
		}
	}

	private tick(timestamp: number): void {
		const deltaSeconds = (timestamp - this.previousTimestamp) / 1000;
		this.previousTimestamp = timestamp;

		this.scroller.scrollLeft += this.pixelsPerSecond * deltaSeconds;
		this.normalizeScrollPosition();

		this.animationFrameId = window.requestAnimationFrame((nextTimestamp) => {
			this.tick(nextTimestamp);
		});
	}

	private normalizeScrollPosition(): void {
		if (this.originalTrackWidth <= 0) {
			return;
		}

		if (this.scroller.scrollLeft >= this.originalTrackWidth) {
			this.scroller.scrollLeft -= this.originalTrackWidth;
		}

		if (this.scroller.scrollLeft < 0) {
			this.scroller.scrollLeft += this.originalTrackWidth;
		}
	}

	private refreshTrackWidth(): void {
		const track = this.scroller.querySelector<HTMLElement>(".gallery-track");
		if (!(track instanceof HTMLElement)) {
			return;
		}
		this.originalTrackWidth = track.scrollWidth / 2;
	}

	private startAnimation(): void {
		if (this.isAnimationStarted) {
			return;
		}
		this.isAnimationStarted = true;
		this.animationFrameId = window.requestAnimationFrame((timestamp) => {
			this.previousTimestamp = timestamp;
			this.tick(timestamp);
		});
	}
}

// ページ初期化処理をまとめるアプリケーションクラス
class HomepageApplication {
	// 初期表示時に必要なDOM取得と機能初期化を行う関数
	public start(): void {
		// yearElement: フッター年表示の要素
		const yearElement = document.getElementById("current-year");
		if (yearElement instanceof HTMLElement) {
			new FooterYearUpdater().setCurrentYear(yearElement);
		}
		// shopButtons: ネットショッピング導線ボタン群
		const shopButtons = document.querySelectorAll<HTMLButtonElement>('[data-action="open-shop"]');
		new ShopButtonController(shopButtons).bind();

		// galleryScroller: 画像横スクロールギャラリー要素
		const galleryScroller = document.querySelector<HTMLElement>('[data-auto-scroll="gallery"]');
		if (galleryScroller instanceof HTMLElement) {
			new AutoScrollGalleryController(galleryScroller).bind();
		}
	}
}

// アプリケーション起動
new HomepageApplication().start();
