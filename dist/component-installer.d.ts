import Registry from "./registry";
interface ComponentInstaller {
    install(registry: Registry): void;
}
export default ComponentInstaller;
