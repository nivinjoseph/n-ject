import Registry from "./registry";

// public
interface ComponentInstaller
{
    install(registry: Registry): void;
}

export default ComponentInstaller;