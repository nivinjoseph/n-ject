import { Disposable } from "@nivinjoseph/n-util";
export interface ServiceLocator extends Disposable {
    resolve<T extends object>(key: string): T;
    createScope(): ServiceLocator;
}
//# sourceMappingURL=service-locator.d.ts.map