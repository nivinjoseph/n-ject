import { given } from "@nivinjoseph/n-defensive";
import { injectionsKey } from "./inject.js";
import { Lifestyle } from "./lifestyle.js";
// internal
export class ComponentRegistration {
    _key;
    _component;
    _lifestyle;
    _dependencies;
    _aliases;
    _isDisposed = false;
    _disposePromise = null;
    get key() { return this._key; }
    get component() { return this._component; }
    get lifestyle() { return this._lifestyle; }
    get dependencies() { return this._dependencies; }
    get aliases() { return this._aliases; }
    constructor(key, component, lifestyle, ...aliases) {
        given(key, "key").ensureHasValue().ensureIsString();
        given(component, "component").ensureHasValue();
        given(lifestyle, "lifestyle").ensureHasValue().ensureIsEnum(Lifestyle);
        given(aliases, "aliases").ensureHasValue().ensureIsArray()
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            .ensure(t => t.every(u => u != null), "alias cannot null")
            .ensure(t => t.every(u => u !== key), "alias cannot be the same as key")
            .ensure(t => t.length === t.map(u => u.trim()).distinct().length, "duplicates detected");
        this._key = key;
        this._component = component;
        this._lifestyle = lifestyle;
        this._dependencies = this._getDependencies();
        this._aliases = [...aliases.map(t => t.trim())];
    }
    async dispose() {
        if (!this._isDisposed) {
            this._isDisposed = true;
            this._disposePromise = this._disposeComponent();
        }
        return this._disposePromise;
    }
    async _disposeComponent() {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (typeof this._component !== "function" && this._component.dispose
            && typeof this._component.dispose === "function") {
            try {
                await this._component.dispose();
            }
            catch (error) {
                console.error(`Error: Failed to dispose component with key '${this._key}' of type '${this._component.getTypeName()}'.`);
                console.error(error);
            }
        }
    }
    _getDependencies() {
        if (this._lifestyle === Lifestyle.Instance)
            return new Array();
        const metadata = this._component[Symbol.metadata];
        if (metadata == null)
            return [];
        const dependencies = metadata[injectionsKey];
        if (dependencies == null)
            return [];
        return dependencies;
    }
}
//# sourceMappingURL=component-registration.js.map