import Lifestyle from "./lifestyle";

// public
interface Registry
{
    register(key: string, component: Function, lifestyle: Lifestyle): Registry;
}

export default Registry;