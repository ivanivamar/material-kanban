import { Component, Injector, OnDestroy, ViewEncapsulation } from "@angular/core";

@Component({
    template: '',
    encapsulation: ViewEncapsulation.None
})
export abstract class  AppComponentBase implements OnDestroy {
	isLoading = false;

	constructor(
		injector: Injector
	) { 
	}

	ngOnDestroy(): void {
		this.isLoading = false;
	}

	isStringNullOrEmpty(value: string | null | undefined): boolean {
		return value === null || value === undefined || value === '';
	}
}
